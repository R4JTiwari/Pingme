const express = require("express");
const app = express();

const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

module.exports = app;