/**
 * @file  src/app/chat/page.js
 * @description
 * This module contains Diario Component and capture all messages
 * from user and show system response
 * @date 12/08/2024
 * @maintainer Orare Team
 * @inputs
 * - message: Last user's message from Diario Component
 * @outputs
 * - Returns a response genenerated
 * @dependencies
 * - useChat for the Hook
 * @logs
 * - Added a new feature for input text called textarea
 */

"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import Bubble from "@/components/bubble/Bubble";
import { useChat } from "ai/react";
import { useSearchParams } from "next/navigation";
import {
  saveChatMessage,
  getOrCreateActiveChat,
  getExistingChatMessages,
  getChatStatus,
} from "../firebase";
import { useSession } from "next-auth/react";

const ChatPage = () => {
  const { data: session } = useSession();
  const userId = session?.user.id || null;
  const [chatId, setChatId] = useState(null);
  const [savedMessages, setSavedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const initializationRef = useRef(false);
  const searchParams = useSearchParams();
  const chatIdFromUrl = searchParams.get("id");
  const [isChatClosed, setIsChatClosed] = useState(false);
  const [isSystemResponding, setIsSystemResponding] = useState(false);

  // Mensaje de bienvenida del sistema

  const welcomeMessage = `
    Bienvenido/a a Oraré! 🙏
    
    Te invitamos a compartir una oración con nosotros y Oraré te recomendará un pasaje bíblico para acompañarte en tu reflexión. \n

    ¡Tu oración puede ser tan simple o detallada como desees! 
    `;

  // Set the useChat hook to handle comunication with our API Chat

  useEffect(() => {
    const initializeChat = async () => {
      if (!initializationRef.current && session?.user?.id) {
        initializationRef.current = true;
        setLoading(true);
        try {
          let newChatId;
          let isNewChat = false;

          if (chatIdFromUrl) {
            // Load the specific chat if an ID is provided in the URL
            newChatId = parseInt(chatIdFromUrl, 10);
            //console.log(newChatId);
            const chatClosed = await getChatStatus(session.user.id, newChatId);
            setIsChatClosed(chatClosed);
          } else {
            // Get or create an active chat if no ID is provided
            const result = await getOrCreateActiveChat(session.user.id);
            //console.log("getOrCreateActiveChat");
            newChatId = result.chatId;
            isNewChat = result.isNewChat;
          }

          setChatId(newChatId);

          if (isNewChat) {
            //console.log(chatIdFromUrl);
            const initialMessage = {
              role: "assistant",
              content: welcomeMessage,
              createdAt: new Date(),
            };
            setSavedMessages([initialMessage]);
            await saveChatMessage(
              session.user.id,
              newChatId,
              "assistant",
              welcomeMessage
            );
          } else {
            //console.log(chatIdFromUrl);
            const existingMessages = await getExistingChatMessages(
              session.user.id,
              newChatId
            );

            setSavedMessages(existingMessages);
          }
        } catch (error) {
          console.error("Error initializing chat:", error);
          initializationRef.current = false;
        } finally {
          setLoading(false);
        }
      }
    };
    //console.log(chatIdFromUrl);

    initializeChat();
  }, [session, chatIdFromUrl]);
  initializationRef.current = false;
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat-pry/", // Our API path
      body: {
        chatId,
      },
      initialMessages: [],

      onFinish: (message) => {
        if (chatId !== null) {
          const newMessage = {
            role: "assistant",
            content: message.content,
            createdAt: new Date(),
          };
          setSavedMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = newMessage;
            return updatedMessages;
          });
          saveChatMessage(
            session.user.id,
            chatId,
            "assistant",
            message.content
          );
          setIsSystemResponding(false);
        } // Save complete system response
      },
    });

  const handleUserMessageSubmit = async (e) => {
    e.preventDefault();
    if (!isLoading && input.trim() && chatId !== null) {
      const userMessage = {
        role: "user",
        content: input.trim(),
        createdAt: new Date(),
      };
      setSavedMessages((prevMessages) => [...prevMessages, userMessage]);
      await saveChatMessage(session.user.id, chatId, "user", input.trim());
      // Add a placeholder for the system response
      setSavedMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "", createdAt: new Date() },
      ]);
      setIsSystemResponding(true);
      handleSubmit(e);
    }
  };

  // It scrolls automaticly to last message
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [savedMessages, messages]);

  // Ref for the textarea
  const textAreaRef = useRef(null);

  // Adjust the textarea height based on the content
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto"; // Reset height to auto to recalculate
      textArea.style.height = `${textArea.scrollHeight}px`; // Set height based on scroll height
    }
  }, [input]);

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <div className="flex-1 p-4 pb-20 pt-16 overflow-y-auto">
          {savedMessages.map((m, index) => {
            return (
              <Bubble
                key={index}
                message={m.content}
                isUser={m.role !== "assistant"}
                chatId={chatId}
                isLoading={
                  index === savedMessages.length - 1 && isSystemResponding
                }
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        {!isChatClosed && (
          <div className="fixed bottom-0 w-full p-4 bg-white left-0">
            <div className="flex justify-center max-w-screen-lg mx-auto w-full">
              <textarea
                ref={textAreaRef}
                placeholder="Escribe tu oración aquí"
                className="textarea textarea-bordered w-full resize-none bg-white text-gray-700"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  resize: 'none',
                  boxSizing: 'border-box',
                  overflowY: 'auto',
                  fontSize: '16px',
                }}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading && input.trim()) {
                    handleUserMessageSubmit(e); // Use custom handler // Send message to our API
                  }
                }}
                rows={1} // Start with a single row
              />
              <div className="flex-col content-end">
                <button
                  className="btn btn-accent ml-2 "
                  onClick={(e) => {
                    if (!isLoading && input.trim()) {
                      handleUserMessageSubmit(e); // Send message to our API
                    }
                  }}
                  disabled={isLoading || !input.trim()}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const Chat = () => {
  return (
    <Suspense>
      <ChatPage />
    </Suspense>
  );
};
export default Chat;
