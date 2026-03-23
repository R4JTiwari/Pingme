import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Chat() {

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const receiverId = "69bcccdfa9d50d828bb48f54"; // 🔥 replace this

  useEffect(() => {

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    const newSocket = io("http://localhost:3000", {
      auth: {
        token: token
      }
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.log("Socket Error:", err.message);
    });

    newSocket.on("receiveMessage", (msg) => {
      console.log("Received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();

  }, []);

  const sendMessage = () => {
    if (!message || !socket) return;

    socket.emit("sendMessage", {
      receiver: receiverId,
      content: message
    });

    // show own message
    setMessages((prev) => [...prev, { content: message }]);

    setMessage("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: "25%",
        background: "#111",
        color: "white",
        padding: "10px"
      }}>
        <h3>Users</h3>
        <div>User 1</div>
        <div>User 2</div>
      </div>

      {/* Chat Section */}
      <div style={{
        width: "75%",
        display: "flex",
        flexDirection: "column"
      }}>

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: "10px",
          overflowY: "scroll",
          background: "#f5f5f5"
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              {msg.content}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ccc"
        }}>
          <input
            style={{ flex: 1, padding: "10px" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
          />

          <button onClick={sendMessage}>Send</button>
        </div>

      </div>

    </div>
  );
}

export default Chat;