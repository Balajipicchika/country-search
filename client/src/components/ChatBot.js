import React, { useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";


const ChatBot = ({ darkMode }) => {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: "user", text: input };
    setChat([...chat, userMessage]);
    setInput("");
    setLoading(true);
  
    try {
<<<<<<< HEAD
      const res = await axios.post("https://country-search-k1nf.onrender.com/chat", {
=======
      // https://country-search-k1nf.onrender.com
      const res = await axios.post("http://localhost:5000/chat", {
>>>>>>> 1dfa71a (changes in Display.js)
        prompt: input,
      });

      console.log(res);
  
      const botReply = res.data.response;
      setChat((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      setChat((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't get a response." }]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px",
        background: darkMode ? "#2e2e2e" : "#fff",
        color: darkMode ? "#fff" : "#000",
        borderRadius: "10px",
        boxShadow: "0 0 12px rgba(0,0,0,0.2)",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      <div style={{ backgroundColor: darkMode ? "#444" : "#eee", padding: "10px", fontWeight: "bold" }}>
        <FaCommentDots/> Ask About Countries
      </div>

      <div style={{ maxHeight: "300px", overflowY: "auto", padding: "10px" }}>
        {chat.map((msg, index) => (
          <div key={index} style={{ margin: "5px 0", textAlign: msg.sender === "user" ? "right" : "left" }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                background: msg.sender === "user" ? "#007bff" : darkMode ? "#666" : "#ddd",
                color: "#fff",
                maxWidth: "80%",
              }}
            >
              <ReactMarkdown>
              {msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <p>Bot is typing...</p>}
      </div>

      <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me about a country..."
          style={{
            flex: 1,
            border: "none",
            padding: "10px",
            outline: "none",
            background: "transparent",
            color: darkMode ? "#fff" : "#000",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 15px",
            border: "none",
            backgroundColor: darkMode ? "#007bff" : "#333",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
