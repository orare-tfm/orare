import React from "react";
import ChatLoader from "../spinner/ChatLoader";

const Bubble = ({ message, isUser, isLoading }) => {
  const blocks = message.split("\n");
  const backgroundStyle = isUser
    ? { backgroundColor: "#a18fc9" }
    : { backgroundColor: "#d4f4e4" };

  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      <div
        className={`chat-bubble ${
          isUser ? "text-neutral-200" : "text-cyan-600"
        }`}
        style={backgroundStyle}
      >
        {!isUser && isLoading ? (
          <ChatLoader />
        ) : (
          blocks.map((block, index) => (
            <div key={index} style={{ marginBottom: "16px" }}>
              {block
                .trim()
                .split("\n")
                .map((line, lineIndex) => (
                  <span key={lineIndex} style={{ display: "block" }}>
                    {line}
                  </span>
                ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bubble;
