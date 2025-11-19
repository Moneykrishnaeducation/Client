import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { apiCall } from "../utils/api";
import {
  X,
  CheckCircle,
  DollarSign,
  Scale,
  Plus,
  Minus,
  RefreshCw,
  AlertCircle,
  Check,
} from "lucide-react";

export default function DemoAccountsPage() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Store created demo accounts
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({}); // Track which accounts are being updated

  // 🔹 Track selected account for View modal
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  // 🔹 Notification state
  const [notification, setNotification] = useState(null);

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

  // 🔹 Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // 🔹 Fetch demo accounts on component mount
  useEffect(() => {
    const fetchDemoAccounts = async () => {
      try {
        const data = await apiCall('api/user-demo-accounts/', { method: 'GET' });
        setDemoAccounts(data.map(acc => ({
          id: acc.account_id,
          balance: acc.balance,
          leverage: acc.leverage + 'x', // Add 'x' suffix for display
          holder_name: acc.holder_name,
          email: acc.email,
          phone: acc.phone,
          created_at: acc.created_at,
          is_enabled: acc.is_enabled,
          is_algo_enabled: acc.is_algo_enabled,
        })));
      } catch (error) {
        console.error('Error fetching demo accounts:', error);
        showNotification('Error loading demo accounts', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDemoAccounts();
  }, []);

  // 🔹 Create new demo account
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await apiCall('api/create-demo-account/', {
        method: 'POST',
        body: JSON.stringify({
          balance: formData.balance || '10000',
          leverage: formData.leverage.replace('x', ''), // Remove 'x' suffix
          masterPassword: formData.masterPassword,
          investorPassword: formData.investorPassword,
        }),
      });

      showNotification(data.message || "Demo Account Created Successfully!");

      // Add the new account to the list
      const newAccount = {
        id: data.account_id,
        balance: Number(data.balance),
        leverage: data.leverage + 'x', // Add 'x' suffix for display
        holder_name: data.holder_name || '',
        email: data.email || '',
        phone: data.phone || '',
        created_at: new Date().toISOString(),
        is_enabled: true,
        is_algo_enabled: false,
      };
      setDemoAccounts((prev) => [...prev, newAccount]);

      setIsOpen(false);
      setFormData({
        balance: "",
        leverage: "500x",
        masterPassword: "",
        investorPassword: "",
      });
    } catch (error) {
      console.error('Error creating demo account:', error);
      showNotification('Failed to create demo account. Please try again.', 'error');
    }
  };

  // 🔹 Update balance using + or -
  const updateBalance = async (accountId, type) => {
    const account = demoAccounts.find(acc => acc.id === accountId);
    if (!account) return;

    const currentBalance = account.balance;
    let newBalance;

    if (type === "add") {
      newBalance = currentBalance + 1000; // Add $1000
    } else if (type === "subtract") {
      newBalance = Math.max(0, currentBalance - 1000); // Subtract $1000, minimum 0
    } else {
      return;
    }

    // Optimistically update UI
    setDemoAccounts(prev =>
      prev.map(acc =>
        acc.id === accountId ? { ...acc, balance: newBalance } : acc
      )
    );

    // Call API to update
    await updateAccount(accountId, { balance: newBalance });
  };

  // 🔹 Update leverage
  const updateLeverage = async (accountId, newLeverage) => {
    // Optimistically update UI
    setDemoAccounts(prev =>
      prev.map(acc => (acc.id === accountId ? { ...acc, leverage: newLeverage } : acc))
    );

    // Call API to update
    await updateAccount(accountId, { leverage: newLeverage.replace('x', '') });
  };

  // 🔹 Reset balance to default
  const resetBalance = async (accountId) => {
    setUpdating(prev => ({ ...prev, [accountId]: true }));

    try {
      const data = await apiCall(`api/reset-demo-balance/${accountId}/`, {
        method: 'POST',
        body: JSON.stringify({
          balance: '10000' // Reset to $10,000
        }),
      });

      // Update local state
      setDemoAccounts(prev =>
        prev.map(acc =>
          acc.id === accountId ? { ...acc, balance: Number(data.balance) } : acc
        )
      );
      showNotification('Balance reset successfully!');
    } catch (error) {
      console.error('Error resetting balance:', error);
      showNotification('Failed to reset balance. Please try again.', 'error');
      // Revert optimistic update
      await fetchDemoAccounts();
    } finally {
      setUpdating(prev => ({ ...prev, [accountId]: false }));
    }
  };

  // 🔹 Change leverage via API
  const changeLeverage = async (accountId, newLeverage) => {
    setUpdating(prev => ({ ...prev, [accountId]: true }));

    try {
      const data = await apiCall(`api/change-demo-leverage/${accountId}/`, {
        method: 'POST',
        body: JSON.stringify({
          leverage: newLeverage.replace('x', '')
        }),
      });

      // Update local state
      setDemoAccounts(prev =>
        prev.map(acc =>
          acc.id === accountId ? { ...acc, leverage: newLeverage } : acc
        )
      );
      showNotification('Leverage updated successfully!');
    } catch (error) {
      console.error('Error updating leverage:', error);
      showNotification('Failed to update leverage. Please try again.', 'error');
      // Revert optimistic update
      await fetchDemoAccounts();
    } finally {
      setUpdating(prev => ({ ...prev, [accountId]: false }));
    }
  };

  // 🔹 Generic update account function
  const updateAccount = async (accountId, updates) => {
    setUpdating(prev => ({ ...prev, [accountId]: true }));

    try {
      const data = await apiCall('api/update-demo-account/', {
        method: 'POST',
        body: JSON.stringify({
          account_id: accountId,
          ...updates
        }),
      });

      showNotification(data.message || 'Account updated successfully!');
    } catch (error) {
      console.error('Error updating account:', error);
      showNotification('Failed to update account. Please try again.', 'error');
      // Revert optimistic update
      await fetchDemoAccounts();
    } finally {
      setUpdating(prev => ({ ...prev, [accountId]: false }));
    }
  };

  // 🔹 Helper function to refetch accounts
  const fetchDemoAccounts = async () => {
    try {
      const data = await apiCall('api/user-demo-accounts/', { method: 'GET' });
      setDemoAccounts(data.map(acc => ({
        id: acc.account_id,
        balance: acc.balance,
        leverage: acc.leverage + 'x',
        holder_name: acc.holder_name,
        email: acc.email,
        phone: acc.phone,
        created_at: acc.created_at,
        is_enabled: acc.is_enabled,
        is_algo_enabled: acc.is_algo_enabled,
      })));
    } catch (error) {
      console.error('Error refetching demo accounts:', error);
    }
  };

  return (
    <div className={`min-h-[90vh] ${isDarkMode ? 'bg-gradient-to-br from-black via-neutral-900 to-black text-white' : 'bg-gradient-to-br from-white via-gray-100 to-gray-200 text-black'} font-sans flex flex-col items-center py-10`}>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-2 hover:opacity-70"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Buttons */}
      <div className="w-full max-w-5xl flex justify-between items-center px-6 mb-8">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-b from-yellow-400 to-yellow-600 text-black font-semibold px-5 py-2 rounded-md shadow-md hover:opacity-90 transition"
        >
          Open New Demo Account
        </button>

        <button
          onClick={() => navigate("/tradingAccounts/")}
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
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            <p>Loading demo accounts...</p>
          </div>
        ) : demoAccounts.length > 0 ? (
          <div className="overflow-x-auto px-10">
            <table className={`min-w-full ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg text-sm`}>
              <thead className={`${isDarkMode ? 'bg-neutral-800' : 'bg-gray-100'} text-yellow-400`}>
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
                    className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} ${isDarkMode ? 'hover:bg-neutral-800/60' : 'hover:bg-gray-50'} transition ${
                      selectedAccountId === acc.id
                        ? `${isDarkMode ? 'bg-neutral-800/80' : 'bg-gray-100'} border-yellow-400`
                        : ""
                    }`}
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 text-yellow-400">{acc.id}</td>

                    {/* Editable Balance */}
                    <td className="py-3 px-4 flex items-center gap-2">
                      <button
                        onClick={() => updateBalance(acc.id, "subtract")}
                        disabled={updating[acc.id]}
                        className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} px-2 py-1 rounded disabled:opacity-50`}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        value={acc.balance}
                        readOnly
                        className={`w-24 text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded py-1`}
                      />
                      <button
                        onClick={() => updateBalance(acc.id, "add")}
                        disabled={updating[acc.id]}
                        className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} px-2 py-1 rounded disabled:opacity-50`}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => resetBalance(acc.id)}
                        disabled={updating[acc.id]}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs ml-1 disabled:opacity-50"
                        title="Reset to $10,000"
                      >
                        <RefreshCw size={12} className={updating[acc.id] ? 'animate-spin' : ''} />
                      </button>
                    </td>

                    {/* Editable Leverage */}
                    <td className="py-3 px-4">
                      <select
                        value={acc.leverage}
                        onChange={(e) => updateLeverage(acc.id, e.target.value)}
                        disabled={updating[acc.id]}
                        className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} px-2 py-1 rounded text-sm focus:outline-none ${isDarkMode ? '' : 'text-black'} disabled:opacity-50`}
                      >
                        {["1x", "2x", "5x", "10x", "20x", "50x", "100x", "200x", "500x", "1000x"].map(
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
                        className={`${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400 text-black'} px-3 py-1 rounded text-sm`}
                      >
                        View
                      </button>
                      <button
                        onClick={() => updateAccount(acc.id, {})}
                        disabled={updating[acc.id]}
                        className="bg-yellow-400 text-black hover:bg-yellow-300 px-3 py-1 rounded text-sm font-semibold disabled:opacity-50"
                      >
                        {updating[acc.id] ? <RefreshCw size={14} className="animate-spin inline" /> : 'Update'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-6`}>
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
          <div className={`${isDarkMode ? 'bg-[#1f1f1f]' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-md ${isDarkMode ? 'text-white' : 'text-black'} relative`}>
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
                      <span className="text-gray-400">Holder Name:</span> {acc.holder_name}
                    </p>
                    <p className="mb-1">
                      <span className="text-gray-400">Email:</span> {acc.email}
                    </p>
                    <p className="mb-1">
                      <span className="text-gray-400">Phone:</span> {acc.phone}
                    </p>
                    <p className="mb-1">
                      <span className="text-gray-400">Balance:</span> ${acc.balance}
                    </p>
                    <p className="mb-1">
                      <span className="text-gray-400">Leverage:</span> {acc.leverage}
                    </p>
                    <p className="mb-1">
                      <span className="text-gray-400">Created At:</span> {new Date(acc.created_at).toLocaleString()}
                    </p>
                    <p className="mb-1">
                      <span className="text-gray-400">Enabled:</span> {acc.is_enabled ? 'Yes' : 'No'}
                    </p>
                    <p className="mb-1">
                      <span className="text-gray-400">Algo Enabled:</span> {acc.is_algo_enabled ? 'Yes' : 'No'}
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
          <div className={`${isDarkMode ? 'bg-[#1f1f1f]' : 'bg-white'} relative rounded-lg shadow-lg p-6 w-full max-w-md ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold mb-1 text-yellow-400">
              Create Demo Account
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
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
                  className={`w-full px-3 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded focus:outline-none ${isDarkMode ? '' : 'text-black'}`}
                />
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
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
                  className={`w-full px-3 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded focus:outline-none ${isDarkMode ? '' : 'text-black'}`}
                >
                  {["1x", "2x", "5x", "10x", "20x", "50x", "100x", "200x", "500x", "1000x"].map((lev) => (
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
                  className={`w-full px-3 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded focus:outline-none ${isDarkMode ? '' : 'text-black'}`}
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
                  className={`w-full px-3 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded focus:outline-none ${isDarkMode ? '' : 'text-black'}`}
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`${isDarkMode ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400 text-black'} px-4 py-2 rounded`}
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
