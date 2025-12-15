import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getAuthHeaders, getCookie, handleUnauthorized, API_BASE_URL, apiCall } from "../utils/api";
import { sharedUtils } from "../utils/shared-utils";

export default function SettingsModal({
  showSettingsModal,
  setShowSettingsModal,
  selectedAccount,
  newLeverage,
  setNewLeverage,
  selectedPasswordType,
  setSelectedPasswordType,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPasswords,
  setShowPasswords,
}) {
  const { isDarkMode } = useTheme();
  const [accountDetails, setAccountDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingLeverage, setUpdatingLeverage] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showSettingsModal && selectedAccount) {
      fetchAccountDetails();
    }
  }, [showSettingsModal, selectedAccount]);

  const fetchAccountDetails = async () => {
    setLoadingDetails(true);
    setError("");
    try {
      const data = await apiCall(`api/account-details/${selectedAccount.account_id}/`);
      setAccountDetails(data);
    } catch (err) {
      console.error('Error fetching account details:', err);
      setError('Failed to load account details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateLeverage = async () => {
    if (!newLeverage) return;
    setUpdatingLeverage(true);
    setError("");
    try {
      const leverageValue = parseInt(newLeverage.split(':')[1]);
      if (isNaN(leverageValue)) {
        setError('Invalid leverage value selected');
        return;
      }
      await apiCall(`api/update-leverage/${selectedAccount.account_id}/`, {
        method: 'POST',
        body: JSON.stringify({ leverage: leverageValue })
      });
      sharedUtils.showToast('Leverage updated successfully');
      setNewLeverage("");
      fetchAccountDetails(); // Refresh details
    } catch (err) {
      console.error('Error updating leverage:', err);
      setError('Failed to update leverage');
    } finally {
      setUpdatingLeverage(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
      }
      return;
    }
    setUpdatingPassword(true);
    setError("");
    try {
      const url = `api/update-password/${selectedAccount.account_id}/`.startsWith('http') ? `api/update-password/${selectedAccount.account_id}/` : `${API_BASE_URL}api/update-password/${selectedAccount.account_id}/`;
      const headers = { ...getAuthHeaders() };
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }
      const config = {
        method: 'POST',
        headers,
        body: JSON.stringify({
          password_type: selectedPasswordType,
          new_password: newPassword
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
      sharedUtils.showToast('Password updated successfully');
      setNewPassword("");
      setConfirmPassword("");
      setSelectedPasswordType("");
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };
  return (
    <>
      {showSettingsModal && (
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/50' : 'bg-white/70'} flex items-center justify-center z-50`}>
          <div className={`${isDarkMode ? 'bg-[#111]' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-black'} p-6 rounded-lg w-full max-w-md relative shadow-xl border-2 border-[#FFD700]`}>
            {/* Close Button */}
            <button
              onClick={() => setShowSettingsModal(false)}
              className={`absolute top-3 right-3 ${isDarkMode ? 'text-white hover:text-[#FFD700]' : 'text-black hover:text-[#FFD700]'} text-2xl transition`}
            >
              &times;
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-semibold mb-6 text-center text-[#FFD700]">
              ⚙️ Manage Settings
            </h2>

            <div className="space-y-6">
              {error && (
                <div className="bg-red-800 text-red-400 p-2 rounded-md text-sm font-medium shadow-md">
                  {error}
                </div>
              )}
              {/* Leverage Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#FFD700] mb-2">Leverage</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-3`}>
                  Current Leverage: {selectedAccount.leverage}
                </p>
                <div>
                  <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
                    Select Leverage
                  </label>
                  <select
                    value={newLeverage}
                    onChange={(e) => setNewLeverage(e.target.value)}
                    className={`w-full ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-black'} border border-[#FFD700] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]`}
                  >
                    <option value="">Select new leverage</option>
                    <option value="1:50">1:1</option>
                    <option value="1:50">1:2</option>
                    <option value="1:50">1:5</option>
                    <option value="1:50">1:10</option>
                    <option value="1:50">1:20</option>
                    <option value="1:50">1:50</option>
                    <option value="1:100">1:100</option>
                    <option value="1:200">1:200</option>
                    <option value="1:500">1:500</option>
                  </select>
                  <button
                    onClick={handleUpdateLeverage}
                    disabled={!newLeverage || updatingLeverage}
                    className={`mt-2 px-4 py-2 rounded text-black transition ${
                      newLeverage && !updatingLeverage
                        ? "bg-[#FFD700] hover:bg-white"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {updatingLeverage ? 'Updating...' : 'Update Leverage'}
                  </button>
                </div>
              </div>

              {/* Password Type Selection */}
              <div>
                <h3 className="text-lg font-semibold text-[#FFD700] mb-2">Select Password Type</h3>
                <select
                  value={selectedPasswordType}
                  onChange={(e) => setSelectedPasswordType(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-black'} border border-[#FFD700] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]`}
                >
                  <option value=""> -- Select Master or Investor -- </option>
                  <option value="master">Master Password</option>
                  <option value="investor">Investor Password</option>
                </select>
              </div>

              {/* Change Password Section */}
              {selectedPasswordType && (
                <div>
                  <h3 className="text-lg font-semibold text-[#FFD700] mb-2">
                    Change {selectedPasswordType === "master" ? "Master" : "Investor"} Password
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                        New Password
                      </label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-black'} border border-[#FFD700] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]`}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="relative">
                      <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-black'} border border-[#FFD700] rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#FFD700]`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-[#FFD700]' : 'text-gray-600 hover:text-[#FFD700]'} transition`}
                        >
                          {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleUpdatePassword}
                      disabled={!newPassword || !confirmPassword || updatingPassword}
                      className={`px-4 py-2 rounded text-black transition ${
                        newPassword && confirmPassword && !updatingPassword
                          ? "bg-[#FFD700] hover:bg-white"
                          : "bg-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {updatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
