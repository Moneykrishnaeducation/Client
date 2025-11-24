import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { apiCall } from "../utils/api";

export default function InvestorManagement({ showTradesModal, setShowTradesModal, selectedAccount }) {
  const { isDarkMode } = useTheme();
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError, setToggleError] = useState(null);

  useEffect(() => {
    if (showTradesModal && selectedAccount) fetchInvestors();
  }, [showTradesModal, selectedAccount]);

  const fetchInvestors = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Missing auth token. Please log in again.");

      const url = `http://client.localhost:8000/mam/${selectedAccount.account_id}/investors`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to load investors");

      const data = await res.json();
      setInvestors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Investor fetch error:", err);
      setInvestors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCopy = async (accountId, currentEnabled) => {
    setToggleError(null);
    setToggleLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Missing auth token.");

      const url = `http://client.localhost:8000/mam/investors/${accountId}/toggle-copy`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Toggle failed");

      const payload = await res.json();
      console.log("Toggle payload:", payload);

      const newEnabled = Boolean(payload.investor_allow_copy);

      setInvestors((prev) =>
        prev.map((inv) =>
          String(inv.id) === String(accountId)
            ? { ...inv, investor_allow_copy: newEnabled }
            : inv
        )
      );

      alert(payload.message || "Copying updated.");
    } catch (e) {
      console.error("Toggle API error:", e);
      setToggleError(String(e));
      
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <>
      {showTradesModal && (
        <div
          className={`fixed inset-0 ${isDarkMode ? "bg-black/50" : "bg-white/70"} 
          flex items-center justify-center z-50`}
        >
          <div
            className={`${isDarkMode ? "bg-[#111] text-white" : "bg-white text-black"} 
            p-6 rounded-lg w-full max-w-4xl relative shadow-xl border-2 border-[#FFD700]`}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowTradesModal(false)}
              className={`absolute top-3 right-3 ${isDarkMode
                  ? "text-white hover:text-[#FFD700]"
                  : "text-black hover:text-[#FFD700]"
                } text-2xl`}
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-6 text-center text-[#FFD700]">
              Investor Management
            </h2>

            {loading ? (
              <p className="text-center">Loading investors...</p>
            ) : investors.length === 0 ? (
              <p className="text-center">No investors found</p>
            ) : (
              <div className="space-y-4">
                {investors.map((item) => (
                  <div
                    key={item.account_id}
                    className={`rounded-lg flex items-center justify-between px-4 py-3 border ${isDarkMode
                        ? "border-[#333]"
                        : "border-gray-300"
                      }`}
                  >
                    {/* Profile Info */}
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gray-500 h-12 w-12"></div>
                      <div>
                        <p className="font-semibold">{item.username}</p>
                        <p className="text-sm text-gray-400">{item.email}</p>
                        <p className="text-xs text-gray-500">Account ID: {item.account_id}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6">
                      <span>💵 Invested: ${item.balance ?? 0.0}</span>
                      <span>📈 Profit: ${item.profit ?? 0.0}</span>
                      <span>📊 ROI: N/A</span>
                      <span className="text-green-400">
                        {item.manager_allow_copy ? "Copying Allowed" : "Copying Disabled"}
                      </span>
                    </div>

                    {/* Toggle Copy */}
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        disabled={toggleLoading}
                        checked={item.manager_allow_copy}
                        onChange={() =>
                          handleToggleCopy(item.account_id, item.manager_allow_copy)
                        }
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Toggle Error */}
            {toggleError && <p className="text-red-500 mt-3">{toggleError}</p>}
          </div>
        </div>
      )}
    </>
  );
}
