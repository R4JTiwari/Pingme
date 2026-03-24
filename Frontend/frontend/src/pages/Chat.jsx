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
          `http://localhost:3000/api/contacts/${currentUserId}`
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
          `http://localhost:3000/api/messages/${currentUserId}/${selectedUser._id}`
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

    const newSocket = io("http://localhost:3000", {
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
        `http://localhost:3000/api/users/phone/${phone}`
      );

      if (res.data._id === currentUserId) {
        alert("You can't chat with yourself");
        return;
      }

      //  Add contact
      await axios.post("http://localhost:3000/api/contacts/add", {
        userId: currentUserId,
        contactId: res.data._id
      });

      setSelectedUser(res.data);

      // refresh contacts
      const updated = await axios.get(
        `http://localhost:3000/api/contacts/${currentUserId}`
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
  <div className="flex h-screen">

    {/* Sidebar */}
    <div className="w-1/4 bg-[#111b21] text-white flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-gray-700 text-lg font-semibold">
        Chats
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          className="w-full p-2 rounded bg-[#202c33] text-white outline-none"
          placeholder="Enter phone..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={searchUser}
          className="w-full mt-2 bg-green-600 hover:bg-green-700 p-2 rounded"
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
            className={`p-3 cursor-pointer border-b border-gray-800 transition ${
              selectedUser?._id === c.contact._id
                ? "bg-[#2a3942]"
                : "hover:bg-[#202c33]"
            }`}
          >
            <div className="font-medium">{c.contact.username}</div>
            <div className="text-sm text-gray-400">
              {c.contact.phone}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Chat Section */}
    <div className="w-3/4 flex flex-col bg-[#efeae2]">

      {/* Header */}
      <div className="bg-[#202c33] text-white p-4 shadow">
        {selectedUser
          ? selectedUser.username
          : "Select a contact"}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">

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
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender === currentUserId
                  ? "bg-[#d9fdd3]"
                  : "bg-white"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="bg-[#202c33] p-3 flex items-center gap-2">

        <input
          className="flex-1 p-2 rounded bg-[#2a3942] text-white outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
        >
          Send
        </button>

      </div>
    </div>

  </div>
);
}

export default Chat;