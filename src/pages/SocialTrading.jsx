import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info as InfoIcon, Plus, Users, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { apiCall } from "../utils/api";

import Withdraw from "./Withdraw";
import DepositModal from "./DepositModal";
import InvestorManagement from "./InvestorManagement";
import SettingsModal from "./SettingsModal";
import { Eye, EyeOff } from "lucide-react";

// ✔ InfoBox Component
function InfoBox({ label, value, isDarkMode }) {
  return (
    <div className={`border p-3 rounded-md ${isDarkMode ? 'border-yellow-400 bg-[#1a1a1a]' : 'border-gray-300 bg-white'}`}>
      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{value}</p>
    </div>
  );
}

export default function MamDashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mamAccounts, setMamAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [toggleLoadingIds, setToggleLoadingIds] = useState([]);
  const [toggleError, setToggleError] = useState(null);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [activeTab, setActiveTab] = useState("cheesepay");
  const [cheeseAmount, setCheeseAmount] = useState("");
  const [currency, setCurrency] = useState("USD");

  const [selectedDepositAccount, setSelectedDepositAccount] = useState(null);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTradesModal, setShowTradesModal] = useState(false);

  const [newLeverage, setNewLeverage] = useState("");
  const [selectedPasswordType, setSelectedPasswordType] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [showMasterPwd, setShowMasterPwd] = useState(false);
  const [showInvestorPwd, setShowInvestorPwd] = useState(false);


  const [form, setForm] = useState({
    account_name: "",
    profit_percentage: "",
    risk_level: "Medium",
    leverage: "500x",
    payout_frequency: "Weekly",
    master_password: "",
    investor_password: "",
  });





  useEffect(() => {
    // MAM accounts fetched from API, no localStorage fallback
    // Fetch MAM accounts from API
    fetchMAMAccounts();
  }, []);

  const fetchMAMAccounts = async () => {
  try {
    // ✅ Correct endpoint (NO api/)
    const data = await apiCall("user-mam-accounts/");

    const formatted = data.map((acc) => ({
      account_id: acc.account_id,
      accountName: acc.account_name,
      profitPercentage:
        acc.profit_sharing_percentage ?? acc.profit_percentage,
      leverage: acc.leverage,
      enabled: acc.is_enabled,
    }));

    setMamAccounts(formatted);
    // Accounts managed by server state only
  } catch (error) {
    console.error("Error fetching MAM accounts:", error);
  }
};

