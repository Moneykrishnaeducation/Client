import React, { useState, useEffect } from "react";
import {
  Info as InfoIcon,
  Plus,
  Users,
  Settings,
  CreditCard,
  Banknote,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✔ Custom InfoBox Component
function InfoBox({ label, value }) {
  return (
    <div className="border border-yellow-400 p-3 rounded-md bg-[#1a1a1a]">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default function MamDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // ✅ Load from localStorage initially
  const [mamAccounts, setMamAccounts] = useState(() => {
    const stored = localStorage.getItem("mamAccounts");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedAccount, setSelectedAccount] = useState(null); // ✔ REQUIRED
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTradesModal, setShowTradesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    accountName: "",
    profitPercentage: "",
    riskLevel: "Medium",
    leverage: "500x",
    payoutFrequency: "Weekly",
    masterPassword: "",
    investorPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAccount = {
      ...form,
      enabled: true,
      id: Math.floor(Math.random() * 9000000000) + 1000000000,
    };

    // ✅ Update state and localStorage
    setMamAccounts((prev) => {
      const updated = [...prev, newAccount];
      localStorage.setItem("mamAccounts", JSON.stringify(updated));
      return updated;
    });

    setForm({
      accountName: "",
      profitPercentage: "",
      riskLevel: "Medium",
      leverage: "500x",
      payoutFrequency: "Weekly",
      masterPassword: "",
      investorPassword: "",
    });

    setShowModal(false);
  };

  const handleToggleStatus = (id) => {
    setMamAccounts((prev) => {
      const updated = prev.map((acc) =>
        acc.id === id ? { ...acc, enabled: !acc.enabled } : acc
      );
      localStorage.setItem("mamAccounts", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className=" text-white flex flex-col items-center py-8 font-sans">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Multi-Account Manager
      </h2>

      {/* Info Button */}
      <div className="flex w-full justify-end gap-1 px-10 text-sm mb-4">
        <InfoIcon className="w-4 h-4 text-blue-400" />
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-blue-400 hover:underline"
        >
          Know what it is?
        </button>
      </div>

      {showInfo && (
        <div className="mb-6 bg-gray-900/70 p-6 rounded-md text-gray-300 max-w-3xl w-[90%] text-left">
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">
            Understanding MAM Accounts
          </h3>
          <p className="text-sm mb-2">
            <strong>Manager Trades, Auto-Copied:</strong> All trades made by the manager are automatically copied to investor accounts.
          </p>
          <p className="text-sm mb-3">
            <strong>Proportional Lot Sizing:</strong> The system adjusts lot size based on investment balance.
          </p>
          <ul>
            <li>Example: Manager trades 1 lot for $10,000.</li>
            <li>$20,000 Investor: Gets 2 lots.</li>
            <li>$5,000 Investor: Gets 0.5 lots.</li>
          </ul>
          <p className=" text-sm mt-3">
            ✅  Important Note: All trades will be copied with a minimum size of 0.01 lot, ensuring you participate in every trading opportunity.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-6 mb-6 max-w-5xl">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#FFD700] text-black font-semibold py-3 px-5 rounded-md hover:bg-yellow-400 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New MAM Manager Account
        </button>

        <button
          onClick={() => navigate("/MAMInvestments")}
          className="bg-[#FFD700] text-black font-semibold py-3 px-14 rounded-md hover:bg-yellow-400 flex items-center gap-2"
        >
          <Users className="w-4 h-4" /> Invest in a MAM Account
        </button>
      </div>

      {/* No Accounts */}
      {mamAccounts.length === 0 && (
        <div
          onClick={() => setShowModal(true)}
          className="cursor-pointer text-center text-sm text-gray-300 rounded-lg py-6 px-8 mb-6 w-[90%] max-w-5xl hover:bg-[#222] transition"
        >
          <p className="text-gray-200 mb-1 font-semibold">No MAM Accounts Found</p>
          <p>
            Click the{" "}
            <span className="text-yellow-400 font-medium underline">
              Create New MAM Account
            </span>{" "}
            button to begin.
          </p>
        </div>
      )}

      {/* Accounts Table */}
      {mamAccounts.length > 0 && (
        <div className="overflow-x-auto w-[90%] max-w-6xl mb-6">
          <table className="min-w-full text-left">
            <thead className="bg-gray-800 text-yellow-400">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Account Name</th>
                <th className="px-4 py-2">Profit Sharing</th>
                <th className="px-4 py-2">Leverage</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {mamAccounts.map((acc) => (
                <tr
                  key={acc.id}
                  className="bg-[#1a1a1a] hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2">{acc.id}</td>
                  <td className="px-4 py-2">{acc.accountName}</td>
                  <td className="px-4 py-2">{acc.profitPercentage}%</td>
                  <td className="px-4 py-2">{acc.leverage}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      acc.enabled ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {acc.enabled ? "Enabled" : "Disabled"}
                  </td>

                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                      onClick={() => setSelectedAccount(acc)}
                    >
                      View
                    </button>

                    <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-white transition">
                      Deposit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ACCOUNT DETAILS SECTION */}
      {selectedAccount && (
        <div className="mt-6 w-[90%] max-w-5xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-yellow-400">Account Details</h3>

            <button
              onClick={() => setSelectedAccount(null)}
              className="text-yellow-400 border border-yellow-400 px-4 py-1 rounded hover:bg-yellow-400 hover:text-black transition"
            >
              ← Back
            </button>
          </div>

          <div className="bg-[#111] border border-yellow-400 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <InfoBox label="Account ID" value={selectedAccount.id} />
              <InfoBox label="Account Name" value={selectedAccount.accountName} />
              <InfoBox label="Profit Sharing" value={selectedAccount.profitPercentage + "%"} />
              <InfoBox label="Leverage" value={selectedAccount.leverage} />
              <InfoBox label="Status" value={selectedAccount.enabled ? "Enabled" : "Disabled"} />

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-white transition">
                Deposit
              </button>

              <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-white transition">
                Withdraw
              </button>

              <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-white transition">
                Investors
              </button>

              <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-white transition">
                Settings
              </button>

              <button
                onClick={() => handleToggleStatus(selectedAccount.id)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedAccount.enabled
                    ? "bg-yellow-500 hover:bg-yellow-400"
                    : "bg-red-500 hover:bg-red-400"
                }`}
              >
                {selectedAccount.enabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ACCOUNT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-yellow-400">Create New MAM Account</h2>
              <X
                className="w-6 h-6 cursor-pointer text-gray-400 hover:text-yellow-400"
                onClick={() => setShowModal(false)}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Account Name</label>
                <input
                  type="text"
                  id="accountName"
                  value={form.accountName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Profit Sharing (%)</label>
                <input
                  type="number"
                  id="profitPercentage"
                  value={form.profitPercentage}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Risk Level</label>
                <select
                  id="riskLevel"
                  value={form.riskLevel}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Leverage</label>
                <select
                  id="leverage"
                  value={form.leverage}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800"
                >
                  <option>50x</option>
                  <option>100x</option>
                  <option>200x</option>
                  <option>500x</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Payout Frequency</label>
                <select
                  id="payoutFrequency"
                  value={form.payoutFrequency}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800"
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Half-Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Master Password</label>
                <input
                  type="password"
                  id="masterPassword"
                  value={form.masterPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Investor Password</label>
                <input
                  type="password"
                  id="investorPassword"
                  value={form.investorPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-yellow-500 px-4 py-2 rounded text-black font-semibold"
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
