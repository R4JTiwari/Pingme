import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Chat() {

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [phone, setPhone] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const bottomRef = useRef();

  // ✅ Token handling
  const token = localStorage.getItem("token");

  let currentUserId = null;

  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = decoded.userId;
  }

  const receiverId = selectedUser?._id;

  // 🔥 Fetch contacts
  useEffect(() => {

    const fetchContacts = async () => {
      try {
        const res = await axios.get(
          `https://pingme-g1m4.onrender.com/api/contacts/${currentUserId}`
        );

        setContacts(res.data);

      } catch (error) {
        console.log("Error fetching contacts");
      }
    };

    if (currentUserId) fetchContacts();

  }, [currentUserId]);

  //  Fetch messages
  useEffect(() => {

    const fetchMessages = async () => {

      if (!selectedUser) return;

      setMessages([]);

      try {
        const res = await axios.get(
          `https://pingme-g1m4.onrender.com/api/messages/${currentUserId}/${selectedUser._id}`
        );

        setMessages(res.data);

      } catch (error) {
        console.log("Error fetching messages");
      }
    };

    fetchMessages();

  }, [selectedUser]);

  //  Socket connection
  useEffect(() => {

    const newSocket = io("https://pingme-g1m4.onrender.com", {
      auth: {
        token: token
      }
    });

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();

  }, []);

  //  Search + Add Contact
  const searchUser = async () => {
    try {

      const res = await axios.get(
        `https://pingme-g1m4.onrender.com/api/users/phone/${phone}`
      );

      if (res.data._id === currentUserId) {
        alert("You can't chat with yourself");
        return;
      }

      //  Add contact
      await axios.post("https://pingme-g1m4.onrender.com/api/contacts/add", {
        userId: currentUserId,
        contactId: res.data._id
      });

      setSelectedUser(res.data);

      // refresh contacts
      const updated = await axios.get(
        `https://pingme-g1m4.onrender.com/api/contacts/${currentUserId}`
      );
      setContacts(updated.data);

    } catch (err) {
      alert("User not found");
    }
  };


  const sendMessage = () => {

    if (!selectedUser) {
      alert("Select user first");
      return;
    }

    if (!message || !socket) return;

    socket.emit("sendMessage", {
      receiver: receiverId,
      content: message
    });

    setMessages((prev) => [
      ...prev,
      {
        content: message,
        sender: currentUserId
      }
    ]);

    setMessage("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
  <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">

    {/* Sidebar */}
    <div className="w-1/4 backdrop-blur-lg bg-white/10 border-r border-white/20 flex flex-col">

      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-white/20">
        <span className="text-lg font-semibold">Chats</span>

        <button
          onClick={handleLogout}
          className="bg-red-500/80 hover:bg-red-600 px-3 py-1 rounded-lg text-sm transition"
        >
          Logout
        </button>
      </div>

      {/* Search */}
      <div className="p-3 space-y-2">
        <input
          className="w-full p-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Enter phone..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={searchUser}
          className="w-full bg-indigo-500 hover:bg-indigo-600 transition p-2 rounded-lg shadow"
        >
          Add Contact
        </button>
      </div>

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((c, i) => (
          <div
            key={i}
            onClick={() => setSelectedUser(c.contact)}
            className={`p-3 cursor-pointer transition border-b border-white/10 ${
              selectedUser?._id === c.contact._id
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
          >
            <div className="font-medium">{c.contact.username}</div>
            <div className="text-sm text-gray-300">
              {c.contact.phone}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Chat Section */}
    <div className="w-3/4 flex flex-col backdrop-blur-lg bg-white/5">

      {/* Header */}
      <div className="p-4 border-b border-white/20 bg-white/10 backdrop-blur flex items-center">
        <span className="text-lg font-medium">
          {selectedUser ? selectedUser.username : "Select a contact"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs backdrop-blur-lg border ${
                msg.sender === currentUserId
                  ? "bg-indigo-500/70 border-indigo-400"
                  : "bg-white/10 border-white/20"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="p-3 flex items-center gap-2 border-t border-white/20 bg-white/10 backdrop-blur">

        <input
          className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-indigo-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-500 hover:bg-indigo-600 px-5 py-2 rounded-lg shadow transition"
        >
          Send
        </button>

      </div>
    </div>

  </div>
);
}

export default Chat;