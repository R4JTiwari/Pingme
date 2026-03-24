import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    if (!username || !email || !phone || !password) {
      alert("All fields required");
      return;
    }

    try {

      await axios.post("https://pingme-g1m4.onrender.com/api/users/register", {
        username,
        email,
        password,
        phone
      });

      alert("Registered successfully");
      navigate("/");

    } catch (error) {
      console.log(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#111b21]">

      <div className="bg-[#202c33] p-8 rounded-lg shadow-lg w-80 text-white">

        <h1 className="text-green-500 text-center text-3xl font-bold mb-2">
          PingMe 💬
        </h1>

        <h2 className="text-xl text-center mb-6">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#2a3942]"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#2a3942]"
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#2a3942]"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#2a3942]"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 p-2 rounded"
        >
          Register
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-2 border border-green-500 p-2 rounded"
        >
          Login
        </button>

      </div>
    </div>
  );
}

export default Register;