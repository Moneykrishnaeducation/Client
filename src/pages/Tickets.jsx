import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, X, Plus, ChevronDown } from "lucide-react";
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../utils/api';

const Tickets = () => {
  const { isDarkMode } = useTheme();
  const [activePage, setActivePage] = useState("view");
  const [userId, setUserId] = useState("");
  const [tickets, setTickets] = useState({ open: [], closed: [], pending: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dateRange: "",
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const uid =
      localStorage.getItem("user_id") ||
      localStorage.getItem("username") ||
      "";
    setUserId(uid);
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiCall('/api/tickets/');
      setTickets(data);
    } catch (err) {
      setError("Failed to fetch tickets. Please try again.");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    console.log("Applied Filters:", filters);
    setShowFilters(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subject = formData.get('subject');
    const description = formData.get('description');
    const files = formData.getAll('documents');

    try {
      const ticketData = {
        subject,
        description,
        created_by: userId,
      };

      // If there are files, include them in FormData
      if (files.length > 0) {
        const formDataWithFiles = new FormData();
        formDataWithFiles.append('subject', subject);
        formDataWithFiles.append('description', description);
        formDataWithFiles.append('created_by', userId);
        files.forEach(file => {
          formDataWithFiles.append('documents', file);
        });

        await apiCall('api/tickets/', {
          method: 'POST',
          body: formDataWithFiles,
          headers: {} // Let browser set content-type for FormData
        });
      } else {
        await apiCall('api/tickets/', {
          method: 'POST',
          body: JSON.stringify(ticketData),
        });
      }

      alert("Ticket submitted successfully!");
      setActivePage("view");
      fetchTickets(); // Refresh tickets list
    } catch (err) {
      alert("Failed to create ticket. Please try again.");
      console.error("Error creating ticket:", err);
    }
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

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      await apiCall(`api/tickets/${selectedTicket.id}/send-message/`, {
        method: 'POST',
        body: JSON.stringify({ content: message }),
      });
      alert("Message sent successfully!");
      setMessage("");
      setShowViewModal(false);
    } catch (err) {
      alert("Failed to send message. Please try again.");
      console.error("Error sending message:", err);
    }
  };



  return (
    <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} h-full px-4 py-6 md:px-8`}>
      {/* ===================== PAGE HEADER ===================== */}
      <header className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">
          Support Tickets
        </h2>
      </header>

      {/* ===================== VIEW TICKETS PAGE ===================== */}
      {activePage === "view" && (
        <div className={`rounded-lg border ${isDarkMode ? 'border-gray-800 bg-black' : 'border-gray-300 bg-white'} shadow-md p-4 w-full`}>
          {/* Search + Buttons Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-yellow-400">
              Your Tickets
            </h2>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Search Input */}
              <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-black' : 'bg-white'} border border-yellow-500 rounded-md px-3 py-2 w-full sm:w-72 hover:bg-gray-900 transition`}>
                <Search size={18} className="text-yellow-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className={`bg-transparent ${isDarkMode ? 'text-yellow-300 placeholder-yellow-400' : 'text-black placeholder-gray-500'} focus:outline-none w-full text-sm sm:text-base`}
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
          <div className="overflow-x-auto rounded-lg border border-yellow-600">
            <table className="min-w-full text-sm md:text-base text-left border border-yellow-600 border-collapse">
              <thead className={` ${isDarkMode ? 'bg-black text-yellow-200' : 'bg-white text-black'} `}>
                <tr>
                  <th className="p-2 border border-yellow-600">Created Date</th>
                  <th className="p-2 border border-yellow-600">Ticket ID</th>
                  <th className="p-2 border border-yellow-600">User Id</th>
                  <th className="p-2 border border-yellow-600">Username</th>
                  <th className="p-2 border border-yellow-600">Subject</th>
                  <th className="p-2 border border-yellow-600">Status</th>
                  <th className="p-2 border border-yellow-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-nowrap`}
                    >
                      Loading tickets...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="7"
                      className={`text-center py-4 text-red-500 whitespace-nowrap`}
                    >
                      {error}
                    </td>
                  </tr>
                ) : (
                  <>
                    {tickets.open.map((ticket) => (
                      <tr key={ticket.id} className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} border-b border-yellow-600`}>
                        <td className="p-2 border border-yellow-600">{new Date(ticket.created_at).toLocaleDateString()}</td>
                        <td className="p-2 border border-yellow-600">{ticket.id}</td>
                        <td className="p-2 border border-yellow-600">{ticket.user_id}</td>
                        <td className="p-2 border border-yellow-600">{ticket.username}</td>
                        <td className="p-2 border border-yellow-600">{ticket.subject}</td>
                        <td className="p-2 border border-yellow-600">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Open</span>
                        </td>
                        <td className="p-2 border border-yellow-600">
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowViewModal(true);
                            }}
                            className="text-yellow-400 hover:text-yellow-500"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {tickets.pending.map((ticket) => (
                      <tr key={ticket.id} className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} border-b border-yellow-600`}>
                        <td className="p-2 border border-yellow-600">{new Date(ticket.created_at).toLocaleDateString()}</td>
                        <td className="p-2 border border-yellow-600">{ticket.id}</td>
                        <td className="p-2 border border-yellow-600">{ticket.user_id}</td>
                        <td className="p-2 border border-yellow-600">{ticket.username}</td>
                        <td className="p-2 border border-yellow-600">{ticket.subject}</td>
                        <td className="p-2 border border-yellow-600">
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Pending</span>
                        </td>
                        <td className="p-2 border border-yellow-600">
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowViewModal(true);
                            }}
                            className="text-yellow-400 hover:text-yellow-500"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {tickets.closed.map((ticket) => (
                      <tr key={ticket.id} className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} border-b border-yellow-600`}>
                        <td className="p-2 border border-yellow-600">{new Date(ticket.created_at).toLocaleDateString()}</td>
                        <td className="p-2 border border-yellow-600">{ticket.id}</td>
                        <td className="p-2 border border-yellow-600">{ticket.user_id}</td>
                        <td className="p-2 border border-yellow-600">{ticket.username}</td>
                        <td className="p-2 border border-yellow-600">{ticket.subject}</td>
                        <td className="p-2 border border-yellow-600">
                          <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">Closed</span>
                        </td>
                        <td className="p-2 border border-yellow-600">
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowViewModal(true);
                            }}
                            className="text-yellow-400 hover:text-yellow-500"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {tickets.open.length === 0 && tickets.pending.length === 0 && tickets.closed.length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-nowrap`}
                        >
                          No tickets found.
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== CREATE TICKET PAGE ===================== */}
      {activePage === "create" && (
        <div className="flex justify-center items-center">
          <div className={`w-full max-w-2xl rounded-lg border ${isDarkMode ? 'border-gray-800 bg-black' : 'border-gray-300 bg-white'} shadow-md p-5`}>
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
                <div className={`font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-black'} break-all`}>
                  {userId}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-yellow-400">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  name="subject"
                  type="text"
                  placeholder="Enter ticket subject"
                  required
                  className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-black placeholder-gray-600'}`}
                />
              </div>

              <div>
                <label className="block font-semibold text-yellow-400">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the issue in detail"
                  required
                  className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-black placeholder-gray-600'} h-28`}
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-yellow-400">
                  Supporting Documents (Optional)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg text-center py-6 cursor-pointer transition-all duration-200 ${isDarkMode ? 'border-gray-700 hover:border-yellow-400 hover:bg-gray-900' : 'border-gray-300 hover:border-yellow-400 hover:bg-gray-100'}`}
                  onClick={() => fileInputRef.current.click()}
                >
                  <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    📎 Click to attach file
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Accepted: JPG, JPEG, PDF (Max: 1MB)
                  </p>
                  <input type="file" name="documents" ref={fileInputRef} hidden multiple />
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
    <div className={`relative w-full max-w-md p-6 rounded-xl shadow-2xl border ${isDarkMode ? 'border-gray-700 bg-black text-white' : 'border-gray-300 bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-yellow-400">
          Filter Tickets
        </h3>
        <button
          onClick={() => setShowFilters(false)}
          className={`transition ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
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
              className={`w-full flex justify-between items-center border border-yellow-500 rounded-md p-2 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
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
              <div className={`absolute z-20 w-full mt-1 border rounded-md shadow-lg max-h-40 overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                {options[key].map((opt) => (
                  <div
                    key={opt}
                    onClick={() => handleSelect(key, opt)}
                    className={`p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
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

      {/* ===================== VIEW MODAL ===================== */}
      {showViewModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto">
          <div className={`relative w-full max-w-lg p-6 rounded-xl shadow-2xl border ${isDarkMode ? 'border-gray-700 bg-black text-white' : 'border-gray-300 bg-white text-black'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-yellow-400">
                Ticket Details
              </h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setMessage("");
                }}
                className={`transition ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-yellow-400">Subject</label>
                <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{selectedTicket.subject}</p>
              </div>

              <div>
                <label className="block font-semibold text-yellow-400">Date and Time</label>
                <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{new Date(selectedTicket.created_at).toLocaleString()}</p>
              </div>

              <div>
                <label className="block font-semibold text-yellow-400">Username</label>
                <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{selectedTicket.username}</p>
              </div>

              <div>
                <label className="block font-semibold text-yellow-400">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message"
                  className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-black placeholder-gray-600'} h-24`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSendMessage}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md transition"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Tickets;