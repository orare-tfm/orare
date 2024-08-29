"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Avatar from "../avatar/Avatar";
import { useSession } from "next-auth/react";
import { db } from "../../app/firebase"; // Adjust the import path as needed
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import format from "date-fns/format";
import { closeAllChats, getOrCreateActiveChat } from "../../app/firebase";

const Sidebar = ({ isSidebarOpen, toggleSidebar, setNewChatClicked }) => {
  const { data: session } = useSession();
  const [prayers, setPrayers] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPrayers = async () => {
      if (session?.user?.id) {
        const userDocRef = doc(db, "users", session.user.id);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setPrayers(userData.prayers || []);
        }
      }
    };

    fetchPrayers();
  }, [session?.user?.id, prayers]); // Change dependency to session.user.id to avoid repeated calls

  const handleChatClick = (chatId) => {
    const currentChatId = searchParams.get("id");
    if (pathname === "/chat" && currentChatId === chatId.toString()) {
      toggleSidebar();
    } else {
      router.push(`/chat?id=${chatId}`);
      toggleSidebar();
    }
  };

  const truncateTitle = (title) => {
    return title.length > 15 ? `${title.slice(0, 15)}...` : title;
  };

  const parseDateFunc = useCallback((prayer) => {
    if (prayer.firstChatTime && typeof prayer.firstChatTime === "object") {
      return new Timestamp(
        prayer.firstChatTime.seconds,
        prayer.firstChatTime.nanoseconds
      ).toDate();
    } else {
      return new Date(prayer.firstChatTime);
    }
  }, []);
  const handleNewChat = async () => {
    if (session?.user?.id) {
      await closeAllChats(session.user.id);
      const { lastChatId } = await getOrCreateActiveChat(session.user.id);
      setNewChatClicked(true);
      router.push(`/chat?id=${lastChatId}`);
      toggleSidebar();
    }
  };
  const groupedPrayers = useMemo(() => {
    const grouped = prayers.reduce((acc, prayer) => {
      let date = "Invalid Date";
      try {
        const parsedDate = parseDateFunc(prayer);
        if (!isNaN(parsedDate)) {
          date = format(parsedDate, "MMMM d, yyyy");
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(prayer);
      return acc;
    }, {});

    return Object.entries(grouped).sort(
      ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
    );
  }, [prayers, parseDateFunc]);

  const formatTime = useCallback(
    (prayer) => {
      const date = parseDateFunc(prayer);
      return format(date, "HH:mm");
    },
    [parseDateFunc]
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 bg-gray-100 transform overflow-scroll ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out w-80`}
    >
      {session?.user && (
        <div className="bg-gray-100 sticky top-0 z-20 flex items-center gap-2 bg-opacity-90 px-4 py-2 backdrop-blur lg:flex ">
          <Link href="/chat" className="flex-0 btn btn-ghost px-2">
            <Avatar name={session.user.email} />
          </Link>
        </div>
      )}
      <div className="h-4"></div>
      <div className="flex items-center justify-center">
        <button className="btn  btn-accent btn-wide" onClick={handleNewChat}>
          Nueva Oracion
        </button>
      </div>

      <ul className="menu px-4 py-0">
        {groupedPrayers.map(([date, prayers], dateIndex) => (
          <React.Fragment key={dateIndex}>
            <li className="text-xs font-bold text-gray-500 mt-4 mb-2">
              {date}
            </li>
            {prayers
              .slice()
              .sort((a, b) => b.chatId - a.chatId)
              .map((prayer, prayerIndex) => (
                <li key={prayerIndex} className="mb-0">
                  <div
                    className="flex justify-between items-center mb-1 "
                    onClick={() => handleChatClick(prayer.chatId)}
                  >
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-500 mr-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                      </svg>
                      <span className="text-gray-600">
                        {truncateTitle(prayer.title || "Nuevo Oración")}
                      </span>
                    </div>

                    <span className="text-xs text-gray-500">
                      {formatTime(prayer)}
                    </span>
                  </div>
                </li>
              ))}
          </React.Fragment>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
