import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaWallet, FaUsers, FaHandshake, FaDesktop, FaTicketAlt, FaExchangeAlt, FaCalendarAlt, FaHeadset } from 'react-icons/fa';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const menuItems = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/tradingaccounts", icon: FaWallet, label: "Trading Accounts" },
    { path: "/socialtrading", icon: FaUsers, label: "Social Trading" },
    { path: "/partnership", icon: FaHandshake, label: "Partnership" },
    { path: "/platform", icon: FaDesktop, label: "Platform" },
    { path: "/tickets", icon: FaTicketAlt, label: "Ticket" },
    { path: "/transactions", icon: FaExchangeAlt, label: "Transactions" },
    { path: "/economic-calendar", icon: FaCalendarAlt, label: "Economic Calendar" },
    { path: "/support", icon: FaHeadset, label: "Terms & Conditions" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 h-full w-[80vw] md:w-[40vw] lg:w-[16vw] bg-black text-white px-1 py-5 transform transition-transform duration-300 z-50
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      ${isSidebarOpen ? "lg:hidden" : "lg:translate-x-0"}`}
    >
      <div id="logo" className="mb-10">
        <Link to="/dashboard">
          <img
            className="h-8 md:h-10 object-contain mx-auto cursor-pointer"
            src="https://vtindex.com/img/logo/logo.svg"
            alt="logo"
          />
        </Link>
      </div>

      <div id="nav-content" className="flex flex-col gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-md transition"
          >
            <item.icon />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;