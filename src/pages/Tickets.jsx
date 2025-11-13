import React, { useState, useEffect } from "react";
import { Search, Filter, X, Plus, ChevronDown } from "lucide-react";

const Tickets = () => {
  const [activePage, setActivePage] = useState("view");
  const [userId, setUserId] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dateRange: "",
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const uid =
      localStorage.getItem("user_id") ||
      localStorage.getItem("username") ||
      "";
    setUserId(uid);
  }, []);

  const applyFilters = () => {
    console.log("Applied Filters:", filters);
    setShowFilters(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Ticket submitted successfully!");
    setActivePage("view");
  };

  const options = {
    status: ["Open", "Pending", "Closed"],
    priority: ["High", "Medium", "Low"],
    dateRange: ["This Week", "This Month", "Last 3 Months"],
  };

  const handleSelect = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setOpenDropdown(null);
  };

  return (
    <div className=" bg-black text-white px-4 py-6 md:px-8">
      {/* ===================== PAGE HEADER ===================== */}
      <header className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">
          Support Tickets
        </h2>
      </header>

      {/* ===================== VIEW TICKETS PAGE ===================== */}
      {activePage === "view" && (
        <div className="rounded-lg border border-gray-800 bg-black shadow-md p-4 w-full">
          {/* Search + Buttons Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-yellow-400">
              Your Tickets
            </h2>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Search Input */}
              <div className="flex items-center gap-2 bg-black border border-yellow-500 rounded-md px-3 py-2 w-full sm:w-72 hover:bg-gray-900 transition">
                <Search size={18} className="text-yellow-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="bg-transparent text-yellow-300 placeholder-yellow-400 focus:outline-none w-full text-sm sm:text-base"
                />
              </div>

              {/* Filter & Create Ticket Buttons */}
              <div className="flex flex-wrap justify-start sm:justify-end gap-2 w-full sm:w-auto">
                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md transition text-sm sm:text-base w-full sm:w-auto"
                >
                  <Filter size={18} />
                  Filters
                </button>

                {/* Create Ticket Button */}
                <button
                  onClick={() => setActivePage("create")}
                  className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md transition text-sm sm:text-base w-full sm:w-auto"
                >
                  <Plus size={18} />
                  Create Ticket
                </button>
              </div>
            </div>
          </div>

          {/* Ticket Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full text-sm md:text-base text-left border-collapse">
              <thead className="bg-gray-800 text-yellow-400">
                <tr>
                  <th className="p-2 border border-gray-700">Created Date</th>
                  <th className="p-2 border border-gray-700">Ticket ID</th>
                  <th className="p-2 border border-gray-700">User Id</th>
                  <th className="p-2 border border-gray-700">Username</th>
                  <th className="p-2 border border-gray-700">Subject</th>
                  <th className="p-2 border border-gray-700">Status</th>
                  <th className="p-2 border border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-gray-400 whitespace-nowrap"
                  >
                    No tickets found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== CREATE TICKET PAGE ===================== */}
      {activePage === "create" && (
        <div className="flex justify-center items-center">
          <div className="w-full max-w-2xl rounded-lg border border-gray-800 bg-black shadow-md p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-yellow-400">
                Raise a New Ticket
              </h2>
              <button
                onClick={() => setActivePage("view")}
                className="text-gray-300 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-yellow-400">User Id</label>
                <div className="font-bold mt-1 text-white break-all">
                  {userId}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-yellow-400">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter ticket subject"
                  required
                  className="w-full p-2 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-yellow-400">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe the issue in detail"
                  required
                  className="w-full p-2 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400 h-28"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-yellow-400">
                  Supporting Documents (Optional)
                </label>
                <div
                  className="border-2 border-dashed rounded-lg text-center py-6 cursor-pointer transition-all duration-200 border-gray-700 hover:border-yellow-400 hover:bg-gray-900"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <p className="text-lg font-medium text-white">
                    📎 Click to attach file
                  </p>
                  <p className="text-sm text-gray-400">
                    Accepted: JPG, JPEG, PDF (Max: 1MB)
                  </p>
                  <input type="file" id="fileInput" hidden />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-2 rounded-md shadow-md transition duration-200"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== FILTER MODAL ===================== */}
{showFilters && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto">
    <div className="relative w-full max-w-md p-6 rounded-xl shadow-2xl border border-gray-700 bg-black text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-yellow-400">
          Filter Tickets
        </h3>
        <button
          onClick={() => setShowFilters(false)}
          className="text-gray-300 hover:text-white transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Custom Dropdowns */}
      <div className="space-y-4">
        {["status", "priority", "dateRange"].map((key) => (
          <div key={key} className="relative">
            <label className="block font-semibold mb-1 text-yellow-400 capitalize">
              {key === "dateRange" ? "Date Range" : key}
            </label>

            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === key ? null : key)
              }
              className="w-full flex justify-between items-center border border-gray-700 bg-gray-900 text-white rounded-md p-2"
            >
              <span>{filters[key] || "Select"}</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  openDropdown === key ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === key && (
              <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {options[key].map((opt) => (
                  <div
                    key={opt}
                    onClick={() => handleSelect(key, opt)}
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={applyFilters}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md mt-4"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Tickets;
