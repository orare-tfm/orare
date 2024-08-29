// components/Layout.js
"use client";
import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

const Layout = ({ children, setNewChatClicked }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setNewChatClicked={setNewChatClicked}
      />
      <div className="flex flex-col flex-grow">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
