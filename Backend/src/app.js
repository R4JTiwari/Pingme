const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");
const contactRoutes = require("./routes/contact.routes");

app.use(express.json());

app.use(cors({
    origin: "*"
}));

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contacts", contactRoutes);


module.exports = app;