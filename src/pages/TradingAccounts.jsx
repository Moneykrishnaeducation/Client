import React, { useEffect, useState, useMemo } from "react";
import OpenAccount from "./OpenAccount";
import DemoAccountList from "./DemoAccountsPage";
import Withdraw from "./Withdraw";
import DepositModal from "./DepositModal";
import TradesModal from "./TradesModal";
import SettingsModal from "./SettingsModal";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { apiCall, getAuthHeaders, getCookie, handleUnauthorized, API_BASE_URL } from "../utils/api";

export default function TradingAccounts({ showDepositModal, setShowDepositModal }) {
  const { isDarkMode } = useTheme();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("cheesepay");
  const [cheeseAmount, setCheeseAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [selectedDepositAccount, setSelectedDepositAccount] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");
  const [activeComponent, setActiveComponent] = useState(null);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [transferMessage, setTransferMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTradesModal, setShowTradesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newLeverage, setNewLeverage] = useState("");
  const [selectedPasswordType, setSelectedPasswordType] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const selectedFromAccount = useMemo(() => {
    return accounts.find(acc => acc.account_id === fromAccount);
  }, [accounts, fromAccount]);

  const selectedToAccount = useMemo(() => {
    return accounts.find(acc => acc.account_id === toAccount);
  }, [accounts, toAccount]);

  const closeComponent = () => {
    setActiveComponent(null);
    setTransferMessage("");
  };

  const refreshAccounts = async () => {
    try {
      const data = await apiCall('/api/user-trading-accounts/');
      setAccounts((data.accounts || []).filter(acc => acc.account_type === "standard"));
    } catch (error) {
      console.error('Failed to refresh accounts:', error);
    }
  };

  // Make refreshAccounts available globally for OpenAccount component
  useEffect(() => {
    window.refreshAccounts = refreshAccounts;
    return () => {
      delete window.refreshAccounts;
    };
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await apiCall('/api/user-trading-accounts/');
        setAccounts((data.accounts || []).filter(acc => acc.account_type === "standard"));
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (fromAccount === toAccount) {
      setTransferMessage("You cannot transfer between the same account.");
      setIsSubmitting(false);
      return;
    }

    if (insufficientBalance) {
      setTransferMessage("Insufficient balance.");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = `api/internal-transfer/`.startsWith('http') ? `api/internal-transfer/` : `${API_BASE_URL}api/internal-transfer/`;
      const headers = { ...getAuthHeaders() };
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }
      const config = {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from_account_id: fromAccount,
          to_account_id: toAccount,
          amount: parseFloat(amount)
        }),
        credentials: 'include'
      };

      const response = await fetch(url, config);
      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        throw new Error('Unauthorized access');
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      await response.json(); // Assuming it returns JSON, but not used here

      setTransferMessage("Transfer successful ✅");
      // Refresh accounts after successful transfer
      await refreshAccounts();
      setAmount("");
      setFromAccount("");
      setToAccount("");
    } catch (error) {
      console.error('Transfer failed:', error);
      setTransferMessage("Transfer failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fromAcc = accounts.find((acc) => acc.account_id === fromAccount);
    if (fromAcc && amount && Number(amount) > fromAcc.balance) {
      setInsufficientBalance(true);
    } else {
      setInsufficientBalance(false);
    }
  }, [fromAccount, amount, accounts]);

  // Auto convert USD → INR (mock rate 1 USD = 83.25 INR)
  useEffect(() => {
    if (cheeseAmount) {
      if (currency === "USD") {
        setConvertedAmount((cheeseAmount * 83.25).toFixed(2)); // USD → INR
      } else if (currency === "INR") {
        setConvertedAmount((cheeseAmount / 83.25).toFixed(2)); // INR → USD
      }
    } else {
      setConvertedAmount("");
    }
  }, [cheeseAmount, currency]);

  const Modal = ({ title, onClose, children }) => (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/25' : 'bg-white/70'} flex items-center justify-center z-50`}>
      <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg w-[90%] max-w-lg relative`}>
        <h3 className="text-lg font-semibold mb-3 text-[#FFD700] text-center">
          {title}
        </h3>
        <div className="max-h-[80vh] overflow-y-auto">{children}</div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded font-semibold text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-[90vh] ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} font-sans  flex flex-col items-center`}>
      {/* Header */}
      <header className={`w-full ${isDarkMode ? 'bg-black' : 'bg-white'} mt-6`}>
        <div className="max-w-[1100px] mx-auto flex flex-wrap gap-3 justify-around items-center px-4">
          <button
            className="bg-gold  w-80 text-black px-4 py-2 rounded hover:bg-white transition"
            onClick={() => setActiveComponent("openAccount")}
          >
            Open Account
          </button>

          <button
            className="bg-gold  w-80 text-black px-4 py-2 rounded hover:bg-white transition"
            onClick={() => setActiveComponent("internalTransaction")}
          >
            Internal Transaction
          </button>

          <button
            className="bg-gold w-80 text-black px-4 py-2 rounded hover:bg-white transition"
            onClick={() => navigate("/demoAccounts")}
          >
            Explore Demo
          </button>

          {/* Conditional rendering for each component */}
          {activeComponent === "openAccount" && (
            <Modal title="Open Account" onClose={closeComponent}>
              <OpenAccount onClose={closeComponent} />
            </Modal>
          )}

          {/* =======================
           INTERNAL TRANSFER SECTION
         ======================= */}
          {/* Internal Transaction Modal */}
          {activeComponent === "internalTransaction" && (
            <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? 'bg-black/70' : 'bg-white/70'} z-50`}>
  <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} p-0 rounded-xl w-full max-w-lg relative shadow-2xl border border-gold overflow-hidden`}>

    {/* Close Button */}
    <button
      onClick={closeComponent}
      className={`absolute top-4 right-4 ${isDarkMode ? 'text-white hover:text-gold' : 'text-black hover:text-gold'} text-3xl font-bold z-20`}
    >
      &times;
    </button>

    {/* Title */}
    <div className="py-6 px-8 border-b border-gold">
      <h2 className="text-3xl font-semibold text-center text-gold tracking-wide">
        Internal Transfer
      </h2>
      <p className="text-center mt-2 text-sm opacity-80">
        Send funds between your accounts quickly and securely.
      </p>
    </div>

    {/* Form Body */}
    <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">

      {/* From Account */}
      <div className="bg-black/10 p-4 rounded-lg border border-gold shadow-md">
        <label className="block mb-2 font-semibold text-gold text-lg">
          From Account <span className="text-red-500">*</span>
        </label>

        <select
          value={fromAccount}
          onChange={(e) => setFromAccount(e.target.value)}
          required
          className={`w-full rounded-md px-3 py-2 border border-gold focus:ring-2 focus:ring-gold ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          <option value="" disabled>Select Account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.account_id}>
              {acc.group_alias} (${acc.balance})
            </option>
          ))}
        </select>

        {/* Balance text */}
        <p className="mt-2 text-sm opacity-80">
          Balance: <span className=" font-semibold">${selectedFromAccount?.balance || 0}</span>
        </p>
      </div>

      {/* To Account */}
      <div className="bg-black/10 p-4 rounded-lg border border-gold shadow-md">
        <label className="block mb-2 font-semibold text-gold text-lg">
          To Account <span className="text-red-500">*</span>
        </label>

        <select
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          required
          className={`w-full rounded-md px-3 py-2 border border-gold focus:ring-2 focus:ring-gold ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          <option value="" disabled>Select Account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.account_id}>
              {acc.group_alias} (${acc.balance})
            </option>
          ))}
        </select>

        {/* Balance text */}
        <p className="mt-2 text-sm opacity-80">
          Balance: <span className=" font-semibold">${selectedToAccount?.balance || 0}</span>
        </p>
      </div>

      {/* Amount */}
      <div className="bg-black/10 p-4 rounded-lg border border-gold shadow-md">
        <label className="block mb-2 font-semibold text-gold text-lg">
          Amount (INR) <span className="text-red-500">*</span>
        </label>

        <div className="flex items-center border border-gold rounded-md px-3 py-2 bg-black/20">
          <span className="text-gold mr-2 font-bold text-lg">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="0.00"
            className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-white' : 'text-black'}`}
          />
        </div>

        {insufficientBalance && (
          <p className="text-red-500 text-sm mt-1">
            Insufficient balance in the selected account.
          </p>
        )}
      </div>

      {/* Transfer Status */}
      {transferMessage && (
        <div className="text-center font-medium text-gold text-sm bg-black/20 p-3 rounded-md border border-gold">
          {transferMessage}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={closeComponent}
          className={`px-5 py-2 rounded-md ${isDarkMode ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-gray-300 text-black hover:bg-gray-400'} font-semibold`}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!fromAccount || !toAccount || !amount || isSubmitting}
          className={`px-5 py-2 rounded-md font-semibold transition ${
            isSubmitting || !fromAccount || !toAccount || !amount
              ? "bg-gray-600 text-black cursor-not-allowed"
              : "bg-gold text-black hover:bg-white hover:text-gold"
          }`}
        >
          {isSubmitting ? "Processing..." : "Transfer"}
        </button>
      </div>
    </form>
  </div>
</div>

          )}

          {activeComponent === "exploreDemo" && (
            <Modal title="Explore Demo" onClose={closeComponent}>
              <DemoAccountList isOpen={true} onClose={closeComponent} />
            </Modal>
          )}
        </div>
      </header>

      <main className="flex-1 w-full flex justify-center">
        <div className="w-full p-6">
          {/* Account Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gold mb-4">
              Account Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`${isDarkMode ? 'bg-[#111]' : 'bg-gray-100'} border border-gold rounded-lg p-4 text-center`}>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Total Balance</p>
                <p className="text-2xl font-bold text-gold">
                  ${accounts.reduce((total, acc) => total + (parseFloat(acc.balance) || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className={`${isDarkMode ? 'bg-[#111]' : 'bg-gray-100'} border border-gold rounded-lg p-4 text-center`}>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Total Equity</p>
                <p className="text-2xl font-bold text-gold">
                  ${accounts.reduce((total, acc) => total + (parseFloat(acc.equity) || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className={`${isDarkMode ? 'bg-[#111]' : 'bg-gray-100'} border border-gold rounded-lg p-4 text-center`}>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Total Accounts</p>
                <p className="text-2xl font-bold text-gold">{accounts.length}</p>
              </div>
            </div>
          </div>

          {/* Account Table */}
          {!selectedAccount && (
            <div>
              <h3 className="text-lg font-semibold text-gold mb-3">
                Active Accounts
              </h3>
              <div className="overflow-x-auto">
                <table className={`min-w-full border-collapse text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <thead>
                    <tr className={`${isDarkMode ? 'bg-[#111] text-gold' : 'bg-gray-200 text-black'} border-b ${isDarkMode ? 'border-gold' : 'border-gray-300'}`}>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Login</th>
                      <th className="p-3 text-left">Leverage</th>
                      <th className="p-3 text-left">Balance</th>
                      <th className="p-3 text-left">Equity</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => (
                      <tr
                        key={acc.account_id}
                        className={`border-b ${isDarkMode ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-gray-300 hover:bg-gray-100'} transition`}
                      >
                        <td className="p-3">{acc.group_alias}</td>
                        <td className="p-3">{acc.account_id}</td>
                        <td className="p-3">{acc.leverage}</td>
                        <td className="p-3">${acc.balance}</td>
                        <td className="p-3">${acc.equity}</td>
                        <td className="p-3 text-center flex gap-3 justify-center">
                          <button
                            key="view-button"
                            onClick={() => setSelectedAccount(acc)}
                            className="bg-gold text-black px-3 py-1 rounded hover:bg-white transition"
                          >
                            View
                          </button>
                          <button
                            key="deposit-button"
                            onClick={() => {
                              setShowDepositModal(true);
                              setActiveTab("cheesepay");
                              setSelectedDepositAccount(acc.account_id);
                            }}
                            className="bg-gold text-black px-3 py-1 rounded hover:bg-white transition"
                          >
                            Deposit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Selected Account View */}
          {selectedAccount && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gold">
                  Account Details
                </h3>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-gold border border-gold px-4 py-1 rounded hover:bg-gold hover:text-black transition text-sm"
                >
                  ← Back
                </button>
              </div>

              <div className={`${isDarkMode ? 'bg-[#111]' : 'bg-gray-100'} border border-gold rounded-lg p-2 space-y-4`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Info key="account-type" label="Account Type" value={selectedAccount.group_alias} isDarkMode={isDarkMode} />
                  <Info key="platform-login" label="Platform Login" value={selectedAccount.account_id} isDarkMode={isDarkMode} />
                  <Info key="leverage" label="Leverage" value={selectedAccount.leverage} isDarkMode={isDarkMode} />
                  <Info key="balance" label="Balance" value={`$${selectedAccount.balance}`} isDarkMode={isDarkMode} />
                  <Info key="equity" label="Equity" value={`$${selectedAccount.equity}`} isDarkMode={isDarkMode} />
                  <Info key="margin-level" label="Margin level" value={`${selectedAccount.margin}%`} isDarkMode={isDarkMode} />
                  <Info key="free-margin" label="Free Margin" value={`$${selectedAccount.free_margin}`} isDarkMode={isDarkMode} />
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <button
                    className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition"
                    onClick={() => {
                      setShowDepositModal(true);
                      setActiveTab("cheesepay");
                      setSelectedDepositAccount(selectedAccount.account_id);
                    }}
                  >
                    Deposit
                  </button>
                  <button
                    className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition"
                    onClick={() => setShowWithdrawModal(true)}
                  >
                    Withdraw
                  </button>
                  <button
                    className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition"
                    onClick={() => setShowTradesModal(true)}
                  >
                    Trades
                  </button>
                  <button
                    className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition"
                    onClick={() => setShowSettingsModal(true)}
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          <DepositModal
            showDepositModal={showDepositModal}
            setShowDepositModal={setShowDepositModal}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cheeseAmount={cheeseAmount}
            setCheeseAmount={setCheeseAmount}
            currency={currency}
            setCurrency={setCurrency}
            convertedAmount={convertedAmount}
            selectedDepositAccount={selectedDepositAccount}
            usdtAmount={usdtAmount}
            setUsdtAmount={setUsdtAmount}
          />

          {/* Withdraw Modal */}
          {showWithdrawModal && (
            <Withdraw
              onClose={() => setShowWithdrawModal(false)}
              currentAccount={selectedAccount}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          <TradesModal
            showTradesModal={showTradesModal}
            setShowTradesModal={setShowTradesModal}
            selectedAccount={selectedAccount}
          />

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
        </div>
      </main>

      <style>{`
        .text-gold { color: #FFD700; }
        .border-gold { border-color: #FFD700; }
        .bg-gold { background-color: #FFD700; }
      `}</style>
    </div>
  );
}

function Info({ label, value, isDarkMode }) {
  return (
    <div className={`p-3 ${isDarkMode ? 'bg-black border-[#333]' : 'bg-white border-gray-300'} border rounded-lg`}>
      <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
      <p className="text-gold text-base font-semibold">{value}</p>
    </div>
  );
}
