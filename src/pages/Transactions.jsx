import React, { useState } from "react";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("deposits");

  const tabs = [
    { key: "deposits", label: "Deposits" },
    { key: "withdrawals", label: "Withdrawals" },
    { key: "transfers", label: "Internal Transfers" },
    { key: "pendings", label: "Pending Transaction" },
  ];

  const renderTable = (type) => (
    <div className="bg-black text-white rounded-xl shadow-lg p-4 mb-6">
      <div className="overflow-x-auto max-h-[420px] rounded-lg">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-yellow-400">
              {type === "transfers" ? (
                <>
                  <th className="p-3 border-b border-gray-700">Date/Time</th>
                  <th className="p-3 border-b border-gray-700">From Account</th>
                  <th className="p-3 border-b border-gray-700">To Account</th>
                  <th className="p-3 border-b border-gray-700">Amount (USD)</th>
                  <th className="p-3 border-b border-gray-700">Note</th>
                  <th className="p-3 border-b border-gray-700">Status</th>
                </>
              ) : (
                <>
                  <th className="p-3 border-b border-gray-700">Date/Time</th>
                  <th className="p-3 border-b border-gray-700">Account ID</th>
                  <th className="p-3 border-b border-gray-700">Account Name</th>
                  <th className="p-3 border-b border-gray-700">Amount (USD)</th>
                  <th className="p-3 border-b border-gray-700">Note</th>
                  <th className="p-3 border-b border-gray-700">Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan="6"
                className="text-center py-4 text-yellow-400 italic"
              >
                Loading {type}...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 transition-all">
      <h1 className="text-3xl font-bold text-center text-yellow-400 mb-8">
        Transactions History
      </h1>

      {/* Tabs */}
      <div className="flex bg-gray-800 rounded-xl overflow-hidden mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-yellow-400 text-black rounded-lg shadow-md"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {renderTable(activeTab)}
    </div>
  );
};

export default Transactions;
