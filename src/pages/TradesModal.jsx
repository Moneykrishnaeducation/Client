import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { apiCall } from "../utils/api";

export default function TradesModal({ showTradesModal, setShowTradesModal, selectedAccount, tradeRole }) {
  const { isDarkMode } = useTheme();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showTradesModal && selectedAccount) {
      fetchPositions();
    }
  }, [showTradesModal, selectedAccount]);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      let data;
      if (tradeRole === "manager") {
        // Fetch from external URL for manager
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Missing auth token.");
        const url = `http://client.localhost:8000/open-positions/${selectedAccount.master_account_id }/`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Error fetching positions: ${res.statusText || res.status}`);
        }
        data = await res.json();
      } else {
        // Investor fetch using apiCall internal API
        data = await apiCall(`api/get-trading-positions/${selectedAccount.account_id}/`);
      }
      setPositions(data.positions || data || []);
    } catch (err) {
      console.error('Error fetching positions:', err);

      // Display user-friendly message for duplicate TradingAccount backend error
      if (err.message && err.message.includes('more than one TradingAccount')) {
        alert("Error: Multiple trading accounts found for the selected master account. Please contact support.");
      }

      setPositions([]);
    } finally {
      setLoading(false);
      console.log(selectedAccount,tradeRole)
      tradeRole=" "
    }
  };
  return (
    <>
      {showTradesModal && (
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/50' : 'bg-white/70'} flex items-center justify-center z-50`}>
          <div className={`${isDarkMode ? 'bg-[#111]' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-black'} p-6 rounded-lg w-full max-w-4xl relative shadow-xl border-2 border-[#FFD700]`}>
            {/* Close Button */}
            <button
              onClick={() => setShowTradesModal(false)}
              className={`absolute top-3 right-3 ${isDarkMode ? 'text-white hover:text-[#FFD700]' : 'text-black hover:text-[#FFD700]'} text-2xl transition`}
            >
              &times;
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-semibold mb-6 text-center text-[#FFD700]">
              Open Positions for Account: {tradeRole === "investor" ?  selectedAccount.account_id : selectedAccount.account_id}
            </h2>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className={`${isDarkMode ? 'bg-[#111] text-[#FFD700]' : 'bg-gray-100 text-[#FFD700]'} border-b border-[#FFD700]`}>
                    <th className="p-3 text-left">Ticket</th>
                    <th className="p-3 text-left">Symbol</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Volume</th>
                    <th className="p-3 text-left">Open Price</th>
                    <th className="p-3 text-left">Current Price</th>
                    <th className="p-3 text-left">SL</th>
                    <th className="p-3 text-left">TP</th>
                    <th className="p-3 text-left">Profit</th>
                    <th className="p-3 text-left">Swap</th>
                    <th className="p-3 text-left">Open Time</th>
                    <th className="p-3 text-left">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className={`border-b ${isDarkMode ? 'border-[#333]' : 'border-gray-300'}`}>
                      <td className="p-3 text-center" colSpan="12">
                        Loading positions...
                      </td>
                    </tr>
                  ) : positions.length > 0 ? (
                    positions.map((position, index) => (
                      <tr key={index} className={`border-b ${isDarkMode ? 'border-[#333]' : 'border-gray-300'}`}>
                        <td className="p-3">{position.ticket}</td>
                        <td className="p-3">{position.symbol}</td>
                        <td className="p-3">{position.type}</td>
                        <td className="p-3">{position.volume}</td>
                        <td className="p-3">{position.open_price}</td>
                        <td className="p-3">{position.current_price}</td>
                        <td className="p-3">{position.sl}</td>
                        <td className="p-3">{position.tp}</td>
                        <td className="p-3">{position.profit}</td>
                        <td className="p-3">{position.swap}</td>
                        <td className="p-3">{position.open_time}</td>
                        <td className="p-3">{position.comment}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className={`border-b ${isDarkMode ? 'border-[#333]' : 'border-gray-300'}`}>
                      <td className="p-3 text-center" colSpan="12">
                        No open positions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
