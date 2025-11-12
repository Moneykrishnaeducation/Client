import React, { useState } from "react";

const Transactions = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 flex-wrap w-full">
          {/* Search Bar - Left Side */}
          <div className="flex w-full sm:w-auto items-center gap-2">
            <input
              type="text"
              placeholder="Search transactions..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none w-full sm:w-72"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg whitespace-nowrap">
              Search
            </button>
          </div>

          {/* Filters - Right Side */}
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto">
              {/* Type Filter */}
              <div className="relative w-full sm:w-auto overflow-hidden">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 text-sm sm:text-base w-full sm:min-w-[150px] max-w-full rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none appearance-none"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="internal">Internal Transfer</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-auto overflow-hidden">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm sm:text-base w-full sm:min-w-[150px] max-w-full rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative w-full sm:w-auto overflow-hidden">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 text-sm sm:text-base w-full sm:min-w-[150px] max-w-full rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none appearance-none"
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="3months">Last 3 Months</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-lg bg-gray-900">
          <table className="w-full border-collapse text-left text-sm sm:text-base">
            <thead className="bg-gray-800 text-yellow-400">
              <tr>
                <th className="p-3 border-b border-gray-700">Date/Time</th>

                {/* Dynamic columns for internal transfers */}
                {typeFilter === "internal" ? (
                  <>
                    <th className="p-3 border-b border-gray-700">
                      From Account
                    </th>
                    <th className="p-3 border-b border-gray-700">
                      To Account
                    </th>
                  </>
                ) : (
                  <>
                    <th className="p-3 border-b border-gray-700">Account ID</th>
                    <th className="p-3 border-b border-gray-700">
                      Account Name
                    </th>
                  </>
                )}

                <th className="p-3 border-b border-gray-700">Amount (USD)</th>
                <th className="p-3 border-b border-gray-700">Note</th>
                <th className="p-3 border-b border-gray-700">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="text-center">
                <td colSpan="6" className="py-6 text-gray-400 font-medium">
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
