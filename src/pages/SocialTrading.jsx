import React, { useState } from "react";
import {
  Info,
  Plus,
  Users,
  Settings,
  CreditCard,
  Banknote,
  X,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MamDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mamAccounts, setMamAccounts] = useState([]);
  const navigate = useNavigate();

  // Function to generate random passwords
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const [form, setForm] = useState({
    accountName: "",
    profitPercentage: "",
    riskLevel: "Medium",
    leverage: "500x",
    payoutFrequency: "Weekly",
    masterPassword: "",
    investorPassword: "",
  });

  // Auto-generate passwords when modal opens
  const handleOpenModal = () => {
    setForm((prev) => ({
      ...prev,
      masterPassword: generatePassword(),
      investorPassword: generatePassword(),
    }));
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const togglePassword = (fieldId) => {
    const input = document.getElementById(fieldId);
    if (input) input.type = input.type === "password" ? "text" : "password";
  };

  const regeneratePassword = (field) => {
    setForm({ ...form, [field]: generatePassword() });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAccount = {
      ...form,
      enabled: true,
      id: Math.floor(Math.random() * 9000000000) + 1000000000,
    };

    setMamAccounts((prev) => [...prev, newAccount]);

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
    setMamAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, enabled: !acc.enabled } : acc
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center py-8 font-sans">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-2 text-center">
        Multi-Account Manager
      </h2>

      {/* Info Button */}
      <div className="flex items-center gap-1 text-sm mb-4">
        <Info className="w-4 h-4 text-blue-400" />
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-blue-400 hover:underline"
        >
          Know what it is?
        </button>
      </div>

      {/* Info Section */}
      {showInfo && (
        <div className="mb-6 bg-gray-900/70 p-6 rounded-md text-gray-300 max-w-3xl w-[90%] text-left">
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">
            Understanding MAM Accounts
          </h3>
          <p className="text-sm mb-2">
            <strong>Manager Trades, Auto-Copied:</strong> Trades by the manager
            are automatically replicated in your investment account.
          </p>
          <p className="text-sm mb-3">
            <strong>Proportional Lot Sizing:</strong> Lot size adjusts based on
            your account balance relative to the manager's.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 ml-3">
            <li>Manager trades 1 lot for $10,000.</li>
            <li>$20,000 Investor → 2 lots.</li>
            <li>$5,000 Investor → 0.5 lots.</li>
          </ul>
          <p className="text-green-400 text-sm mt-3">
            ✅ <strong>Note:</strong> All trades are copied with a minimum of
            0.01 lot.
          </p>
        </div>
      )}

      {/* Main Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 w-[90%] max-w-5xl">
        <button
          onClick={handleOpenModal}
          className="bg-[#FFD700] text-black font-semibold py-3 px-5 rounded-md hover:bg-yellow-400 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Create New MAM Manager Account
        </button>

        <button
          onClick={() => navigate("/MAMInvestments")}
          className="bg-[#FFD700] text-black font-semibold py-3 px-5 rounded-md hover:bg-yellow-400 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Users className="w-4 h-4" /> Invest in a MAM Account
        </button>
      </div>

      {/* No Accounts Found */}
      {mamAccounts.length === 0 && (
        <div
          onClick={handleOpenModal}
          className="cursor-pointer text-center text-sm text-gray-300 border-[2.5px] border-dashed border-yellow-400 rounded-lg py-6 px-8 mb-6 w-[90%] max-w-5xl hover:bg-[#222] transition"
        >
          <p className="font-semibold text-gray-200 mb-1">
            No MAM Accounts Found
          </p>
          <p>
            Click the{" "}
            <span className="text-yellow-400 font-medium underline">
              "Create New MAM Account"
            </span>{" "}
            to create your first MAM account.
          </p>
        </div>
      )}

      {/* Account Cards */}
      {mamAccounts.map((acc) => (
        <div
          key={acc.id}
          className="border-[2.5px] border-yellow-400 rounded-lg p-6 mb-4 w-[90%] max-w-5xl bg-[#1a1a1a]"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold text-white">{acc.accountName} - MAM</h3>
              <p className="text-sm text-gray-400">ID : {acc.id}</p>
            </div>
            <span
              className={`text-sm font-semibold ${
                acc.enabled ? "text-green-400" : "text-red-400"
              }`}
            >
              • {acc.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm font-semibold mb-4">
            <p>
              Profit Sharing :{" "}
              <span className="text-yellow-400">{acc.profitPercentage}%</span>
            </p>
            <p>
              Total Profit : <span className="text-yellow-400">$ 0.00</span>
            </p>
            <p>
              Leverage : <span className="text-yellow-400">{acc.leverage}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button className="bg-[#FFD700] text-black font-semibold py-2 px-4 rounded-md flex items-center gap-2 hover:bg-yellow-400">
              <CreditCard className="w-4 h-4" /> Deposit
            </button>
            <button className="bg-[#FFD700] text-black font-semibold py-2 px-4 rounded-md flex items-center gap-2 hover:bg-yellow-400">
              <Banknote className="w-4 h-4" /> Withdraw
            </button>
            <button className="bg-[#FFD700] text-black font-semibold py-2 px-4 rounded-md flex items-center gap-2 hover:bg-yellow-400">
              <Users className="w-4 h-4" /> Investors
            </button>
            <button className="bg-[#FFD700] text-black font-semibold py-2 px-4 rounded-md flex items-center gap-2 hover:bg-yellow-400">
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button
              onClick={() => handleToggleStatus(acc.id)}
              className={`${
                acc.enabled ? "bg-[#FFD700]" : "bg-red-500"
              } text-black font-semibold py-2 px-4 rounded-md flex items-center gap-2 hover:opacity-80`}
            >
              <X className="w-4 h-4 text-red-700" />
              {acc.enabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>
      ))}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg text-left relative overflow-y-auto max-h-[90vh] border-[2.5px] border-yellow-400">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-yellow-400">
                Create New MAM Account
              </h2>
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
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-yellow-400"
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
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Risk Level</label>
                <select
                  id="riskLevel"
                  value={form.riskLevel}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
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
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
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
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Half-Yearly</option>
                </select>
              </div>

              {/* Master Password */}
              <div>
                <label className="block text-sm mb-1">Master Password</label>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded">
                  <input
                    type="password"
                    id="masterPassword"
                    value={form.masterPassword}
                    readOnly
                    className="w-full p-2 bg-transparent outline-none text-white"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("masterPassword")}
                    className="px-2 text-yellow-400 hover:text-yellow-300"
                  >
                    👁
                  </button>
                  <button
                    type="button"
                    onClick={() => regeneratePassword("masterPassword")}
                    className="px-2 text-blue-400 hover:text-blue-300"
                    title="Regenerate Password"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Investor Password */}
              <div>
                <label className="block text-sm mb-1">Investor Password</label>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded">
                  <input
                    type="password"
                    id="investorPassword"
                    value={form.investorPassword}
                    readOnly
                    className="w-full p-2 bg-transparent outline-none text-white"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("investorPassword")}
                    className="px-2 text-yellow-400 hover:text-yellow-300"
                  >
                    👁
                  </button>
                  <button
                    type="button"
                    onClick={() => regeneratePassword("investorPassword")}
                    className="px-2 text-blue-400 hover:text-blue-300"
                    title="Regenerate Password"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-semibold"
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
