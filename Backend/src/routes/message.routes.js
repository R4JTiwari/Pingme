const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

const {
    getConversations,
    sendMessage,
    getMessages
} = require("../controllers/message.controller");

router.post("/send", authMiddleware, sendMessage);
router.get("/:senderId/:receiverId", getMessages);

module.exports = router;