const handleChange = (e) => {
  setForm((prev) => ({
    ...prev,
    [e.target.id]: e.target.value,
  }));
};

  const handleToggleStatus = (id) => {
    // Call server API to toggle MAM account status
    (async () => {
      setToggleError(null);
      setToggleLoadingIds((prev) => Array.from(new Set([...prev, id])));
      try {
        // determine current enabled state from local list or selectedAccount
        const current = mamAccounts.find((acc) => acc.account_id === id);
        const currentEnabled = typeof current !== 'undefined' ? current.enabled : (selectedAccount && selectedAccount.account_id === id ? selectedAccount.enabled : true);
        const enableTrading = !currentEnabled; // send desired state

        const payload = { mam_id: id, enable_trading: enableTrading };

        const result = await apiCall(`api/toggle-mam-status/${id}/`, {method:'POST',body:JSON.stringify(payload)});

        // server may return new state in result.is_enabled or result.enabled
        const newEnabled = (typeof result.is_enabled !== 'undefined') ? Boolean(result.is_enabled) :
          (typeof result.enabled !== 'undefined') ? Boolean(result.enabled) :
            enableTrading;

        setMamAccounts((prev) => {
          const updated = prev.map((acc) =>
            acc.account_id === id ? { ...acc, enabled: newEnabled } : acc
          );
          // Accounts updated on server, no localStorage needed
          return updated;
        });

        if (selectedAccount && selectedAccount.account_id === id) {
          setSelectedAccount((prev) => ({ ...prev, enabled: newEnabled }));
        }
      } catch (error) {
        console.error('Toggle MAM account error:', error);
        setToggleError(String(error));
      } finally {
        setToggleLoadingIds((prev) => prev.filter((v) => v !== id));
      }
    })();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Token is in HttpOnly cookie, automatically sent by browser

    // Validate profit_percentage
    const profitPercentage = parseFloat(form.profit_percentage);
    if (isNaN(profitPercentage) || profitPercentage <= 0) {
      alert("Please enter a valid profit sharing percentage greater than 0.");
      return;
    }

    // Prepare form data with corrected types and values
    const payload = {
      ...form,
      profit_percentage: profitPercentage,
      leverage: parseInt(form.leverage.replace('x', ''), 10),
      risk_level: form.risk_level.toLowerCase(),
      payout_frequency: form.payout_frequency.toLowerCase(),
    };

    try {
      const data = await apiCall("api/mam-accounts/create/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("MAM Account Created Successfully!");

      const newAccount = {
        account_id: data.account_id,
        accountName: data.account_name,
        profitPercentage: data.profit_sharing_percentage || data.profit_percentage,
        leverage: data.leverage,
        enabled: data.is_enabled,
      };

      setMamAccounts((prev) => [...prev, newAccount]);
      setShowModal(false);
    } catch (error) {
      console.error("Create MAM error:", error);
      alert("Something went wrong. Check console.");
    }
  };



  //Total Profits

  const fetchMamProfitDetails = async (mamId) => {
    try {
      const data = await apiCall(`api/mam-profit-details/${mamId}/`);

      // Calculate TOTAL PROFIT = mam + investors
      const investorTotal = data.investor_profits.reduce(
        (sum, inv) => sum + inv.profit,
        0
      );

      const totalProfit = data.mam_profit + investorTotal;

      // Update selected account
      setSelectedAccount((prev) => ({
        ...prev,
        totalProfit: totalProfit,
        mamProfit: data.mam_profit,
        investorProfits: data.investor_profits,
      }));

    } catch (error) {
      console.error("Error fetching MAM profit details:", error);
    }
  };


  return (
    <div className="w-full flex flex-col items-center text-white pt-6">
      <h2 className="text-2xl font-bold mb-2 text-center">Multi-Account Manager</h2>

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
        <div className={`mb-6 p-6 rounded-md max-w-3xl w-[90%] text-left ${isDarkMode ? 'bg-gray-900/70 text-gray-300' : 'bg-white text-black border border-gray-300'}`}>
          <div className="noticed-header mb-4">
            <strong className={`text-lg font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-black'}`}>Understanding MAM Accounts</strong>
          </div>
          <div className="noticed-content space-y-3">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong className={isDarkMode ? 'text-yellow-400' : 'text-black'}>Manager Trades, Auto-Copied:</strong> Trades by the manager are automatically replicated in your investment account in real time.
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong className={isDarkMode ? 'text-yellow-400' : 'text-black'}>Proportional Lot Sizing:</strong> Lot size adjusts based on your account balance relative to the manager's.
            </p>
            <ul className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-1`}>
              <li><strong className={isDarkMode ? 'text-yellow-400' : 'text-black'}>Example:</strong> Manager trades 1 lot for $10,000.</li>
              <li>$20,000 Investor: Gets 2 lots.</li>
              <li>$5,000 Investor: Gets 0.5 lots.</li>
            </ul>
            <p className={`important-note text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              ✅ <span id="ttl-important-note" className="font-semibold">Important Note:</span> All trades will be copied with a minimum size of 0.01 lot, ensuring you participate in every trading opportunity.
            </p>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
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

      {/* ACCOUNTS TABLE */}
      {!selectedAccount && mamAccounts.length > 0 && (
        <div className="overflow-x-auto w-[95%] px-3 mb-6">
          <table className="min-w-full text-left">
            <thead className="text-yellow-400">
              <tr>
                <th className="px-4 py-2">Account ID</th>
                <th className="px-4 py-2">Account Name</th>
                <th className="px-4 py-2">Profit Sharing</th>
                <th className="px-4 py-2">Leverage</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {mamAccounts.map((acc) => (
                <tr key={acc.account_id} className={`${isDarkMode ? 'bg-[#1a1a1a] text-yellow-600 hover:bg-gray-700' : 'bg-white text-black hover:bg-gray-100'} transition`}>
                  <td className={`px-4 py-2 ${isDarkMode ? 'text-gray-300 bg-black' : 'text-black'}`}>{acc.account_id}</td>
                  <td className={`px-4 py-2 ${isDarkMode ? 'text-gray-300 bg-black' : 'text-black'}`}>{acc.accountName}</td>
                  <td className={`px-4 py-2 ${isDarkMode ? 'text-gray-300 bg-black' : 'text-black'}`}>{acc.profitPercentage}%</td>
                  <td className={`px-4 py-2 ${isDarkMode ? 'text-gray-300 bg-black' : 'text-black'}`}>{acc.leverage}%</td>
                  <td className={`px-4 py-2 ${isDarkMode ? 'text-gray-300 bg-black' : 'text-black'}`}>
                    {acc.enabled ? "Enabled" : "Disabled"}
                  </td>
                  <td className="px-2 py-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-5 py-1 rounded text-sm"
                      onClick={() => {
                        setSelectedAccount(acc);
                        fetchMamProfitDetails(acc.account_id);
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDepositAccount(acc.account_id || acc.id);
                        setShowDepositModal(true);
                      }}
                      className="bg-yellow-500 text-white px-5 py-1 rounded text-sm"
                    >
                      Deposit
                    </button>


                    <DepositModal
                      showDepositModal={showDepositModal}
                      setShowDepositModal={setShowDepositModal}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      cheeseAmount={cheeseAmount}
                      setCheeseAmount={setCheeseAmount}
                      currency={currency}
                      setCurrency={setCurrency}
                      selectedDepositAccount={selectedDepositAccount}
                    />







                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW ACCOUNT */}
      {selectedAccount && (
        <div className="mt-6 w-full px-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-yellow-400">Account Details</h3>
            <button
              onClick={() => setSelectedAccount(null)}
              className="text-yellow-400 border border-yellow-400 px-4 py-1 rounded hover:bg-yellow-400 hover:text-black transition"
            >
              ← Back
            </button>
          </div>

          <div className="border border-yellow-400 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoBox label="Account ID" value={selectedAccount.account_id} isDarkMode={isDarkMode} />
              <InfoBox label="Account Name" value={selectedAccount.accountName} isDarkMode={isDarkMode} />
              <InfoBox label="Profit Sharing" value={selectedAccount.profitPercentage + "%"} isDarkMode={isDarkMode} />
              <InfoBox label="Total Profit" value={selectedAccount.totalProfit} isDarkMode={isDarkMode} />
              <InfoBox label="Leverage" value={selectedAccount.leverage} isDarkMode={isDarkMode} />
              <InfoBox label="Status" value={selectedAccount.enabled ? "Enabled" : "Disabled"} isDarkMode={isDarkMode} />
            </div>




            {/* ACTION BUTTONS */}

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setSelectedDepositAccount(selectedAccount.account_id); // ✔ FIXED
                  setShowDepositModal(true);
                }}
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-[#FFD700] transition"
              >
                Deposit
              </button>

              <DepositModal
                showDepositModal={showDepositModal}
                setShowDepositModal={setShowDepositModal}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                cheeseAmount={cheeseAmount}
                setCheeseAmount={setCheeseAmount}
                currency={currency}
                setCurrency={setCurrency}
                selectedDepositAccount={selectedDepositAccount}
              />


              <button
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-[#FFD700] transition"
                onClick={() => {
                  setSelectedDepositAccount(selectedAccount.account_id);
                  setShowWithdrawModal(true);
                }}
              >
                Withdraw
              </button>

              <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-[#FFD700] transition"
                onClick={() => setShowTradesModal(true)}>
                Investors
              </button>

              <InvestorManagement
                showTradesModal={showTradesModal}
                setShowTradesModal={setShowTradesModal}
                selectedAccount={selectedAccount}
              />

              <button
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-[#FFD700] transition"
                onClick={() => {
                  setSelectedDepositAccount(selectedAccount.account_id);
                  setShowSettingsModal(true);
                }}
              >
                Settings
              </button>

              <button
                disabled={toggleLoadingIds.includes(selectedAccount.account_id)}
                className={`px-4 py-2 rounded transition text-black ${selectedAccount.enabled ? (toggleLoadingIds.includes(selectedAccount.account_id) ? 'bg-red-300' : 'bg-red-500') : (toggleLoadingIds.includes(selectedAccount.account_id) ? 'bg-yellow-300' : 'bg-yellow-400')} hover:opacity-90`}
                onClick={() => handleToggleStatus(selectedAccount.account_id)}
              >
                {toggleLoadingIds.includes(selectedAccount.account_id) ? (selectedAccount.enabled ? 'Disabling...' : 'Enabling...') : (selectedAccount.enabled ? 'Disable' : 'Enable')}
              </button>
              {toggleError && <div className="text-red-400 mt-2">{toggleError}</div>}
            </div>

          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg w-[90%] max-w-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-yellow-400' : 'text-black'}`}>Create New MAM Account</h2>
              <X
                className={`w-6 h-6 cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-black'}`}
                onClick={() => setShowModal(false)}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Account Name</label>
                <input
                  type="text"
                  id="account_name"
                  value={form.account_name}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-300'}`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Profit Sharing (%)</label>
                <input
                  type="number"
                  id="profit_percentage"
                  value={form.profit_percentage}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-300'}`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Risk Level</label>
                <select
                  id="risk_level"
                  value={form.risk_level}
                  onChange={handleChange}
                  className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-300'}`}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Leverage</label>
                <select
                  id="leverage"
                  value={form.leverage}
                  onChange={handleChange}
                  className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-300'}`}
                >
                  <option>50x</option>
                  <option>100x</option>
                  <option>200x</option>
                  <option>500x</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Payout Frequency</label>
                <select
                  id="payout_frequency"
                  value={form.payout_frequency}
                  onChange={handleChange}
                  className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-300'}`}
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Half-Yearly</option>
                </select>
              </div>

              {/* Master Password */}
<div>
  <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
    <span className="text-red-500">*</span> Master Password
  </label>

  <div className="relative">
    <input
      type={showMasterPwd ? "text" : "password"}
      id="master_password"
      name="master_password"
      value={form.master_password}
      onChange={handleChange}
      placeholder="Auto-generated secure password"
      required
      minLength={8}
      className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} 
      border border-[#FFD700] rounded-md pr-10 focus:ring-2 focus:ring-[#FFD700]`}
    />

    {/* Password Show / Hide */}
    <button
      type="button"
      onClick={() => setShowMasterPwd(!showMasterPwd)}
      className="absolute right-3 top-3 text-[#FFD700] hover:text-white"
      title={showMasterPwd ? "Hide password" : "Show password"}
    >
      {showMasterPwd ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
    The master password allows full control of the trading account.<br />
    Must be at least 8 characters including uppercase, numbers & symbols.
  </p>
</div>

{/* Investor Password */}
<div className="mt-4">
  <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
    <span className="text-red-500">*</span> Investor Password
  </label>

  <div className="relative">
    <input
      type={showInvestorPwd ? "text" : "password"}
      id="investor_password"
      name="investor_password"
      value={form.investor_password}
      onChange={handleChange}
      placeholder="Auto-generated secure password"
      required
      minLength={8}
      className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} 
      border border-[#FFD700] rounded-md pr-10 focus:ring-2 focus:ring-[#FFD700]`}
    />

    {/* Password Show / Hide */}
    <button
      type="button"
      onClick={() => setShowInvestorPwd(!showInvestorPwd)}
      className="absolute right-3 top-3 text-[#FFD700] hover:text-white"
      title={showInvestorPwd ? "Hide password" : "Show password"}
    >
      {showInvestorPwd ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
    The investor password allows read-only access for investors.<br />
    Must be at least 8 characters including uppercase, numbers & symbols.
  </p>
</div>

<div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit" onClick={handleSubmit}
                  className="bg-yellow-500 px-4 py-2 rounded text-black font-semibold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPOSIT MODAL */}
      {showDepositModal && (
        <DepositModal
          onClose={() => setShowDepositModal(false)}
          accountId={selectedDepositAccount}
        />
      )}

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <Withdraw
          onClose={() => setShowWithdrawModal(false)}
          currentAccount={selectedAccount}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <SettingsModal
          showSettingsModal={showSettingsModal}
          setShowSettingsModal={setShowSettingsModal}
          selectedAccount={selectedAccount}
          newLeverage={newLeverage}
          setNewLeverage={setNewLeverage}
          selectedPasswordType={selectedPasswordType}
          setSelectedPasswordType={setSelectedPasswordType}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPasswords={showPasswords}
          setShowPasswords={setShowPasswords}
        />
      )}
    </div>
  );
}
