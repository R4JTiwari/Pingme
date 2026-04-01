import { useState, useEffect } from "react"; // ✅ add useEffect here
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OtpAuth() {

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chat");
    }
  }, [navigate]);

  // rest of your code...
  const BASE_URL = "https://pingme-g1m4.onrender.com";
  // 📩 Send OTP
  const sendOTP = async () => {
    try {

      if (!email || !username || !phone) {
        alert("All fields required");
        return;
      }

      const res = await axios.post(`${BASE_URL}/api/otp/send-otp`, {
        email,
        username,
        phone
      });

      console.log(res.data);

      alert("OTP sent successfully");
      setStep(2);

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Error sending OTP");
    }
  };

  // ✅ Verify OTP
  const verifyOTP = async () => {
    try {

      const res = await axios.post(`${BASE_URL}/api/otp/verify-otp`, {
        email,
        otp
      });

      localStorage.setItem("token", res.data.token);

      alert("Login successful");

      navigate("/chat");

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Invalid OTP");
    }
  };

  return (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">

    {/* Glass Card */}
    <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-96 text-white">

      <h2 className="text-3xl font-semibold mb-6 text-center tracking-wide">
        PingMe
      </h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={sendOTP}
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 p-3 rounded-lg font-medium shadow-lg"
          >
            Send OTP
          </button>

        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOTP}
            className="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 p-3 rounded-lg font-medium shadow-lg"
          >
            Verify OTP
          </button>

        </div>
      )}

    </div>
  </div>
);
}

export default OtpAuth;