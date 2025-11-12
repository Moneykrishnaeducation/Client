import React, { useState } from "react";
import { FaMoon, FaSun, FaBell, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const iconSize = "text-lg md:text-xl"; // Smaller on mobile

  return (
    <header className={`flex h-[10vh] items-center justify-between px-4 md:px-6 py-3 bg-black border-b border-gray-900 shadow-[0_4px_6px_#FFD700] hover:shadow-[0_0_20px_#FFD700]`}>

      {/* Left: Hamburger / X Button */}
      <>
        {/* Mobile / Tablet Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden relative w-6 h-6 flex flex-col justify-between items-center mr-3 md:mr-4"
        >
          {/* Hamburger animation */}
          <span className={`block h-0.5 w-6 bg-white rounded transform transition duration-300 ease-in-out ${isSidebarOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white rounded transition duration-300 ease-in-out ${isSidebarOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white rounded transform transition duration-300 ease-in-out ${isSidebarOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        {/* Desktop Button (example: a simple arrow toggle) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex relative w-6 h-6 flex flex-col justify-between items-center mr-3 md:mr-4"
        >
          <span
            className={`block h-0.5 w-6 bg-white rounded transform transition duration-300 ease-in-out ${!isSidebarOpen ? "rotate-45 translate-y-2" : ""
              }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white rounded transition duration-300 ease-in-out ${!isSidebarOpen ? "opacity-0" : ""
              }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white rounded transform transition duration-300 ease-in-out ${!isSidebarOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
          />
        </button>
      </>

      {/* Center: Logo */}
      <div id="logo" className="flex-1 flex justify-center">
        <Link to="/dashboard">
          <img
            className="h-10 object-contain mx-auto cursor-pointer hover:scale-105 transition-transform duration-300"
            src="https://vtindex.com/img/logo/logo.svg"
            alt="logo"
          />
        </Link>
      </div>

      {/* Right: Notification, Mode, Profile, Exit */}
      <div className="flex items-center space-x-3 md:space-x-5">
        {/* Notification */}
        <button className={`${iconSize} relative text-white hover:text-yellow-300 transition-colors`}>
          <FaBell />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Mode Button */}
        <button
          onClick={toggleMode}
          className={`${iconSize} text-white hover:text-yellow-300 transition-colors`}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Profile */}
        <div className="flex items-center space-x-1">
          <FaUserCircle className={`${iconSize} text-white`} />
          <span className="hidden md:inline text-white font-medium text-xs md:text-sm">
            John Doe
          </span>

        </div>

        {/* Exit Button */}
        <button className={`${iconSize} text-white hover:text-red-500 transition-colors`}>
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Header;
