// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();
export const db = getFirestore(app);
export const createUserDocumentFromAuth = async (
  userAuth,
  postalCode,
  address,
  church
) => {
  const userDocRef = doc(db, "users", userAuth.uid);
  //console.log(userDocRef);
  const prayers = [];
  const userSnapshot = await getDoc(userDocRef);
  //console.log(userSnapshot);
  if (!userSnapshot.exists()) {
    const { email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        email,
        createdAt,
        postalCode,
        address,
        church,
        prayers,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  return userDocRef;
};
export { app, auth };

// Function to get the next chatId
export const getOrCreateActiveChat = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    let prayers = userData.prayers || [];

    // Find the first open chat
    const openChat = prayers.find((prayer) => !prayer.chatClosed);

    if (openChat) {
      //console.log("open chat exists");
      //console.log(openChat);
      return { chatId: openChat.chatId, isNewChat: false };
    } else {
      // Create a new chat if no open chat exists
      //console.log("Create a new chat if no open chat exists");
      const newChatId =
        prayers.length > 0 ? Math.max(...prayers.map((p) => p.chatId)) + 1 : 1;

      const newChat = {
        chatId: newChatId,
        firstChatTime: new Date(),
        title: "",
        chatClosed: false,
        chat: [],
      };

      await updateDoc(userDocRef, {
        prayers: arrayUnion(newChat),
      });

      return { chatId: newChatId, isNewChat: true };
    }
  } else {
    // If user document doesn't exist, create it with the first chat
    //console.log(
    //  "If user document doesn't exist, create it with the first chat"
    //);
    const newChat = {
      chatId: 1,
      firstChatTime: new Date(),
      title: "",
      chatClosed: false,
      chat: [],
    };

    await setDoc(userDocRef, {
      prayers: [newChat],
    });

    return { chatId: 1, isNewChat: true };
  }
};

// Function to close all active chats
export const closeAllChats = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const prayers = userData.prayers || [];

    const updatedPrayers = prayers.map((prayer) => ({
      ...prayer,
      chatClosed: true,
    }));

    await updateDoc(userDocRef, { prayers: updatedPrayers });
  }
};

// Function to save a chat message
export const saveChatMessage = async (userId, chatId, isUser, text) => {
  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const prayers = userData.prayers || [];
    const chatIndex = prayers.findIndex(
      (prayer) => prayer.chatId === chatId && !prayer.chatClosed
    );

    if (chatIndex !== -1) {
      const updatedPrayers = [...prayers];
      updatedPrayers[chatIndex].chat.push({
        role: isUser,
        content: text,
        createdAt: new Date(),
      });

      // Update title if it's the first message
      if (updatedPrayers[chatIndex].chat.length === 2) {
        updatedPrayers[chatIndex].title = text.split("\n")[0];
      }

      await updateDoc(userDocRef, { prayers: updatedPrayers });
    }
  }
};

export const getExistingChatMessages = async (userId, chatId) => {
  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const prayers = userData.prayers || [];
    const chat = prayers.find((prayer) => prayer.chatId === chatId);
    //console.log(chat);
    if (chat && chat.chat) {
      //console.log(chat);
      return chat.chat;
    }
  }

  return [];
};
export const getChatStatus = async (userId, chatId) => {
  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const prayers = userData.prayers || [];
    const chat = prayers.find((prayer) => prayer.chatId === chatId);

    if (chat) {
      //console.log(chat);
      return chat.chatClosed;
    }
  }

  return false; // Default to false if chat not found
};
