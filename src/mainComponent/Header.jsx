import React, { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa"; // Import icons

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
    // Optional: Apply dark/light mode to body
    document.body.classList.toggle("dark", !isDarkMode);
  };

  return (
    <header className="flex w-screen items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 shadow-md transition-colors">
      {/* Left: Menu button */}
      <button className="text-2xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
        ☰
      </button>

      {/* Center: Logo */}
      <div className="flex-1 flex justify-center">
        <img
          src="/Assets/clogo - Copy.png"
          alt="Logo"
          className="h-10 object-contain"
        />
      </div>

      {/* Right: Mode, Profile, Exit */}
      <div className="flex items-center space-x-4">
        {/* Mode Button */}
        <button
          onClick={toggleMode}
          className="text-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Profile Image */}
        <img
          src="/Assets/profile.jpg"
          alt="Profile"
          className="w-9 h-9 rounded-full border-2 border-gray-300 object-cover"
        />

        {/* Exit Button */}
        <button className="text-xl text-gray-700 hover:text-red-500 dark:text-gray-200 dark:hover:text-red-400 transition-colors">
          ⎋
        </button>
      </div>
    </header>
  );
};

export default Header;
