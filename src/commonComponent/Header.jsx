import React, { useState, useEffect, useRef } from "react";
import {
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { Bell, X, CheckCircle, Info, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { apiCall, getAuthHeaders, getCookie, handleUnauthorized, API_BASE_URL } from "../utils/api";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { isDarkMode, toggleMode } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [userName, setUserName] = useState("John Doe");

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const panelRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const iconSize = "text-lg md:text-xl";

  // 🔥 Fetch Notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiCall("client/notifications/", "GET");

        // expected response example:
        // [{ id: 1, message: "New message", type: "info" }]
        if (response?.notifications) {
          setNotifications(
            response.notifications.filter((n) => !n.is_read).map((n) => ({
              ...n,
              icon:
                n.type === "success"
                  ? <CheckCircle className="w-5 h-5 text-green-400" />
                  : n.type === "warning"
                  ? <AlertCircle className="w-5 h-5 text-yellow-400" />
                  : n.type === "error"
                  ? <AlertCircle className="w-5 h-5 text-red-400" />
                  : <Info className="w-5 h-5 text-blue-400" />,
            }))
          );
          setLoadingNotifications(false);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // 🔥 Fetch User Profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiCall("api/profile/", "GET");
        if (response?.name) {
          setUserName(response.name);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Mark single notification as read
  const markAsRead = async (id) => {
  try {
    const url = `${API_BASE_URL}client/notifications/${id}/mark-read/`;

    const headers = {
      ...getAuthHeaders(),
      "Content-Type": "application/json"
    };

    // Add CSRF token if present
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const config = {
      method: 'POST',
      headers,
      credentials: 'include'
    };

    const response = await fetch(url, config);

    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error('Unauthorized access');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Success Toast
    sharedUtils.showToast("Notification marked as read!", "success");

    // Update unread count
    if (data?.unread_count !== undefined) {
      setUnreadCount(data.unread_count);
    }

  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    sharedUtils.showToast("Failed to mark as read. Please try again.", "error");
  }
};


  // 🔹 Mark all as read
  const markAllAsRead = async () => {
  try {
    const url = `${API_BASE_URL}client/notifications/mark-all-read/`;

    const headers = {
      ...getAuthHeaders(),
      "Content-Type": "application/json"
    };

    // Add CSRF token if present
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const config = {
      method: 'POST',
      headers,
      credentials: 'include'
    };

    const response = await fetch(url, config);

    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error("Unauthorized access");
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Success notification
    sharedUtils.showToast("All notifications marked as read!", "success");

    // Update unread count to 0 (backend guarantees this)
    setUnreadCount(0);

    // Clear or update notifications list in UI
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );

  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    sharedUtils.showToast("Failed to mark all as read. Please try again.", "error");
  }
};


  // 🔹 Close notification panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // 🔹 Handle logout
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // Call logout API to log the activity on the server
      const response = await apiCall("logout/", "POST");
      if (response && response.message) {
        console.log("Logout successful:", response.message);
      }

      // Clear stored tokens and user data
      const keysToRemove = [
        'jwt_token', 'accessToken', 'refresh_token', 'refreshToken',
        'user_role', 'userRole', 'user_email', 'userEmail', 'user_name', 'userName',
        'current_page'
      ];
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      // Clear any pending verification marker
      localStorage.removeItem('login_verification_pending');

      // Trigger cross-tab logout
      import('../utils/api').then(({ triggerCrossTabLogout }) => {
        triggerCrossTabLogout();
      });

      // Navigate to login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, clear local data and redirect
      const keysToRemove = [
        'jwt_token', 'accessToken', 'refresh_token', 'refreshToken',
        'user_role', 'userRole', 'user_email', 'userEmail', 'user_name', 'userName',
        'current_page'
      ];
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      localStorage.removeItem('login_verification_pending');

      // Trigger cross-tab logout
      import('../utils/api').then(({ triggerCrossTabLogout }) => {
        triggerCrossTabLogout();
      });

      navigate("/");
    } finally {
      setLogoutLoading(false);
      setShowLogoutPopup(false);
    }
  };

  return (
    <header
      className={`flex h-[10vh] items-center justify-between px-4 md:px-6 py-3 ${
        isDarkMode
          ? "bg-black border-b border-gray-900"
          : "bg-white border-b border-gray-300"
      } shadow-[0_4px_6px_#FFD700] hover:shadow-[0_0_20px_#FFD700] transition-shadow duration-300`}
    >
      {/* SIDEBAR TOGGLE BUTTONS */}
      <>
        <button
          onClick={toggleSidebar}
          className="lg:hidden relative w-6 h-6 flex flex-col justify-between items-center mr-3 md:mr-4"
        >
          <span
            className={`block h-0.5 w-6 ${
              isDarkMode ? "bg-white" : "bg-black"
            } rounded transform transition duration-300 ease-in-out ${
              isSidebarOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 ${
              isDarkMode ? "bg-white" : "bg-black"
            } rounded transition duration-300 ease-in-out ${
              isSidebarOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 ${
              isDarkMode ? "bg-white" : "bg-black"
            } rounded transform transition duration-300 ease-in-out ${
              isSidebarOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        <button
          onClick={toggleSidebar}
          className="hidden lg:flex relative w-6 h-6 flex flex-col justify-between items-center mr-3 md:mr-4"
        >
          <span
            className={`block h-0.5 w-6 ${
              isDarkMode ? "bg-white" : "bg-black"
            } rounded transform transition duration-300 ease-in-out ${
              !isSidebarOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 ${
              isDarkMode ? "bg-white" : "bg-black"
            } rounded transition duration-300 ease-in-out ${
              !isSidebarOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 ${
              isDarkMode ? "bg-white" : "bg-black"
            } rounded transform transition duration-300 ease-in-out ${
              !isSidebarOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </>

      {/* LOGO */}
      <div id="logo" className="flex-1 flex justify-center">
        <Link to="/dashboard">
          <img
            className="h-10 object-contain mx-auto cursor-pointer hover:scale-105 transition-transform duration-300"
            src="https://vtindex.com/img/logo/logo.svg"
            alt="logo"
          />
        </Link>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center space-x-3 md:space-x-5">
        {/* Notification Button */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={`${iconSize} relative ${
            isDarkMode ? "text-white" : "text-black"
          } hover:text-yellow-300 transition-colors`}
        >
          <Bell className="w-5 h-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* Mode Toggle */}
        <button
          onClick={toggleMode}
          className={`${iconSize} ${
            isDarkMode ? "text-white" : "text-black"
          } hover:text-yellow-300 transition-colors`}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* PROFILE */}
        <div className="flex items-center space-x-1">
          <Link to="/profile" className="flex items-center space-x-1">
            <FaUserCircle
              className={`${iconSize} ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            />
            <span
              className={`hidden md:inline ${
                isDarkMode ? "text-white" : "text-black"
              } text-xs md:text-sm`}
            >
              {userName}
            </span>
          </Link>
        </div>

        {/* LOGOUT ICON */}
         <button
          onClick={() => setShowLogoutPopup(true)}
          className={`${iconSize} ${
            isDarkMode ? "text-white" : "text-black"
          } hover:text-red-500 transition-colors`}
        >
          <FaSignOutAlt />
        </button>
      </div>

      {/* NOTIFICATION PANEL */}
      {showNotifications && (
        <div
          ref={panelRef}
          className={`fixed top-16 right-3 w-[90%] sm:w-[22rem] md:w-[24rem] ${
            isDarkMode
              ? "bg-black border border-yellow-500"
              : "bg-white border border-yellow-500"
          } rounded-lg shadow-[0_0_20px_#FFD700] ${
            isDarkMode ? "text-white" : "text-black"
          } p-4 animate-slideIn z-50`}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-center border-b ${
              isDarkMode ? "border-gray-800" : "border-gray-300"
            } pb-2 mb-3`}
          >
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
                className={`${
                  isDarkMode
                    ? "text-gray-400 hover:text-yellow-400"
                    : "text-gray-600 hover:text-yellow-400"
                } transition`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="space-y-3 max-h-[65vh] overflow-y-auto">
            {loadingNotifications ? (
              <p className="text-center text-gray-400">Loading…</p>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-center justify-between space-x-3 ${
                    isDarkMode
                      ? "bg-gray-900 hover:bg-gray-800"
                      : "bg-gray-100 hover:bg-gray-200"
                  } p-3 rounded-md transition`}
                >
                  <div className="flex items-center space-x-3">
                    {notif.icon}
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {notif.message}
                    </p>
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
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } text-center`}
              >
                No new notifications
              </p>
            )}
          </div>
        </div>
      )}

       {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 animate-fadeIn">
          <div
            className={`w-[90%] sm:w-[350px] p-6 rounded-xl shadow-xl ${
              isDarkMode ? "bg-gray-900 text-white border border-yellow-500" : "bg-white text-black"
            }`}
          >
            <h2 className="text-lg font-semibold mb-3">Confirm Logout</h2>
            <p className="text-sm mb-6">Are you sure you want to log out?</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 rounded-md border border-gray-400 hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 text-sm"
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );  
};

export default Header;
