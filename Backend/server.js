require('dotenv').config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const Message = require("./src/models/message.model");

connectDB();

const server = http.createServer(app);

// Socket setup
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Store online users
const onlineUsers = {};

// Socket Auth Middleware
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication error"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);

        socket.userId = decoded.userId;

        next();

    } catch (error) {
        next(new Error("Authentication error"));
    }
});

//  Main Socket Logic
io.on("connection", (socket) => {

    console.log("User connected:", socket.userId);

    onlineUsers[socket.userId] = socket.id;

    // Send message
    socket.on("sendMessage", async ({ receiver, content }) => {
        try {

            const message = await Message.create({
                sender: socket.userId,
                receiver,
                content
            });

            const receiverSocket = onlineUsers[receiver];

            if (receiverSocket) {
                io.to(receiverSocket).emit("receiveMessage", message);
            }

        } catch (error) {
            console.log("Socket Error:", error);
        }
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.userId);

        delete onlineUsers[socket.userId];
    });
});

// Start server
server.listen(3000, () => {
    console.log("Server running on port 3000");
});