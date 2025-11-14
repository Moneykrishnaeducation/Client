import React, { useState, useEffect, useRef } from "react";
import {
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { Bell, X, CheckCircle, Info, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { isDarkMode, toggleMode } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New message from John Doe",
      icon: <Info className="w-5 h-5 text-yellow-400" />,
    },
    {
      id: 2,
      message: "Your report has been approved",
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
    },
    {
      id: 3,
      message: "System maintenance scheduled for 3 AM",
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
    },
  ]);

  const panelRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }
  
  const iconSize = "text-lg md:text-xl";

  // Mark single notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications([]);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <header className={`flex h-[10vh] items-center justify-between px-4 md:px-6 py-3 ${isDarkMode ? 'bg-black border-b border-gray-900' : 'bg-white border-b border-gray-300'} shadow-[0_4px_6px_#FFD700] hover:shadow-[0_0_20px_#FFD700] transition-shadow duration-300`}>

       <>
        {/* Mobile / Tablet Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden relative w-6 h-6 flex flex-col justify-between items-center mr-3 md:mr-4"
        >
          {/* Hamburger animation */}
          <span className={`block h-0.5 w-6 ${isDarkMode ? 'bg-white' : 'bg-black'} rounded transform transition duration-300 ease-in-out ${isSidebarOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 ${isDarkMode ? 'bg-white' : 'bg-black'} rounded transition duration-300 ease-in-out ${isSidebarOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 ${isDarkMode ? 'bg-white' : 'bg-black'} rounded transform transition duration-300 ease-in-out ${isSidebarOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        {/* Desktop Button (example: a simple arrow toggle) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex relative w-6 h-6 flex flex-col justify-between items-center mr-3 md:mr-4"
        >
          <span
            className={`block h-0.5 w-6 ${isDarkMode ? 'bg-white' : 'bg-black'} rounded transform transition duration-300 ease-in-out ${!isSidebarOpen ? "rotate-45 translate-y-2" : ""
              }`}
          />
          <span
            className={`block h-0.5 w-6 ${isDarkMode ? 'bg-white' : 'bg-black'} rounded transition duration-300 ease-in-out ${!isSidebarOpen ? "opacity-0" : ""
              }`}
          />
          <span
            className={`block h-0.5 w-6 ${isDarkMode ? 'bg-white' : 'bg-black'} rounded transform transition duration-300 ease-in-out ${!isSidebarOpen ? "-rotate-45 -translate-y-2" : ""
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

      {/* Right-side buttons */}
      <div className="flex items-center space-x-3 md:space-x-5">
        {/* Notification Button */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={`${iconSize} relative ${isDarkMode ? 'text-white' : 'text-black'} hover:text-yellow-300 transition-colors`}
        >
          <Bell className="w-5 h-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* Mode Button */}
        <button
          onClick={toggleMode}
          className={`${iconSize} ${isDarkMode ? 'text-white' : 'text-black'} hover:text-yellow-300 transition-colors`}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Profile Link */}
        <div className="flex items-center space-x-1">
          <Link to="/profile" className="flex items-center space-x-1 hover:opacity-80">
            <FaUserCircle className={`${iconSize} ${isDarkMode ? 'text-white' : 'text-black'}`} />
            <span className={`hidden md:inline ${isDarkMode ? 'text-white' : 'text-black'} font-medium text-xs md:text-sm`}>
              John Doe
            </span>
          </Link>
        </div>

        {/* Exit Button */}
        <button
          className={`${iconSize} ${isDarkMode ? 'text-white' : 'text-black'} hover:text-red-500 transition-colors`}
        >
          <FaSignOutAlt />
        </button>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div
          ref={panelRef}
          className={`fixed top-16 right-3 w-[90%] sm:w-[22rem] md:w-[24rem] ${isDarkMode ? 'bg-black border border-yellow-500' : 'bg-white border border-yellow-500'} rounded-lg shadow-[0_0_20px_#FFD700] ${isDarkMode ? 'text-white' : 'text-black'} p-4 animate-slideIn z-50`}
        >
          {/* Header with small 'Mark All' button */}
          <div className={`flex justify-between items-center border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} pb-2 mb-3`}>
            <h2 className="text-lg font-semibold text-yellow-400">
              Notifications
            </h2>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs px-2 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition"
                >
                  Mark All
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-yellow-400'} transition`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="space-y-3 max-h-[65vh] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-center justify-between space-x-3 ${isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'} p-3 rounded-md transition`}
                >
                  <div className="flex items-center space-x-3">
                    {notif.icon}
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{notif.message}</p>
                  </div>
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    Mark as Read
                  </button>
                </div>
              ))
            ) : (
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>No new notifications</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
