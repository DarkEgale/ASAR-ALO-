import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import { X, Send, User, MessageCircle } from 'lucide-react';
import './livechat.scss';

const socket = io("https://asar-alo.onrender.com");

const ChatComponent = ({ roomId, user, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`https://asar-alo.onrender.com/api/chat/history/${roomId}`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        
        const formattedData = data.map(msg => ({
          sender: msg.senderName,
          message: msg.message,
          time: msg.time,
          senderId: msg.senderId
        }));
        setChatHistory(formattedData);
      } catch (err) {
        console.error("History loading error:", err);
      }
    };

    fetchHistory();
    socket.emit("join_room", roomId);

    const handleReceiveMessage = (data) => {
      setChatHistory((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "" && user) {
      const messageData = {
        roomId,
        sender: user?.name,
        senderId: user?._id,
        message: message?.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  return (
    <div className="premium-chat-wrapper">
      <div className="chat-header">
        <div className="header-info">
          <div className="avatar">
            <User size={20} />
            <span className="status-indicator"></span>
          </div>
          <div className="text-details">
            <h4>Support Chat</h4>
            <p>Online | Room: {roomId}</p>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">
          <X size={20} />
        </button>
      </div>

      <div className="messages-area">
        {chatHistory.length === 0 && (
          <div className="empty-chat">
            <MessageCircle size={40} />
            <p>Start a conversation with us!</p>
          </div>
        )}
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message-group ${msg.senderId === user?._id ? "own" : "other"}`}>
            <div className="bubble">
              <p>{msg.message}</p>
              <span className="time">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-area">
        <input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type a message..." 
        />
        <button type="submit" disabled={!message.trim()} className="send-btn">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;