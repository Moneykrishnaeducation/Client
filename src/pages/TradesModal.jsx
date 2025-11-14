import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function TradesModal({ showTradesModal, setShowTradesModal, selectedAccount }) {
  const { isDarkMode } = useTheme();
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
              Open Positions for Account: {selectedAccount.login}
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
                  <tr className={`border-b ${isDarkMode ? 'border-[#333]' : 'border-gray-300'}`}>
                    <td className="p-3 text-center" colSpan="12">
                      No open positions found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
