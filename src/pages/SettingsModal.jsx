import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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
                    <option value="1:50">1:50</option>
                    <option value="1:100">1:100</option>
                    <option value="1:200">1:200</option>
                    <option value="1:500">1:500</option>
                    <option value="1:1000">1:1000</option>
                  </select>
                  <button
                    onClick={() => {
                      // Handle leverage update
                      alert(`Leverage updated to ${newLeverage}`);
                      setNewLeverage("");
                    }}
                    disabled={!newLeverage}
                    className={`mt-2 px-4 py-2 rounded text-black transition ${
                      newLeverage
                        ? "bg-[#FFD700] hover:bg-white"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Update Leverage
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
                      onClick={() => {
                        if (newPassword !== confirmPassword) {
                          alert("Passwords do not match");
                          return;
                        }
                        // Handle password update
                        alert("Password updated successfully");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      disabled={!newPassword || !confirmPassword}
                      className={`px-4 py-2 rounded text-black transition ${
                        newPassword && confirmPassword
                          ? "bg-[#FFD700] hover:bg-white"
                          : "bg-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Update Password
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
