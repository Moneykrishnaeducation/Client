import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ChatBot = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  const text = "Chat with us".toUpperCase().split("");

  return (
    <>
      {/* Flip animation */}
      <style>
        {`
          @keyframes flip {
            0%, 80% {
              transform: rotateY(360deg);
            }
          }
          .flip-letter {
            display: inline-block;
            animation: flip 2s infinite;
          }
        `}
      </style>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {/* Chat icon with animated text */}
        <div className="flex items-center space-x-2">
          {!isOpen && (
            <span className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} px-3 py-2 rounded-lg shadow-md text-sm font-bold flex space-x-0.5`}>
              {text.map((char, index) => (
                <span
                  key={index}
                  className="flip-letter"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          )}

          <button
            onClick={toggleChat}
            className={`${isDarkMode ? 'bg-black' : 'bg-white'} p-3 rounded-full shadow-md hover:shadow-xl transition flex items-center justify-center`}
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
          <div className={`mt-3 w-80 h-96 ${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-xl shadow-lg flex flex-col overflow-hidden`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} px-4 py-2 font-bold`}>
              ChatBot
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-2 overflow-y-auto space-y-2">
              {messages.length === 0 && (
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No messages yet...</div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-1 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-yellow-400 text-black"
                        : `${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className={`flex p-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className={`flex-1 px-3 py-2 rounded-l-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} focus:outline-none`}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-yellow-400 p-2 rounded-r-lg hover:bg-yellow-500 transition"
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
