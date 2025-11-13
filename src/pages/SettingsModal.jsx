import React from "react";
import { Eye, EyeOff } from "lucide-react";

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
  return (
    <>
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black text-white p-6 rounded-lg w-full max-w-md relative shadow-xl border-2 border-gold">
            {/* Close Button */}
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-3 right-3 text-white hover:text-gold text-2xl transition"
            >
              &times;
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-semibold mb-6 text-center text-gold">
              ⚙️ Manage Settings
            </h2>

            <div className="space-y-6">
              {/* Leverage Section */}
              <div>
                <h3 className="text-lg font-semibold text-gold mb-2">Leverage</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Current Leverage: {selectedAccount.leverage}
                </p>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Select Leverage
                  </label>
                  <select
                    value={newLeverage}
                    onChange={(e) => setNewLeverage(e.target.value)}
                    className="w-full bg-black text-white border border-gold rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
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
                        ? "bg-gold hover:bg-white"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Update Leverage
                  </button>
                </div>
              </div>

              {/* Password Type Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gold mb-2">Select Password Type</h3>
                <select
                  value={selectedPasswordType}
                  onChange={(e) => setSelectedPasswordType(e.target.value)}
                  className="w-full bg-black text-white border border-gold rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value=""> -- Select Master or Investor -- </option>
                  <option value="master">Master Password</option>
                  <option value="investor">Investor Password</option>
                </select>
              </div>

              {/* Change Password Section */}
              {selectedPasswordType && (
                <div>
                  <h3 className="text-lg font-semibold text-gold mb-2">
                    Change {selectedPasswordType === "master" ? "Master" : "Investor"} Password
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        New Password
                      </label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black text-white border border-gold rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm text-gray-400 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-black text-white border border-gold rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gold"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gold transition"
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
                          ? "bg-gold hover:bg-white"
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
