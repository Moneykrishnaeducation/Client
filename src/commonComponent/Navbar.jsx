import React from "react";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <nav
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-[80vw] md:w-[40vw] lg:w-[16vw] bg-black text-white px-1 py-8 transform transition-transform duration-300 z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isSidebarOpen ? "lg:hidden" : "lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div id="logo" className="mb-10">
          <img
            className="w-40 mx-auto cursor-pointer"
            src="https://vtindex.com/img/logo/logo.svg"
            alt="logo"
            onClick={() => console.log("Load dashboard")}
          />
        </div>

        {/* Nav links */}
        <div id="nav-content" className="flex flex-col gap-6">
          {[
            { id: "dashboard", icon: "fa-house", label: "Dashboard" },
            { id: "tradingaccounts", icon: "fa-wallet", label: "Trading Accounts" },
            { id: "socialtrading", icon: "fa-people-group", label: "Social Trading" },
            { id: "partnership", icon: "fa-handshake", label: "Partnership" },
            { id: "platform", icon: "fa-desktop", label: "Platform" },
            { id: "tickers", icon: "fa-ticket", label: "Ticket" },
            { id: "transactions", icon: "fa-arrow-right-arrow-left", label: "Transactions" },
            { id: "economic-calendar", icon: "fa-calendar-days", label: "Economic Calendar" },
            { id: "support", icon: "fa-headset", label: "Terms & Conditions" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => console.log(`Load ${item.id}`)}
              className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-md transition"
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
