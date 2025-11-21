import React, { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ChatBot = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const storedUsername =
      localStorage.getItem("userName") ||
      localStorage.getItem("user_name") ||
      "Guest";
    setUsername(storedUsername);

    // Calculate total drop animation time
    const dropDelayPerLetter = 100; // 0.1s
    const dropAnimationDuration = 500; // 0.5s per letter
    const totalAnimationTime =
      `Welcome ${storedUsername},`.length * dropDelayPerLetter + dropAnimationDuration;

    const timeout = setTimeout(() => setShowWelcome(false), totalAnimationTime);
    return () => clearTimeout(timeout);
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].sender === "user") {
      const timeout = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Thanks for your message! We'll get back to you soon.", sender: "bot" },
        ]);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  const displayText = "Chat with us".toUpperCase().split("");

  return (
    <>
      <style>
        {`
          @keyframes flip { 0%, 80% { transform: rotateY(360deg); } }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          @keyframes drop { 0% { transform: translateY(-100%); opacity: 0; } 80% { transform: translateY(10%); opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }

          .flip-letter { display: inline-block; animation: flip 2s infinite; }
          .bounce-icon { animation: bounce 2s infinite; }
          .drop-letter { display: inline-block; animation: drop 0.5s forwards; }
        `}
      </style>

      <div className="fixed bottom-12 right-5 z-50 flex flex-col items-end">
        {/* Chat icon with animated text */}
        <div className="flex items-center space-x-2">
          {!isOpen && (
            <span
              className={`bounce-icon ${
                isDarkMode ? "bg-black text-white" : "bg-white text-black"
              } px-2 py-1 rounded-lg shadow-lg text-xs font-bold flex items-center space-x-1 overflow-hidden w-auto`}
            >
              {/* Hello icon only for Chat with us */}
              {!showWelcome && (
                <span className="text-yellow-400 animate-bounce text-lg">👋</span>
              )}

              {showWelcome && username ? (
                <span className="flex space-x-0.5">
                  {`Welcome ${username},`.toUpperCase().split("").map((char, index) => (
                    <span
                      key={index}
                      className="drop-letter text-xs"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="flex space-x-0.5">
                  {displayText.map((char, index) => (
                    <span
                      key={index}
                      className="flip-letter px-0.5 py-0.5 rounded text-xs"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              )}
            </span>
          )}

          <button
            onClick={toggleChat}
            className={`${isDarkMode ? "bg-black" : "bg-white"} p-3 rounded-full shadow-md hover:shadow-xl transition-all flex items-center justify-center`}
          >
            {isOpen ? (
              <X className="w-7 h-7 text-yellow-400" />
            ) : (
              <MessageCircle className="w-7 h-7 text-yellow-400" />
            )}
          </button>
        </div>

        {/* Chat box */}
        {isOpen && (
          <div
            className={`mt-3 w-80 h-96 ${
              isDarkMode ? "bg-black border-gray-700" : "bg-white border-gray-300"
            } border rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]`}
          >
            <div className="px-4 py-2 font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
              ChatBot
            </div>

            <div className="flex-1 px-4 py-2 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent hover:scrollbar-thumb-yellow-500">
              {messages.length === 0 && (
                <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
                  No messages yet...
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  <span
                    className={`inline-block px-3 py-1 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-yellow-400 text-black animate-pulse"
                        : `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            <div className={`flex p-2 border-t ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className={`flex-1 px-3 py-2 rounded-l-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"} focus:outline-none`}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-yellow-400 p-2 rounded-r-lg hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg"
              >
                <Send className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBot;
