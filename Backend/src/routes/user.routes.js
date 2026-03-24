const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser, 
    getUserByPhone
} = require("../controllers/user.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/phone/:phone", getUserByPhone);

module.exports = router;