import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { apiCall } from "../utils/api";

const Transactions = () => {
  const { isDarkMode } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [tradingAccounts, setTradingAccounts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    console.log('Transactions component mounted, fetching data...');
    const fetchTransactions = async () => {
      try {
        console.log('Making API call to user-transactions/');
        setLoading(true);
        const data = await apiCall('user-transactions/');
        console.log('API response:', data);
        // API may return either an array of transactions or an object with a `transactions` key
        const txns = Array.isArray(data) ? data : (data && data.transactions) ? data.transactions : [];
        setTransactions(txns);
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
        setPendingTransactions(data);
        console.log('Pending transactions:', data);
      } catch (err) {
        console.error('Failed to fetch pending transactions:', err);
      }
    };

    const fetchUserTradingAccounts = async () => {
      try {
        const data = await apiCall('user-trading-accounts/');
        setTradingAccounts(data.accounts || []);
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
      <div className="px-3 mx-auto w-full">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 rounded-md ${
                isDarkMode
                  ? "bg-black border-yellow-500 text-yellow-300 placeholder-yellow-400 hover:bg-gray-900"
                  : "bg-white border-yellow-500 text-black placeholder-gray-500 hover:bg-gray-100"
              } focus:outline-none transition-all duration-200 text-sm sm:text-base`}
            />
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
            {["Pending", "Withdrawal", "Internal Transfer", "Deposit"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 w-full md:w-40 rounded-md border border-yellow-600 transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-yellow-500 text-black"
                    : isDarkMode
                    ? "bg-gray-900 text-yellow-400 hover:bg-gray-800"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 📊 Transactions Table */}
        <div
          className={`overflow-x-auto shadow-lg ${
            isDarkMode ? "border-gray-900" : "border-gray-300 bg-white"
          }`}
        >
          <table className="w-full border-collapse text-left text-sm sm:text-base border border-yellow-600">
            <thead className={`text-yellow-400 ${isDarkMode ? "bg-black-800" : "bg-black-200"}`}>
              <tr>
                <th className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                  Date/Time
                </th>

                {selectedCategory === "Internal Transfer" ? (
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
              ) : (() => {
                let displayData = [];
                if (selectedCategory === "Pending") {
                  displayData = pendingTransactions;
                } else if (selectedCategory === "Withdrawal") {
                  displayData = transactions.filter(t => t.transaction_type === "withdraw_trading");
                } else if (selectedCategory === "Deposit") {
                  displayData = transactions.filter(t => t.transaction_type === "deposit_trading");
                } else if (selectedCategory === "Internal Transfer") {
                  displayData = transactions.filter(t => t.transaction_type === "internal_transfer");
                }

                const filteredData = displayData.filter((transaction) => {
                  const q = searchQuery.trim().toLowerCase();
                  if (q === "") return true;
                  const accountName = (transaction.trading_account_name || transaction.username || "").toString().toLowerCase();
                  const accountId = (transaction.trading_account_id || transaction.trading_account || transaction.account_id || "").toString().toLowerCase();
                  const note = (transaction.description || transaction.admin_comment || transaction.note || "").toString().toLowerCase();
                  const txnType = (transaction.transaction_type || transaction.type || "").toString().toLowerCase();
                  const status = (transaction.status || "").toString().toLowerCase();
                  const amount = (transaction.amount || "").toString().toLowerCase();

                  return (
                    accountName.includes(q) ||
                    accountId.includes(q) ||
                    note.includes(q) ||
                    txnType.includes(q) ||
                    status.includes(q) ||
                    amount.includes(q) ||
                    (transaction.username || "").toString().toLowerCase().includes(q) ||
                    (transaction.email || "").toString().toLowerCase().includes(q)
                  );
                });

                if (filteredData.length === 0) {
                  return (
                    <tr className="text-center">
                      <td
                        colSpan="6"
                        className={`py-6 font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        No {selectedCategory.toLowerCase()} found.
                      </td>
                    </tr>
                  );
                }

                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedData = filteredData.slice(startIndex, endIndex);

                return paginatedData.map((transaction) => (
                    <tr
                      key={transaction.id || transaction.trading_account_id || JSON.stringify(transaction)}
                      className={`${
                        isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                      } transition-colors duration-200`}
                    >
                      <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                        {transaction.created_at ? new Date(transaction.created_at).toLocaleString() : 'N/A'}
                      </td>

                      {selectedCategory === "Internal Transfer" ? (
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
                            {transaction.trading_account_id || transaction.trading_account || 'N/A'}
                          </td>
                          <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                            {transaction.trading_account_name || transaction.username || 'N/A'}
                          </td>
                        </>
                      )}

                      <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                        ${Number(transaction.amount || 0).toFixed(2)}
                      </td>
                      <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                        {transaction.admin_comment || transaction.description || 'N/A'}
                      </td>
                      <td className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${(() => {
                            const s = (transaction.status || '').toString().toLowerCase();
                            if (s.includes('approved') || s.includes('completed') || s.includes('success')) return 'bg-green-100 text-green-800';
                            if (s.includes('pending') || s.includes('in_progress') || s.includes('processing')) return 'bg-yellow-100 text-yellow-800';
                            if (s.includes('rejected') || s.includes('failed') || s.includes('cancel')) return 'bg-red-100 text-red-800';
                            return 'bg-gray-100 text-gray-800';
                          })()}`}
                        >
                          {transaction.status ? (transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)) : 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ));
              })()}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(() => {
          let displayData = [];
          if (selectedCategory === "Pending") {
            displayData = pendingTransactions;
          } else if (selectedCategory === "Withdrawal") {
            displayData = transactions.filter(t => t.transaction_type === "withdraw_trading");
          } else if (selectedCategory === "Deposit") {
            displayData = transactions.filter(t => t.transaction_type === "deposit_trading");
          } else if (selectedCategory === "Internal Transfer") {
            displayData = transactions.filter(t => t.transaction_type === "internal_transfer");
          }

          const filteredData = displayData.filter((transaction) => {
            const matchesSearch = searchQuery === "" ||
              (transaction.account_name && transaction.account_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (transaction.account_id && transaction.account_id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
              (transaction.note && transaction.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (transaction.amount && transaction.amount.toString().includes(searchQuery)) ||
              (transaction.type && transaction.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (transaction.status && transaction.status.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesSearch;
          });

          const totalPages = Math.ceil(filteredData.length / itemsPerPage);

          if (filteredData.length === 0 || totalPages <= 1) return null;

          return (
            <div className="flex justify-between items-center mt-4">
              {/* Left: Items per page selector */}
              <div className="flex items-center gap-2">
                <label className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700 bg-gray-100"} p-2 rounded-md`}>
                  Items per page:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-1 border rounded-md ${
                    isDarkMode
                      ? "bg-black-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                >
                <option className={`${isDarkMode? "bg-gray-800 border-gray-600 text-white": "bg-white border-gray-300 text-black"}`} value={5}>5</option>
                <option className={`${isDarkMode? "bg-gray-800 border-gray-600 text-white": "bg-white border-gray-300 text-black"}`} value={10}>10</option>
                <option className={`${isDarkMode? "bg-gray-800 border-gray-600 text-white": "bg-white border-gray-300 text-black"}`} value={20}>20</option>
                <option className={`${isDarkMode? "bg-gray-800 border-gray-600 text-white": "bg-white border-gray-300 text-black"}`} value={50}>50</option>
                </select>
              </div>

              {/* Right: Page navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-black-800 border-gray-600 text-white hover:bg-gray-700"
                      : "bg-white border-gray-300 text-black hover:bg-gray-100"
                  }`}
                >
                  Previous
                </button>
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-black-800 border-gray-600 text-white hover:bg-gray-700"
                      : "bg-white border-gray-300 text-black hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default Transactions;
