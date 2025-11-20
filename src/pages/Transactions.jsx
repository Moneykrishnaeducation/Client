import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { apiCall } from "../utils/api";

const Transactions = () => {
  const { isDarkMode } = useTheme();

  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateRange, setDateRange] = useState("All Dates");

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    console.log('Transactions component mounted, fetching data...');
    const fetchTransactions = async () => {
      try {
        console.log('Making API call to user-transactions/');
        setLoading(true);
        const data = await apiCall('user-transactions/');
        console.log('API response:', data);
        setTransactions(data.transactions || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load transactions. Please try again.');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        const data = await apiCall('pending-transactions/');
        // Handle pending transactions if needed
        console.log('Pending transactions:', data);
      } catch (err) {
        console.error('Failed to fetch pending transactions:', err);
      }
    };

    const fetchUserTradingAccounts = async () => {
      try {
        const data = await apiCall('user-trading-accounts/');
        // Handle trading accounts if needed
        console.log('User trading accounts:', data);
      } catch (err) {
        console.error('Failed to fetch user trading accounts:', err);
      }
    };

    fetchPendingTransactions();
    fetchUserTradingAccounts();
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      } p-4 sm:p-8`}
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 flex-wrap w-full">
          {/* 🔍 Search Bar */}
          <div className="relative w-full sm:w-72 rounded flex items-center border border-yellow-600">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500"
            />
            <input
              type="text"
              placeholder="Search transactions..."
              className={`w-full pl-10 pr-3 py-2 rounded-md ${
                isDarkMode
                  ? "bg-black border-yellow-500 text-yellow-300 placeholder-yellow-400 hover:bg-gray-900"
                  : "bg-white border-yellow-500 text-black placeholder-gray-500 hover:bg-gray-100"
              } focus:outline-none transition-all duration-200 text-sm sm:text-base`}
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto" style={{ zIndex: 10 }}>

            {/* TYPE DROPDOWN */}
            <div className={`group relative ${isMobile ? '' : 'hover:group'}`}>
              <button
                onClick={isMobile ? () => setIsTypeOpen(!isTypeOpen) : undefined}
                className={`px-4 py-2 rounded-md flex items-center gap-2 border border-yellow-600 ${
                  isDarkMode ? "bg-gray-900 text-yellow-400" : "bg-white text-black"
                }`}
              >
                {typeFilter} <ChevronDown size={16} />
              </button>

              <div
                className={`absolute top-full left-0 w-44 bg-black text-yellow-300 border border-yellow-500 rounded-md ${
                  isMobile
                    ? (isTypeOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
                    : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                } transition-all duration-200 shadow-lg z-50`}
              >
                {["All Types", "Deposit", "Withdrawal", "Internal Transfer"].map(
                  (opt) => (
                    <div
                      key={opt}
                      onClick={() => { setTypeFilter(opt); setIsTypeOpen(false); }}
                      className="px-4 py-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
                    >
                      {opt}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* STATUS DROPDOWN */}
            <div className={`group relative ${isMobile ? '' : 'hover:group'}`}>
              <button
                onClick={isMobile ? () => setIsStatusOpen(!isStatusOpen) : undefined}
                className={`px-4 py-2 rounded-md flex items-center gap-2 border border-yellow-600 ${
                  isDarkMode ? "bg-gray-900 text-yellow-400" : "bg-white text-black"
                }`}
              >
                {statusFilter} <ChevronDown size={16} />
              </button>

              <div
                className={`absolute top-full left-0 w-44 bg-black text-yellow-300 border border-yellow-500 rounded-md ${
                  isMobile
                    ? (isStatusOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
                    : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                } transition-all duration-200 shadow-lg z-50`}
              >
                {["All Status", "Completed", "Pending", "Failed"].map((opt) => (
                  <div
                    key={opt}
                    onClick={() => { setStatusFilter(opt); setIsStatusOpen(false); }}
                    className="px-4 py-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            {/* DATE RANGE DROPDOWN */}
            <div className={`group relative ${isMobile ? '' : 'hover:group'}`}>
              <button
                onClick={isMobile ? () => setIsDateOpen(!isDateOpen) : undefined}
                className={`px-4 py-2 rounded-md flex items-center gap-2 border border-yellow-600 ${
                  isDarkMode ? "bg-gray-900 text-yellow-400" : "bg-white text-black"
                }`}
              >
                {dateRange} <ChevronDown size={16} />
              </button>

              <div
                className={`absolute top-full left-0 w-44 bg-black text-yellow-300 border border-yellow-500 rounded-md ${
                  isMobile
                    ? (isDateOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
                    : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                } transition-all duration-200 shadow-lg z-50`}
              >
                {[
                  "All Dates",
                  "Today",
                  "This Week",
                  "This Month",
                  "Last 3 Months"
                ].map((opt) => (
                  <div
                    key={opt}
                    onClick={() => { setDateRange(opt); setIsDateOpen(false); }}
                    className="px-4 py-2 hover:bg-yellow-500 hover:text-black cursor-pointer"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 📊 Transactions Table */}
        <div
          className={`overflow-x-auto shadow-lg ${
            isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-300 bg-white"
          }`}
        >
          <table className="w-full border-collapse text-left text-sm sm:text-base border border-yellow-600">
            <thead className={`text-yellow-400 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
              <tr>
                <th className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                  Date/Time
                </th>

                {typeFilter === "Internal Transfer" ? (
                  <>
                    <th className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                      From Account
                    </th>
                    <th className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                      To Account
                    </th>
                  </>
                ) : (
                  <>
                    <th className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                      Account ID
                    </th>
                    <th className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                      Account Name
                    </th>
                  </>
                )}

                <th className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                  Amount (USD)
                </th>
                <th className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                  Note
                </th>
                <th className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr className="text-center">
                  <td
                    colSpan="6"
                    className={`py-6 font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Loading transactions...
                  </td>
                </tr>
              ) : error ? (
                <tr className="text-center">
                  <td
                    colSpan="6"
                    className={`py-6 font-medium text-red-400`}
                  >
                    {error}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr className="text-center">
                  <td
                    colSpan="6"
                    className={`py-6 font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions
                  .filter((transaction) => {
                    const matchesType = typeFilter === "All Types" || transaction.type === typeFilter;
                    const matchesStatus = statusFilter === "All Status" || transaction.status === statusFilter;
                    // Add date filtering logic if needed
                    return matchesType && matchesStatus;
                  })
                  .map((transaction, index) => (
                    <tr
                      key={index}
                      className={`${
                        isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                      } transition-colors duration-200`}
                    >
                      <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                        {new Date(transaction.date).toLocaleString()}
                      </td>

                      {typeFilter === "Internal Transfer" ? (
                        <>
                          <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                            {transaction.from_account || 'N/A'}
                          </td>
                          <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                            {transaction.to_account || 'N/A'}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                            {transaction.account_id || 'N/A'}
                          </td>
                          <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                            {transaction.account_name || 'N/A'}
                          </td>
                        </>
                      )}

                      <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                        ${transaction.amount || 0}
                      </td>
                      <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                        {transaction.note || 'N/A'}
                      </td>
                      <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Transactions;
