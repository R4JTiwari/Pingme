const Message = require("../models/message.model");


// Send message
const sendMessage = async (req, res) => {

    try {

        const { sender, receiver, text } = req.body;

        const message = await Message.create({
            sender,
            receiver,
            content: text
        });

        res.status(201).json(message);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};


// Get messages between two users
const getMessages = async (req, res) => {

    try {

        const { senderId, receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

module.exports = {
    sendMessage,
    getMessages
};