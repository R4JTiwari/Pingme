import { Routes, Route } from "react-router-dom";
import OtpAuth from "./pages/OtpAuth";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OtpAuth />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;