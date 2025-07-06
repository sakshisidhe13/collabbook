import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../socket";
import { useSelector } from "react-redux"; // to get logged-in user name

const CollaborativeEditor = ({ entryId, initialContent = "" }) => {
  const [content, setContent] = useState(initialContent);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeout = useRef(null);

  const user = useSelector((state) => state.user.userInfo); // assumes your userSlice is set up

  useEffect(() => {
    socket.emit("joinRoom", entryId);

    socket.on("receiveUpdate", (newContent) => {
      setContent(newContent);
    });

    // ✅ Listen for "someone is typing"
    socket.on("showTyping", (username) => {
      setTypingUser(username);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTypingUser(null), 3000);
    });

    return () => {
      socket.off("receiveUpdate");
      socket.off("showTyping");
    };
  }, [entryId]);

  const handleChange = (e) => {
    const updated = e.target.value;
    setContent(updated);

    // Send update to others
    socket.emit("sendUpdate", { roomId: entryId, content: updated });

    // Notify others that this user is typing
    socket.emit("typing", { roomId: entryId, user: user?.name || "Someone" });
  };

  return (
    <div className="relative">
      {typingUser && (
        <div className="absolute -top-6 left-0 text-sm text-gray-500">
          ✍️ {typingUser} is typing...
        </div>
      )}
      <textarea
        value={content}
        onChange={handleChange}
        className="w-full h-96 p-4 bg-gray-100 rounded-md"
        placeholder="Start writing..."
      />
    </div>
  );
};

export default CollaborativeEditor;