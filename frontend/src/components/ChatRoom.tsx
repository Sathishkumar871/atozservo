// ✅ src/components/ChatRoom.tsx — Premium Redesign
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPhoneCall, FiPaperclip } from "react-icons/fi";
import { IoVideocamOutline, IoSendOutline } from "react-icons/io5";
import socket from "../socket";
import "./ChatRoom.css";

interface Message {
  text?: string;
  image?: string;
  from: "me" | "friend";
  time: string;
}

const ChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    socket.on("message", (data: Message) => {
      setMessages((prev) => [...prev, { ...data, from: "friend" }]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg: Message = {
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      from: "me",
    };

    socket.emit("message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const imageMsg: Message = {
        image: base64,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        from: "me",
      };
      socket.emit("message", imageMsg);
      setMessages((prev) => [...prev, imageMsg]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="chatroom-wrapper">
      <div className="chatroom-header glass-header">
        <div className="left-section">
          <button onClick={() => navigate(-1)} className="round-btn">
            <FiArrowLeft />
          </button>
          <img src="/profile.jpg" className="header-profile" alt="user" />
          <div className="user-labels">
            <h3>Sathish Kumar</h3>
            <small>Online</small>
          </div>
        </div>
        <div className="right-section">
          <FiPhoneCall className="icon-btn" onClick={() => navigate("/video")} />
          <IoVideocamOutline className="icon-btn" onClick={() => navigate("/video")} />
        </div>
      </div>

      <div className="chatroom-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`bubble ${msg.from}`}>
            {msg.text && <p>{msg.text}</p>}
            {msg.image && <img src={msg.image} alt="sent" className="chat-image" />}
            <span>{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatroom-input">
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <FiPaperclip
          className="attach-icon"
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}><IoSendOutline /></button>
      </div>
    </div>
  );
};

export default ChatRoom;