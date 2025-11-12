import React, { useState } from "react";

export default function TradingAccounts({ showDepositModal, setShowDepositModal }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("cheesepay");
  const [cheeseAmount, setCheeseAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [selectedDepositAccount, setSelectedDepositAccount] = useState("");

  const accounts = [
    {
      id: 1,
      type: "Pro",
      login: "902165",
      leverage: "1:100",
      balance: "1200.50",
      credit: "0.00",
      equity: "1180.00",
      margin: "0.00",
      freeMargin:"132.0"
    },
    {
      id: 2,
      type: "Standard",
      login: "902166",
      leverage: "1:200",
      balance: "2540.00",
      credit: "0.00",
      equity: "2550.25",
      margin: "0.00",
      freeMargin:"311.0"
    },
    {
      id: 3,
      type: "ECN",
      login: "902167",
      leverage: "1:500",
      balance: "4890.75",
      credit: "0.00",
      equity: "4895.00",
      margin: "0.00",
      freeMargin:"281.0"
    },
  ];

  // Auto convert USD → INR (mock rate 1 USD = 83.25 INR)
  React.useEffect(() => {
    if (cheeseAmount) {
      if (currency === "USD") {
        setConvertedAmount((cheeseAmount * 83.25).toFixed(2)); // USD → INR
      } else if (currency === "INR") {
        setConvertedAmount((cheeseAmount / 83.25).toFixed(2)); // INR → USD
      }
    } else {
      setConvertedAmount("");
    }
  }, [cheeseAmount, currency]);


  return (
    <div className="min-h-[90vh] bg-black text-white font-sans flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-black py-2 mt-6">
        <div className="max-w-[1100px] mx-auto flex flex-wrap gap-3 justify-around items-center px-4">
          <button className="bg-gold text-black px-4 py-2 rounded hover:bg-white transition">
            Open Account
          </button>
          <button className="bg-gold text-black px-4 py-2 rounded hover:bg-white transition">
            Internal transaction
          </button>
          <button className="bg-gold text-black px-4 py-2 rounded hover:bg-white transition">
            Explore Demo
          </button>
        </div>
      </header>

      <main className="flex-1 w-full flex justify-center">
        <div className="max-w-[1100px] w-full p-6">
          {/* Account Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gold mb-4">
              Account Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#111] border border-gold rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm">Total Balance</p>
                <p className="text-2xl font-bold text-gold">$8,631.25</p>
              </div>
              <div className="bg-[#111] border border-gold rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm">Total Equity</p>
                <p className="text-2xl font-bold text-gold">$8,625.25</p>
              </div>
              <div className="bg-[#111] border border-gold rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm">Total Accounts</p>
                <p className="text-2xl font-bold text-gold">{accounts.length}</p>
              </div>
            </div>
          </div>

          {/* Account Table */}
          {!selectedAccount && (
            <div>
              <h3 className="text-lg font-semibold text-gold mb-3">
                Active Accounts
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm text-gray-200">
                  <thead>
                    <tr className="bg-[#111] text-gold border-b border-gold">
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Login</th>
                      <th className="p-3 text-left">Leverage</th>
                      <th className="p-3 text-left">Balance</th>
                      <th className="p-3 text-left">Equity</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => (
                      <tr
                        key={acc.id}
                        className="border-b border-[#333] hover:bg-[#1a1a1a] transition"
                      >
                        <td className="p-3">{acc.type}</td>
                        <td className="p-3">{acc.login}</td>
                        <td className="p-3">{acc.leverage}</td>
                        <td className="p-3">${acc.balance}</td>
                        <td className="p-3">${acc.equity}</td>
                        <td className="p-3 text-center flex gap-3 justify-center">
                          <button
                            onClick={() => setSelectedAccount(acc)}
                            className="bg-gold text-black px-3 py-1 rounded hover:bg-white transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setShowDepositModal(true);
                              setActiveTab("cheesepay");
                              setSelectedDepositAccount(acc.login);
                            }}
                            className="bg-gold text-black px-3 py-1 rounded hover:bg-white transition"
                          >
                            Deposit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Selected Account View */}
          {selectedAccount && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gold">
                  Account Details
                </h3>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-gold border border-gold px-4 py-1 rounded hover:bg-gold hover:text-black transition text-sm"
                >
                  ← Back
                </button>
              </div>

              <div className="bg-[#111] border border-gold rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Info label="Account Type" value={selectedAccount.type} />
                  <Info label="Platform Login" value={selectedAccount.login} />
                  <Info label="Leverage" value={selectedAccount.leverage} />
                  <Info label="Balance" value={`$${selectedAccount.balance}`} />
                  <Info label="Equity" value={`$${selectedAccount.equity}`} />
                  <Info label="Margin level" value={`${selectedAccount.margin}%`} />
                  <Info label="Free Margin" value={`$${selectedAccount.freeMargin}`} />
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <button
                    className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition"
                    onClick={() => {
                      setShowDepositModal(true);
                      setSelectedDepositAccount(selectedAccount.login);
                    }}
                  >
                    Deposit
                  </button>
                  <button className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition">
                    Withdraw
                  </button>
                  <button className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition">
                    Trades
                  </button>
                  <button className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition">
                    Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Deposit Modal */}
          {showDepositModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
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
                      className={`pb-3 px-5 font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${activeTab === tab
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
                            className={`flex items-center gap-2 cursor-pointer select-none ${currency === curr ? "text-[#FFD700]" : "text-gray-400"
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
                            className={`flex items-center gap-2 cursor-pointer select-none ${currency === curr ? "text-[#FFD700]" : "text-gray-400"
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
                      <div className="p-3 border border-[#FFD700] rounded-lg text-center text-sm break-all bg-[#1a1a1a]">
                        TBkQunj4UD4Mej7pKyRVAUg5Jgm9aJRCHs
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
        </div>
      </main>

      <style>{`
        .text-gold { color: #FFD700; }
        .border-gold { border-color: #FFD700; }
        .bg-gold { background-color: #FFD700; }
      `}</style>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="p-3 bg-black border border-[#333] rounded-lg">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-gold text-base font-semibold">{value}</p>
    </div>
  );
}
