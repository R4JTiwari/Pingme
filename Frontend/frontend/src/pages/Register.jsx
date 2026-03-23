import { useState } from "react";
import axios from "axios";

function Register() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {

      const res = await axios.post("http://localhost:3000/api/users/register", {
        username,
        email,
        password
      });

      alert("User registered successfully");

    } catch (error) {
  console.log("FULL ERROR:", error);
  console.log("BACKEND ERROR:", error.response?.data);

  alert(error.response?.data?.message || "Registration failed");
}
  };

  return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}}>

      <div style={{width:"300px"}}>

        <h2>Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={handleRegister}>Register</button>

      </div>

    </div>
  );
}

export default Register;