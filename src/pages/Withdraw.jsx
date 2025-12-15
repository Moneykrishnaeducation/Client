import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { ModalWrapper } from "./Dashboard";
import { apiCall } from "../utils/api";
import { sharedUtils } from "../utils/shared-utils";

const Withdraw = ({ onClose, currentAccount }) => {
  const { isDarkMode } = useTheme();
  const [selectedAccount, setSelectedAccount] = useState(currentAccount ? currentAccount.account_id : "");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [activeTab, setActiveTab] = useState("bank");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState(currentAccount ? [currentAccount] : []);
  const [withdrawalInfo, setWithdrawalInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [cryptoDetails, setCryptoDetails] = useState(null);

  // Sync internal state when currentAccount prop changes and fetch withdrawal info
  useEffect(() => {
    if (currentAccount) {
      setSelectedAccount(currentAccount.account_id);
      setAvailableBalance(currentAccount.balance || 0);
      setAccounts([currentAccount]);
      setLoading(true);

      const fetchWithdrawalInfo = async () => {
        try {
          const result = await apiCall(`api/withdrawal/info/${currentAccount.account_id}/`);
          if (result.success && result.data) {
            setWithdrawalInfo(result.data);
            if (result.data.available_methods?.length > 0) {
              setActiveTab(result.data.available_methods[0]);
            }
          } else {
            setError(result.error || "Failed to load withdrawal details");
          }
        } catch (err) {
          console.error("Withdrawal info error:", err);
          setError(err.message || "Failed to load withdrawal information");
        } finally {
          setLoading(false);
        }
      };

      fetchWithdrawalInfo();
    }
  }, [currentAccount]);

  // Fetch accounts and details when no currentAccount is provided
  useEffect(() => {
    if (currentAccount) return;

    const fetchAccounts = async () => {
      try {
        const data = await apiCall('api/user-trading-accounts/');
        setAccounts((data.accounts || []).filter(acc => acc.account_type === "standard"));
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
        setAccounts([]);
      }
    };

    fetchAccounts();
  }, [currentAccount]);

  // Fetch bank/crypto details based on activeTab
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (activeTab === "bank") {
          const data = await apiCall('client/api/profile/bank-details/');
          setBankDetails(data || null);
        } else {
          const data = await apiCall('client/api/profile/crypto-details/');
          setCryptoDetails(data || null);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab} details:`, err);
        if (activeTab === "bank") {
          setBankDetails(null);
        } else {
          setCryptoDetails(null);
        }
      }
    };

    fetchDetails();
  }, [activeTab]);

  // ======================
  // 1. Account Change → Load Withdrawal Info
  // ======================
  const handleAccountChange = async (e) => {
    const accId = e.target.value;
    setSelectedAccount(accId);
    setAmount("");
    setError("");
    setWithdrawalInfo(null);

    // Update balance from local account list (instant feedback)
    const selectedAcc = accounts.find(acc => acc.account_id === accId);
    setAvailableBalance(selectedAcc ? selectedAcc.balance || 0 : 0);

    if (!accId) return;

    setLoading(true);
    try {
      const result = await apiCall(`api/withdrawal/info/${accId}/`);

      if (result.success && result.data) {
        setWithdrawalInfo(result.data);

        // Auto-select first available method
        if (result.data.available_methods?.length > 0) {
          setActiveTab(result.data.available_methods[0]);
        }
      } else {
        setError(result.error || "Failed to load withdrawal details");
      }
    } catch (err) {
      console.error("Withdrawal info error:", err);
      setError(err.message || "Failed to load withdrawal information");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 2. Submit Withdrawal Request
  // ======================
  const handleWithdraw = async () => {
    if (!selectedAccount) {
      setError("Please select an account.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (parseFloat(amount) > availableBalance) {
      setError("Amount exceeds available balance.");
      return;
    }
    if (!withdrawalInfo || !withdrawalInfo.available_methods.includes(activeTab)) {
      setError(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} withdrawal not available.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        account_id: selectedAccount,
        amount: parseFloat(amount),
        method: activeTab,
        description: `Withdrawal via ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`,
      };

      const result = await apiCall('api/withdrawal/request/', 'POST', payload);

      if (result.success) {
        sharedUtils.showToast(`Withdrawal request submitted! ID: ${result.data?.transaction_id || 'N/A'}`);
        onClose();
      } else {
        setError(result.error || "Submission failed");
      }
    } catch (err) {
      console.error("Withdrawal submission error:", err);
      setError(err.message || "Failed to submit withdrawal request");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ModalWrapper title="💸 Withdraw Funds" onClose={onClose} isDarkMode={isDarkMode}>
      <div className="space-y-5">
        {/* Error Message */}
        {error && (
          <div className="bg-red-800 text-red-400 p-2 rounded-md text-sm font-medium shadow-md">
            {error}
          </div>
        )}

        {/* Account Display or Selection */}
        <div>
          <label className={`block text-sm mb-1 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Account ID</label>
          {currentAccount ? (
            <input
              type="text"
              value={currentAccount.account_id || currentAccount.id}
              readOnly
              className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border-2 border-yellow-500 cursor-not-allowed`}
            />
          ) : (
            <select
              value={selectedAccount}
              onChange={handleAccountChange}
              disabled={loading}
              className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border-2 border-yellow-500 focus:ring-2 focus:ring-yellow-400 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">-- Select Account --</option>
              {accounts.map((acc) => (
                <option key={acc.account_id} value={acc.account_id}>
                  {acc.account_id} (trading -Balance ({acc.balance}))
                </option>
              ))}
            </select>
          )}
          {loading && <div className="text-yellow-400 text-sm mt-1">Loading withdrawal info...</div>}
        </div>

        {/* Available Balance */}
        <div>
          <label className={`block text-sm mb-1 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Available Balance</label>
          <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black font-bold text-lg shadow-md">
            ${availableBalance}
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-lg overflow-hidden border border-yellow-500">
          <div className="flex">
            <button
              className={`flex-1 py-2 font-semibold transition-all ${activeTab === "bank"
                  ? "bg-yellow-500 text-black shadow-md"
                  : isDarkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              onClick={() => {
                setActiveTab("bank");
              }}
            >
              Bank Transfer
            </button>
            <button
              className={`flex-1 py-2 font-semibold transition-all ${activeTab === "crypto"
                  ? "bg-yellow-500 text-black shadow-md"
                  : isDarkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              onClick={() => {
                setActiveTab("crypto");
              }}
            >
              Crypto Wallet
            </button>
          </div>

          <div className={`p-4 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'} space-y-2`}>
            {activeTab === "bank" ? (
              <div className="space-y-1">
                <strong className="text-yellow-400 block">Bank Transfer</strong>
                <div>Bank Name: <span className={isDarkMode ? 'text-white' : 'text-black'}>{bankDetails?.bank_name || 'Not Found'}</span></div>
                <div>Account Number: <span className={isDarkMode ? 'text-white' : 'text-black'}>{bankDetails?.account_number || 'Not Found'}</span></div>
                <div>Branch: <span className={isDarkMode ? 'text-white' : 'text-black'}>{bankDetails?.branch_name || 'Not Found'}</span></div>
                <div>IFSC Code: <span className={isDarkMode ? 'text-white' : 'text-black'}>{bankDetails?.ifsc_code || 'Not Found'}</span></div>
              </div>
            ) : (
              <div className="space-y-1">
                <strong className="text-yellow-400 block">Crypto Wallet</strong>
                <div>Wallet Address: <span className={isDarkMode ? 'text-white' : 'text-black'}>{cryptoDetails?.wallet_address || 'Not Found'}</span></div>
                <div>Currency: <span className={isDarkMode ? 'text-white' : 'text-black'}>{cryptoDetails?.currency || 'Not Found'}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className={`block text-sm mb-1 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Withdrawal Amount</label>
          <input
            type="number"
            placeholder={`Min: $${withdrawalInfo?.minimum_withdrawal || 10}, Max: $${availableBalance}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={withdrawalInfo?.minimum_withdrawal || 10}
            max={availableBalance}
            step="0.01"
            className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border-2 border-yellow-500 focus:ring-2 focus:ring-yellow-400 transition-all shadow-inner`}
          />
          {withdrawalInfo && (
            <div className="text-xs text-gray-500 mt-1">
              Minimum withdrawal: ${withdrawalInfo.minimum_withdrawal || 10} | Fee: ${withdrawalInfo.withdrawal_fee || 0}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className={`flex-1 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-black hover:bg-gray-400'} font-semibold shadow-md transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Close
          </button>
          <button
            onClick={handleWithdraw}
            disabled={loading || !selectedAccount || !withdrawalInfo}
            className={`flex-1 py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 shadow-md transition-all ${(loading || !selectedAccount || !withdrawalInfo) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Withdraw'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default Withdraw;
