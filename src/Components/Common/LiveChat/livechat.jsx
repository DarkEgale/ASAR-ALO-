import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import { X, Send, User, MessageCircle } from 'lucide-react';
import './livechat.scss';

// Socket connection initialization
const socket = io("https://asar-alo.onrender.com");

const ChatComponent = ({ roomId, user, targetUserId, isopen }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]); 
  const scrollRef = useRef(null);

  useEffect(() => {
    // ১. ইউজার কানেক্ট হলে সার্ভারে নিজের আইডি রেজিস্টার করা
    if (user?._id) {
      socket.emit("register_user", user._id);
    }

    // ২. অনলাইন ইউজারদের বর্তমান লিস্ট রিসিভ করা
    socket.on("online_users_list", (users) => {
      setActiveUsers(users);
    });

    // ৩. চ্যাট হিস্ট্রি ডাটাবেস থেকে নিয়ে আসা
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

    // ৪. নতুন মেসেজ রিসিভ করার লজিক
    const handleReceiveMessage = (data) => {
      setChatHistory((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);
    
    // Cleanup function
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("online_users_list");
    };
  }, [roomId, user?._id]);

  // অটো স্ক্রল টু বটম
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

  // স্ট্যাটাস চেক: চেক করবে targetUserId অনলাইন লিস্টে আছে কি না
  const isOnline = activeUsers.some(id => String(id) === String(targetUserId));

  return (
    <div className="premium-chat-wrapper">
      <div className="chat-header">
        <div className="header-info">
          <div className="avatar">
            <User size={20} />
            {/* ডাইনামিক স্ট্যাটাস ডট */}
            <span 
              className={`status-indicator ${isOnline ? 'online' : 'offline'}`} 
              style={{ background: isOnline ? '#4caf50' : '#9e9e9e' }}
            ></span>
          </div>
          <div className="text-details">
            <h4>Support Chat</h4>
            <p>
              <span style={{ color: isOnline ? '#4caf50' : '#9e9e9e', fontWeight: 'bold' }}>
                {isOnline ? "● Active Now" : "○ Offline"}
              </span> 
              {` | Room: ${roomId.slice(-5)}`}
            </p>
          </div>
        </div>
        <button onClick={isopen} className="close-btn">
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