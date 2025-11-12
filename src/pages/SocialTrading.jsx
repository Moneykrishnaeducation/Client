import React, { useState } from "react";
import { Info, X } from "lucide-react";

const MAMManager = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);

  // Form data
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

  const togglePassword = (fieldId) => {
    const input = document.getElementById(fieldId);
    if (input) input.type = input.type === "password" ? "text" : "password";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ New MAM Account Created Successfully!");
    setShowModal(false);

    // Reset form
    setForm({
      accountName: "",
      profitPercentage: "",
      riskLevel: "Medium",
      leverage: "500x",
      payoutFrequency: "Weekly",
      masterPassword: "",
      investorPassword: "",
    });
  };

  return (
    <div className="max-h-[90vh] w-full bg-black text-white flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto p-8 relative bg-transparent text-center">
        {/* Header */}
        <div className="flex justify-center items-center mb-4 relative">
          <h1
            onClick={() => {
              setAnimateTitle(true);
              setTimeout(() => setAnimateTitle(false), 1500);
            }}
            className={`hidden sm:block text-[25px] font-bold cursor-pointer 
              ${
                animateTitle
                  ? "bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 bg-[length:200%_100%] animate-gold-move text-transparent bg-clip-text"
                  : "text-yellow-400"
              }`}
          >
            Multi-Account Manager
          </h1>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 underline font-semibold text-sm absolute right-0 transition-all duration-200"
          >
            <Info className="w-4 h-4 text-blue-400" />
            Know what it is?
          </button>
        </div>

        {/* Info Box */}
        {showInfo && (
          <div className="mb-6 bg-gray-900/70 p-6 rounded-md text-gray-300 max-w-3xl mx-auto text-left transition-all duration-300">
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
              ✅ <strong>Note:</strong> All trades are copied with a minimum of 0.01 lot.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8 mt-[20px]">
          <button
            className="bg-yellow-400 text-black font-semibold py-3 px-4 rounded-md w-full sm:w-1/2 hover:bg-yellow-300 transition-all duration-200"
            onClick={() => setShowModal(true)}
          >
            + Create New MAM Manager Account
          </button>
          <button className="bg-yellow-400 text-black font-semibold py-3 px-4 rounded-md w-full sm:w-1/2 hover:bg-yellow-300 transition-all duration-200">
            + Invest in a MAM Account
          </button>
        </div>

        {/* ✅ Always show this border box (no account data) */}
        {/* No Accounts Section */}
<div className="text-center border-2 border-dashed border-yellow-400 rounded-md p-4 mt-4 animate-border-glow">
  <p className="font-semibold text-[16px] mb-1 text-white">
    No MAM Accounts Found
  </p>
  <p className="text-sm text-gray-300">
    Click{" "}
    <span
      onClick={() => setShowModal(true)} // 👈 Add this line
      className="text-yellow-400 font-semibold cursor-pointer hover:underline"
    >
      “Create New MAM Account”
    </span>{" "}
    to create your first MAM account.
  </p>
</div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-left relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-yellow-400">
                Create New MAM Account
              </h2>
              <X
                className="w-6 h-6 cursor-pointer text-gray-400 hover:text-yellow-400"
                onClick={() => setShowModal(false)}
              />
            </div>

            {/* Form */}
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
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-transparent outline-none text-white"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("masterPassword")}
                    className="px-2 text-yellow-400 hover:text-yellow-300"
                  >
                    👁
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
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-transparent outline-none text-white"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("investorPassword")}
                    className="px-2 text-yellow-400 hover:text-yellow-300"
                  >
                    👁
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
};

export default MAMManager;
