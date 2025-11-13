import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  CheckCircle,
  DollarSign,
  Scale,
  Plus,
  Minus,
} from "lucide-react";

export default function DemoAccountsPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Store created demo accounts
  const [demoAccounts, setDemoAccounts] = useState([]);

  // 🔹 Track selected account for View modal
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const [formData, setFormData] = useState({
    balance: "",
    leverage: "500x",
    masterPassword: "",
    investorPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Create new demo account
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Demo Account Created Successfully!");

    const newAccount = {
      id: Math.floor(1000000000 + Math.random() * 9000000000),
      balance: Number(formData.balance) || 10000,
      leverage: formData.leverage,
    };
    setDemoAccounts((prev) => [...prev, newAccount]);

    setIsOpen(false);
    setFormData({
      balance: "",
      leverage: "500x",
      masterPassword: "",
      investorPassword: "",
    });
  };

  // 🔹 Update balance using + or -
  const updateBalance = (id, type) => {
    setDemoAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              balance:
                type === "add"
                  ? acc.balance + 1
                  : acc.balance > 0
                  ? acc.balance - 1
                  : 0,
            }
          : acc
      )
    );
  };

  // 🔹 Update leverage
  const updateLeverage = (id, newLeverage) => {
    setDemoAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, leverage: newLeverage } : acc))
    );
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-black via-neutral-900 to-black text-white font-sans flex flex-col items-center py-10">
      {/* Top Buttons */}
      <div className="w-full max-w-5xl flex justify-between items-center px-6 mb-8">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-b from-yellow-400 to-yellow-600 text-black font-semibold px-5 py-2 rounded-md shadow-md hover:opacity-90 transition"
        >
          Open New Demo Account
        </button>

        <button
          onClick={() => navigate("/tradingAccounts")}
          className="bg-gradient-to-b from-yellow-400 to-yellow-600 text-black font-semibold px-5 py-2 rounded-md shadow-md hover:opacity-90 transition"
        >
          Go Live Account
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Explore Demo Account</h1>

      <div className="w-full max-w-7xl mt-8">
        <h2 className="text-yellow-400 font-semibold mb-4 text-center">
          Demo Accounts
        </h2>

        {/* ✅ Demo Accounts Table */}
        {demoAccounts.length > 0 ? (
          <div className="overflow-x-auto px-10">
            <table className="min-w-full bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm">
              <thead className="bg-neutral-800 text-yellow-400">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Account ID</th>
                  <th className="py-3 px-4 text-left">Balance (USD)</th>
                  <th className="py-3 px-4 text-left">Leverage</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {demoAccounts.map((acc, index) => (
                  <tr
                    key={acc.id}
                    className={`border-t border-gray-700 hover:bg-neutral-800/60 transition ${
                      selectedAccountId === acc.id
                        ? "bg-neutral-800/80 border-yellow-400"
                        : ""
                    }`}
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 text-yellow-400">{acc.id}</td>

                    {/* Editable Balance */}
                    <td className="py-3 px-4 flex items-center gap-2">
                      <button
                        onClick={() => updateBalance(acc.id, "subtract")}
                        className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        value={acc.balance}
                        readOnly
                        className="w-24 text-center bg-gray-800 text-white rounded py-1"
                      />
                      <button
                        onClick={() => updateBalance(acc.id, "add")}
                        className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                      >
                        <Plus size={14} />
                      </button>
                    </td>

                    {/* Editable Leverage */}
                    <td className="py-3 px-4">
                      <select
                        value={acc.leverage}
                        onChange={(e) => updateLeverage(acc.id, e.target.value)}
                        className="bg-gray-800 px-2 py-1 rounded text-sm focus:outline-none"
                      >
                        {["1x", "10x", "50x", "100x", "200x", "500x"].map(
                          (lev) => (
                            <option key={lev}>{lev}</option>
                          )
                        )}
                      </select>
                    </td>

                    {/* View / Update Buttons */}
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => setSelectedAccountId(acc.id)}
                        className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          alert(
                            `✅ Account Updated!\n\nAccount ID: ${acc.id}\nBalance: $${acc.balance}\nLeverage: ${acc.leverage}`
                          )
                        }
                        className="bg-yellow-400 text-black hover:bg-yellow-300 px-3 py-1 rounded text-sm font-semibold"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-6">
            No demo accounts yet. Create one above.
          </p>
        )}
      </div>

      {/* 🔍 View Current User Modal */}
      {selectedAccountId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setSelectedAccountId(null)}
        >
          <div className="bg-[#1f1f1f] rounded-lg shadow-lg p-6 w-full max-w-md text-white relative">
            <button
              onClick={() => setSelectedAccountId(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>

            {(() => {
              const acc = demoAccounts.find((a) => a.id === selectedAccountId);
              return (
                acc && (
                  <>
                    <h2 className="text-xl font-semibold text-yellow-400 mb-3">
                      Account Details
                    </h2>
                    <p className="mb-1">
                      <span className="text-gray-400">Account ID:</span>{" "}
                      <span className="text-yellow-400">{acc.id}</span>
                    </p>
                    <p className="mb-1">
                      <span className="text-gray-400">Balance:</span> ${acc.balance}
                    </p>
                    <p className="mb-1">
                      <span className="text-gray-400">Leverage:</span> {acc.leverage}
                    </p>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setSelectedAccountId(null)}
                        className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )
              );
            })()}
          </div>
        </div>
      )}

      {/* ⚙️ Modal - Create New Demo Account */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="bg-[#1f1f1f] relative rounded-lg shadow-lg p-6 w-full max-w-md text-white">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold mb-1 text-yellow-400">
              Create Demo Account
            </h2>
            <p className="text-sm text-gray-300 mb-4">
              Set up a free demo account to explore trading without risks.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Balance */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Initial Balance (USD)
                </label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  placeholder="Enter balance (default: $10,000)"
                  className="w-full px-3 py-2 bg-gray-800 rounded focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Leave empty for default $10,000
                </p>
              </div>

              {/* Leverage */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Leverage *
                </label>
                <select
                  name="leverage"
                  value={formData.leverage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 rounded focus:outline-none"
                >
                  {["1x", "10x", "50x", "100x", "200x", "500x"].map((lev) => (
                    <option key={lev}>{lev}</option>
                  ))}
                </select>
              </div>

              {/* Master Password */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Master Password *
                </label>
                <input
                  type="password"
                  name="masterPassword"
                  value={formData.masterPassword}
                  onChange={handleChange}
                  placeholder="Enter master password"
                  required
                  className="w-full px-3 py-2 bg-gray-800 rounded focus:outline-none"
                />
              </div>

              {/* Investor Password */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Investor Password *
                </label>
                <input
                  type="password"
                  name="investorPassword"
                  value={formData.investorPassword}
                  onChange={handleChange}
                  placeholder="Enter investor password"
                  required
                  className="w-full px-3 py-2 bg-gray-800 rounded focus:outline-none"
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
