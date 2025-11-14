import React, { useState } from "react";
import { Search } from "lucide-react";
import { useTheme } from '../context/ThemeContext';

const Transactions = () => {
  const { isDarkMode } = useTheme();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} p-4 sm:p-8`}>
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
              className={`w-full pl-10 pr-3 py-2 rounded-md ${isDarkMode ? 'bg-black border-yellow-500 text-yellow-300 placeholder-yellow-400 hover:bg-gray-900' : 'bg-white border-yellow-500 text-black placeholder-gray-500 hover:bg-gray-100'} focus:outline-none transition-all duration-200 text-sm sm:text-base`}
            />
          </div>

          {/* 🧩 Filters */}
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
              {/* Type Filter */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`px-3 py-2 text-sm sm:text-base w-full sm:min-w-[150px] border border-yellow-600 rounded-md ${isDarkMode ? 'bg-gray-900 text-white border-yellow-500' : 'bg-gray-100 text-black border-yellow-500'} focus:ring-2 focus:ring-yellow-400 outline-none appearance-none`}
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="internal">Internal Transfer</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-3 py-2 text-sm sm:text-base w-full sm:min-w-[150px] border border-yellow-600 rounded-md ${isDarkMode ? 'bg-gray-900 text-white border-yellow-500' : 'bg-gray-100 text-black border-yellow-500'} focus:ring-2 focus:ring-yellow-400 outline-none appearance-none`}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className={`px-3 py-2 text-sm sm:text-base w-full sm:min-w-[150px] border border-yellow-600 rounded-md ${isDarkMode ? 'bg-gray-900 text-white border-yellow-500' : 'bg-gray-100 text-black border-yellow-500'} focus:ring-2 focus:ring-yellow-400 outline-none appearance-none`}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="3months">Last 3 Months</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 Transactions Table */}
        <div className={`overflow-x-auto shadow-lg ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-300 bg-white'}`}>
          <table className="w-full border-collapse text-left text-sm sm:text-base border border-yellow-600">
            <thead className={`text-yellow-400 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <tr>
                <th className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>Date/Time</th>

                {/* Dynamic columns for internal transfers */}
                {typeFilter === "internal" ? (
                  <>
                    <th className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>From Account</th>
                    <th className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>To Account</th>
                  </>
                ) : (
                  <>
                    <th className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>Account ID</th>
                    <th className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>Account Name</th>
                  </>
                )}

                <th className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>Amount (USD)</th>
                <th className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>Note</th>
                <th className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="text-center">
                <td colSpan="6" className={`py-6 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No transactions found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
