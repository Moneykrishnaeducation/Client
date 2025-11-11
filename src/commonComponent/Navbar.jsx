import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const menuItems = [
    { path: "/dashboard", icon: "fa-house", label: "Dashboard" },
    { path: "/tradingaccounts", icon: "fa-wallet", label: "Trading Accounts" },
    { path: "/socialtrading", icon: "fa-people-group", label: "Social Trading" },
    { path: "/partnership", icon: "fa-handshake", label: "Partnership" },
    { path: "/platform", icon: "fa-desktop", label: "Platform" },
    { path: "/tickers", icon: "fa-ticket", label: "Ticket" },
    { path: "/transactions", icon: "fa-arrow-right-arrow-left", label: "Transactions" },
    { path: "/economic-calendar", icon: "fa-calendar-days", label: "Economic Calendar" },
    { path: "/support", icon: "fa-headset", label: "Terms & Conditions" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 h-full w-[80vw] md:w-[40vw] lg:w-[16vw] bg-black text-white px-1 py-8 transform transition-transform duration-300 z-50
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      ${isSidebarOpen ? "lg:hidden" : "lg:translate-x-0"}`}
    >
      <div id="logo" className="mb-10">
        <Link to="/dashboard">
          <img
            className="w-40 mx-auto cursor-pointer"
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
            <i className={`fa-solid ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
