import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { apiCall } from "../utils/api";
import { useSearchParams } from "react-router-dom";

const Transactions = () => {
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [tradingAccounts, setTradingAccounts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* ✅ READ CATEGORY FROM URL */
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (
      categoryFromUrl &&
      ["Pending", "Withdrawal", "Internal Transfer", "Deposit"].includes(categoryFromUrl)
    ) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  /* Reset pagination */
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  /* Fetch transactions */
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await apiCall("user-transactions/");
        const txns = Array.isArray(data)
          ? data
          : data?.transactions || [];
        setTransactions(txns);
        setError(null);
      } catch (err) {
        setError("Failed to load transactions. Please try again.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  /* Fetch pending + accounts */
  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        const data = await apiCall("pending-transactions/");
        setPendingTransactions(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUserTradingAccounts = async () => {
      try {
        const data = await apiCall("user-trading-accounts/");
        setTradingAccounts(data.accounts || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPendingTransactions();
    fetchUserTradingAccounts();
  }, []);

  /* CATEGORY DATA */
  const getCategoryData = () => {
    if (selectedCategory === "Pending") return pendingTransactions;
    if (selectedCategory === "Withdrawal")
      return transactions.filter(t => t.transaction_type === "withdraw_trading");
    if (selectedCategory === "Deposit")
      return transactions.filter(t => t.transaction_type === "deposit_trading");
    if (selectedCategory === "Internal Transfer")
      return transactions.filter(t => t.transaction_type === "internal_transfer");
    return [];
  };

  const filteredData = getCategoryData().filter((t) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      (t.trading_account_name || t.username || "").toLowerCase().includes(q) ||
      (t.trading_account_id || t.trading_account || "").toString().includes(q) ||
      (t.description || t.admin_comment || "").toLowerCase().includes(q) ||
      (t.status || "").toLowerCase().includes(q) ||
      (t.amount || "").toString().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-black text-white" : "bg-white text-black"} p-4 sm:p-8`}>
      <div className="px-3 mx-auto w-full">

        {/* Search + Category */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative w-full sm:w-72 border border-yellow-600 rounded">
            <Search className="absolute left-3 top-2.5 text-yellow-500" size={18} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 py-2 bg-transparent outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["Pending", "Withdrawal", "Internal Transfer", "Deposit"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-2 border border-yellow-600 rounded-md ${
                  selectedCategory === c
                    ? "bg-yellow-500 text-black"
                    : "hover:bg-gray-800"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-yellow-600">
          <table className="w-full text-sm">
            <thead className="text-yellow-400">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Account</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Note</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-6">Loading...</td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-6">No data found</td></tr>
              ) : (
                paginatedData.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-800">
                    <td className="p-3">{new Date(t.created_at).toLocaleString()}</td>
                    <td className="p-3">{t.trading_account_name || t.username}</td>
                    <td className="p-3">${Number(t.amount).toFixed(2)}</td>
                    <td className="p-3">{t.description || t.admin_comment}</td>
                    <td className="p-3">{t.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
