import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Chat from "./Chat";

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {

      const res = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      setLoggedIn(true);

    } catch (error) {
      alert("Login failed");
    }
  };

  if (loggedIn) {
    return <Chat />;
  }

  return (
  <div className="flex items-center justify-center h-screen bg-[#111b21]">

    <div className="bg-[#202c33] p-8 rounded-lg shadow-lg w-80 text-white">
      <h1 className="text-green-500 text-center text-3xl font-bold mb-2">
  PingMe
</h1>
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Login
      </h2>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-[#2a3942] outline-none"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-[#2a3942] outline-none"
      />

      {/* Button */}
      <button
        onClick={handleLogin}
        className="w-full bg-green-500 hover:bg-green-600 p-2 rounded font-semibold"
      >
        Login
      </button>

      {/* Footer */}
      <p className="text-center text-sm mt-4 text-gray-400">
        Don't have an account?
      </p>

      <button
        onClick={() => navigate("/register")}
        className="w-full mt-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white p-2 rounded"
      >
        Register
      </button>

    </div>
  </div>
);
}

export default Login;