import app from './App.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import Message from './models/Message.js'; 

dotenv.config();

// Connect to Database
connectDB();

const server = http.createServer(app);

// ... আগের ইমপোর্ট এবং সার্ভার সেটআপ ...

const onlineUsers = new Map(); 

io.on('connection', (socket) => {
    // ১. রেজিস্ট্রেশন
    socket.on('register_user', (userId) => {
        if (userId) {
            onlineUsers.set(userId, socket.id);
            io.emit('online_users_list', Array.from(onlineUsers.keys()));
            console.log(`User Registered: ${userId} | Total Online: ${onlineUsers.size}`);
        }
    });

    // ২. রুম জয়েন
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
    });

    // ৩. মেসেজ আদান-প্রদান (যা উপরে দিয়েছি)
    // socket.on('send_message', ... )

    // ৪. ডিসকানেক্ট
    socket.on('disconnect', () => {
        let disconnectedUserId = null;
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                onlineUsers.delete(userId);
                break;
            }
        }
        if (disconnectedUserId) {
            io.emit('online_users_list', Array.from(onlineUsers.keys()));
        }
        console.log('A user disconnected');
    });
});

// ... পোর্ট এবং সার্ভার লিসেন ...

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});