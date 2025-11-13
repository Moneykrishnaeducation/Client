import React from "react";
import { Copy } from "lucide-react";

export default function DepositModal({
  showDepositModal,
  setShowDepositModal,
  activeTab,
  setActiveTab,
  cheeseAmount,
  setCheeseAmount,
  currency,
  setCurrency,
  convertedAmount,
  selectedDepositAccount,
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("TBkQunj4UD4Mej7pKyRVAUg5Jgm9aJRCHs");
      alert("Address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <>
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-[#111] border border-[#FFD700] rounded-2xl w-[90%] max-w-xl p-6 relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-3 right-4 text-[#FFD700] text-3xl hover:text-white transition"
            >
              &times;
            </button>

            {/* Title */}
            <h3 className="text-2xl font-bold text-[#FFD700] mb-5 text-center tracking-wide">
              💰 Deposit Funds
            </h3>

            {/* Tabs */}
            <div className="flex justify-center gap-4 border-b border-[#FFD700] mb-6">
              {["cheesepay", "manual", "usdt"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-5 font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                    activeTab === tab
                      ? "text-[#FFD700] border-b-2 border-[#FFD700]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab === "cheesepay"
                    ? "CheesePay"
                    : tab === "manual"
                    ? "Manual Deposit"
                    : "USDT (TRC20)"}
                </button>
              ))}
            </div>

            {/* Deposit Account Select (Common) */}
            <div className="mb-5">
              <label className="block text-sm text-gray-400 mb-2">
                Account ID
              </label>
              <input
                type="text"
                value={selectedDepositAccount || "No account selected"}
                readOnly
                className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] text-gray-300 rounded-lg cursor-not-allowed"
              />
            </div>

            {/* Tab Content */}
            <div className="text-white space-y-5">
              {/* CheesePay Section */}
              {activeTab === "cheesepay" && (
                <form className="space-y-4">
                  {/* Currency Selection (Styled Radios) */}
                  <div className="flex gap-6 justify-center">
                    {["USD", "INR"].map((curr) => (
                      <label
                        key={curr}
                        className={`flex items-center gap-2 cursor-pointer select-none ${
                          currency === curr ? "text-[#FFD700]" : "text-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cp-currency"
                          value={curr}
                          checked={currency === curr}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="appearance-none w-5 h-5 border-2 border-[#FFD700] rounded-full
                   checked:bg-[#FFD700] checked:border-[#FFD700] transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                        />
                        <span className="font-medium">{curr}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={cheeseAmount}
                      onChange={(e) => setCheeseAmount(e.target.value)}
                      className="w-full p-3 bg-black border border-[#FFD700] text-white rounded-lg focus:ring-2 focus:ring-[#FFD700] outline-none transition"
                    />
                  </div>

                  {convertedAmount && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        {currency === "USD" ? "Converted (INR)" : "Converted (USD)"}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={
                          currency === "USD"
                            ? `₹ ${convertedAmount}`
                            : `$ ${convertedAmount}`
                        }
                        placeholder="Auto converted amount"
                        className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700]/60 text-gray-300 rounded-lg cursor-not-allowed"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-white transition-all"
                  >
                    Confirm & Proceed
                  </button>
                </form>
              )}

              {/* Manual Deposit Section */}
              {activeTab === "manual" && (
                <form className="space-y-4">
                  <p className="text-gray-400 text-center">
                    Contact <span className="text-[#FFD700]">Support</span> for Bank
                    Details.
                  </p>

                  <div className="flex gap-6 justify-center">
                    {["USD", "INR"].map((curr) => (
                      <label
                        key={curr}
                        className={`flex items-center gap-2 cursor-pointer select-none ${
                          currency === curr ? "text-[#FFD700]" : "text-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cp-currency"
                          value={curr}
                          checked={currency === curr}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="appearance-none w-5 h-5 border-2 border-[#FFD700] rounded-full
                   checked:bg-[#FFD700] checked:border-[#FFD700] transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                        />
                        <span className="font-medium">{curr}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={cheeseAmount}
                      onChange={(e) => setCheeseAmount(e.target.value)}
                      className="w-full p-3 bg-black border border-[#FFD700] text-white rounded-lg focus:ring-2 focus:ring-[#FFD700] outline-none transition"
                    />
                  </div>

                  {convertedAmount && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        {currency === "USD" ? "Converted (INR)" : "Converted (USD)"}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={
                          currency === "USD"
                            ? `₹ ${convertedAmount}`
                            : `$ ${convertedAmount}`
                        }
                        placeholder="Auto converted amount"
                        className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700]/60 text-gray-300 rounded-lg cursor-not-allowed"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    className="w-full text-gray-400 file:mr-2 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-[#FFD700] file:text-black hover:file:bg-white transition"
                  />

                  <button
                    type="submit"
                    className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-white transition-all"
                  >
                    Submit
                  </button>
                </form>
              )}

              {/* USDT Section */}
              {activeTab === "usdt" && (
                <form className="space-y-4">
                  <p className="text-gray-300">
                    Send <span className="text-[#FFD700]">USDT (TRC20)</span> to this
                    address:
                  </p>
                  <div className="relative p-3 border border-[#FFD700] rounded-lg text-center text-sm break-all bg-[#1a1a1a]">
                    TBkQunj4UD4Mej7pKyRVAUg5Jgm9aJRCHs
                    <button
                      onClick={handleCopy}
                      className="absolute top-2 right-2 text-[#FFD700] hover:text-white transition-colors"
                      title="Copy address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="number"
                    placeholder="Enter USDT amount"
                    className="w-full p-3 bg-black border border-[#FFD700] text-white rounded-lg"
                  />

                  <input
                    type="file"
                    required
                    className="w-full text-gray-400 file:mr-2 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-[#FFD700] file:text-black hover:file:bg-white transition"
                  />

                  <button
                    type="submit"
                    className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-white transition-all"
                  >
                    Submit USDT Deposit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
