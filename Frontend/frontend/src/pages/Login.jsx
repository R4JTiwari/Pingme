import { useState } from "react";
import axios from "axios";
import Chat from "./Chat";

function Login() {

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
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br />

      <input
        placeholder="Password"
        type="password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;