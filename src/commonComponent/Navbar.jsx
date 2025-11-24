import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { apiCall } from "../utils/api";
import {
  Home,
  CreditCard,
  Users,
  Handshake,
  Monitor,
  Ticket,
  Repeat,
  Calendar,
  Headphones,
} from "lucide-react";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/tradingaccounts", icon: CreditCard, label: "Trading Accounts" },
    { path: "/socialtrading", icon: Users, label: "Social Trading" },
    { path: "/partnership", icon: Handshake, label: "Partnership", requiresApproval: true },
    { path: "/platform", icon: Monitor, label: "Platform" },
    { path: "/tickets", icon: Ticket, label: "Ticket" },
    { path: "/transactions", icon: Repeat, label: "Transactions" },
    { path: "/economic-calendar", icon: Calendar, label: "Economic Calendar" },
    { path: "/support", icon: Headphones, label: "Terms & Conditions" },
  ];

  const handleMenuClick = async (item) => {
    if (item.requiresApproval) {
      try {
        const response = await apiCall('client/ib/status/');
        if (response.approved) {
          navigate(item.path);
        } else {
          navigate('/ibrequest');
        }
      } catch (error) {
        console.error('Failed to check IB status:', error);
        navigate('/ibrequest');
      }
    } else {
      navigate(item.path);
    }
    setIsSidebarOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 h-[100vh] w-[60vw] md:w-[40vw] lg:w-[16vw] ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} px-3 py-5 transform transition-transform duration-300 z-50 shadow-lg
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      ${isSidebarOpen ? "lg:hidden" : "lg:translate-x-0"}`}
    >
      {/* Logo */}
      <div id="logo" className="mb-10">
        <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)}>
          <img
            className="h-10 object-contain mx-auto cursor-pointer hover:scale-105 transition-transform duration-300"
            src="https://vtindex.com/img/logo/logo.svg"
            alt="logo"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <div id="nav-content" className="flex flex-col gap-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.requiresApproval) {
            return (
              <button
                key={item.path}
                onClick={() => handleMenuClick(item)}
                className={`flex items-center gap-4 px-5 py-3 rounded-md text-sm font-medium transition-all duration-300 relative
                ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black shadow-[0_0_20px_#FFD700]"
                    : `${isDarkMode ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-900' : 'text-gray-700 hover:text-yellow-400 hover:bg-gray-100'}`
                }`}
              >
                {/* Border on Hover */}
                <span className={`absolute inset-0 rounded-md border-2 border-transparent hover:border-${isDarkMode ? 'white' : 'black'} pointer-events-none transition-all duration-300`}></span>

                <Icon
                  className={`text-lg relative z-10 ${
                    isActive ? "text-black" : "text-yellow-400"
                  } transition-all duration-300`}
                />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          } else {
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-5 py-3 rounded-md text-sm font-medium transition-all duration-300 relative
                ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black shadow-[0_0_20px_#FFD700]"
                    : `${isDarkMode ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-900' : 'text-gray-700 hover:text-yellow-400 hover:bg-gray-100'}`
                }`}
              >
                {/* Border on Hover */}
                <span className={`absolute inset-0 rounded-md border-2 border-transparent hover:border-${isDarkMode ? 'white' : 'black'} pointer-events-none transition-all duration-300`}></span>

                <Icon
                  className={`text-lg relative z-10 ${
                    isActive ? "text-black" : "text-yellow-400"
                  } transition-all duration-300`}
                />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          }
        })}
      </div>
    </nav>
  );
};

export default Navbar;
