import app from './App.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();


connectDB();


const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin:[
            "https://www.mdshimulhossen.top", 
            "http://localhost:5173",
            "http://localhost:3000",
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);


    socket.on('join_room', (roomId) => {
        socket.join(roomId);
    });


    socket.on('send_message', (data) => {

        io.to(data.roomId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User has disconnected');
    });
});


const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});