import React from "react";

const Avatar = ({ name }) => {
  // Function to get the first word and capitalize it
  const getInitials = (name) => {
    if (!name) return "";
    const firstWord = name.split(" ")[0];
    return firstWord.charAt(0).toUpperCase();
  };
  return (
    <div className="avatar placeholder">
      <div className="bg-neutral text-neutral-content w-8 rounded-full">
        <span className="text-xs">{getInitials(name)}</span>
      </div>
    </div>
  );
};

export default Avatar;
