const User=require("../models/user.model");
const bcrypt = require("bcryptjs");

// Register User
const registerUser = async (req, res) => {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        message: "User registered successfully",
        User
    });

};

// Login User
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.json({
            message: "Login successful",
            user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

module.exports = {
    registerUser,
    loginUser
};