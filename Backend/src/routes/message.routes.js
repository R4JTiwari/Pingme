const express = require("express");
const router = express.Router();

const {
    sendMessage,
    getMessages
} = require("../controllers/message.controller");

router.post("/send", sendMessage);
router.get("/:senderId/:receiverId", getMessages);

module.exports = router;