import React from "react";

export default function TradesModal({ showTradesModal, setShowTradesModal, selectedAccount }) {
  return (
    <>
      {showTradesModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black text-white p-6 rounded-lg w-full max-w-4xl relative shadow-xl border-2 border-gold">
            {/* Close Button */}
            <button
              onClick={() => setShowTradesModal(false)}
              className="absolute top-3 right-3 text-white hover:text-gold text-2xl transition"
            >
              &times;
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-semibold mb-6 text-center text-gold">
              Open Positions for Account: {selectedAccount.login}
            </h2>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm text-gray-200">
                <thead>
                  <tr className="bg-[#111] text-gold border-b border-gold">
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
                  <tr className="border-b border-[#333]">
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
