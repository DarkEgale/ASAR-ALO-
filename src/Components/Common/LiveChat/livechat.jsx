import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import './livechat.scss'


const socket = io("https://asar-alo.onrender.com"); 

const ChatComponent = ({ roomId, user }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {

    socket.emit("join_room", roomId);


    socket.on("receive_message", (data) => {
      setChatHistory((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      const messageData = {
        roomId: roomId,
        sender: user.name,
        message: message,
        time: new Date().toLocaleTimeString()
      };


      socket.emit("send_message", messageData);
      

      setChatHistory((prev) => [...prev, messageData]);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {chatHistory.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="wrrite message...." 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;