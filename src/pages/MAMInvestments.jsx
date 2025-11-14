import React, { useState, useEffect } from "react";

const Maminvestments = () => {
  const [activeTab, setActiveTab] = useState("availableManagers");
  const [showPopup, setShowPopup] = useState(null);
  const [showViewPopup, setShowViewPopup] = useState(null);
  const [managers, setManagers] = useState([]);
  const [investments, setInvestments] = useState([]);

  // ✅ Added missing states
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDarkMode] = useState(true);

  // Load managers and investments from localStorage
  useEffect(() => {
    const storedManagers = localStorage.getItem("mamAccounts");
    if (storedManagers) {
      try {
        const parsed = JSON.parse(storedManagers);
        if (Array.isArray(parsed)) setManagers(parsed);
      } catch (err) {
        console.error("Failed to parse MAM accounts from localStorage:", err);
      }
    }

    const storedInvestments = localStorage.getItem("myInvestments");
    if (storedInvestments) {
      try {
        const parsedInvestments = JSON.parse(storedInvestments);
        if (Array.isArray(parsedInvestments)) setInvestments(parsedInvestments);
      } catch (err) {
        console.error("Failed to parse investments:", err);
      }
    }
  }, []);

  const handleInvestClick = (manager) => setShowPopup(manager);

  const handleSubmitInvestment = () => {
    const newInvestment = {
      id: showPopup.id,
      accountName: showPopup.accountName,
      profitPercentage: showPopup.profitPercentage,
      leverage: showPopup.leverage,
      totalProfit: showPopup.totalProfit || 0,
      enabled: showPopup.enabled,
      riskLevel: showPopup.riskLevel || "Medium",
    };

    const updatedInvestments = [...investments, newInvestment];
    setInvestments(updatedInvestments);
    localStorage.setItem("myInvestments", JSON.stringify(updatedInvestments));

    alert(`Investment request submitted for ${showPopup.accountName}`);
    setShowPopup(null);
  };

  // ✅ Show account details when View button is clicked
  useEffect(() => {
    if (showViewPopup) {
      setSelectedAccount(showViewPopup);
    }
  }, [showViewPopup]);

  return (
    <div className=" text-yellow-300 p-4 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">
        MAM Investments
      </h1>
   <div className="flex w-full mb-4">
  <button
    onClick={() => setActiveTab("availableManagers")}
    className={`ml-auto px-5 py-2 rounded-md font-semibold border border-yellow-500 transition-all ${
      activeTab === "availableManagers"
        ? "bg-yellow-500 text-black"
        : "bg-black text-yellow-300 hover:bg-yellow-500 hover:text-black"
    }`}
  >
    Go Manage Accounts
  </button>
</div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("availableManagers")}
          className={`px-5 py-2 rounded-md font-semibold border border-yellow-500 transition-all ${
            activeTab === "availableManagers"
              ? "bg-yellow-500 text-black"
              : "bg-black text-yellow-300 hover:bg-yellow-500 hover:text-black"
          }`}
        >
          Available Managers
        </button>

        <button
          onClick={() => setActiveTab("myInvestments")}
          className={`px-5 py-2 rounded-md font-semibold border border-yellow-500 transition-all ${
            activeTab === "myInvestments"
              ? "bg-yellow-500 text-black"
              : "bg-black text-yellow-300 hover:bg-yellow-500 hover:text-black"
          }`}
        >
          My Investments
        </button>
      </div>

      {/* Available Managers */}
      {activeTab === "availableManagers" && (
        <div className="w-full">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">
            Explore Top MAM Managers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {managers.length > 0 ? (
              managers.map((manager) => (
                <div
                  key={manager.id}
                  className="w-72 bg-[#1c1c1c] text-white border-2 border-yellow-500 rounded-xl p-4 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="font-bold text-[20px] mb-1 text-yellow-400 uppercase text-center">
                    {manager.accountName}
                  </h3>
                  <p className="text-sm text-gray-300 mb-3 text-center">
                    ID: {manager.id}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 text-[16px]">
                    <p className="bg-[#2a2a2a] p-2 rounded-md flex justify-between">
                      <span className="font-semibold">
                        Balance : ${manager.balance?.toFixed(2) || "0.00"}
                      </span>
                    </p>
                    <p className="bg-[#2a2a2a] p-2 rounded-md flex justify-between">
                      <span className="font-semibold">
                        Equity : ${manager.equity?.toFixed(2) || "0.00"}
                      </span>
                    </p>
                    <p className="bg-[#2a2a2a] p-2 rounded-md flex justify-between">
                      <span className="font-semibold">
                        Profit Share : {manager.profitPercentage}%
                      </span>
                    </p>
                    <p className="bg-[#2a2a2a] p-2 rounded-md flex justify-between">
                      <span className="font-semibold">
                        Account Age : {manager.accountAge} days
                      </span>
                    </p>
                    <p className="bg-[#2a2a2a] p-2 rounded-md flex justify-between">
                      <span className="font-semibold">
                        Risk Level : {manager.riskLevel || "Medium"}
                      </span>
                    </p>
                    <p className="bg-[#2a2a2a] p-2 rounded-md flex justify-between">
                      <span className="font-semibold">
                        Growth : {manager.growth}%
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleInvestClick(manager)}
                    className="mt-4 mx-auto block w-40 text-center bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 text-sm rounded-md transition-all duration-300"
                  >
                    👥 Invest
                  </button>
                </div>
              ))
            ) : (
              <div className="text-yellow-300 text-center col-span-full">
                No MAM Managers available. Create one first.
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Investments */}
      {activeTab === "myInvestments" && (
        <div className="bg-[#111] rounded-2xl p-6 w-full max-w-6xl shadow-[0_0_15px_rgba(255,215,0,0.4)]">
          <div className="text-xl font-bold mb-4 text-yellow-400">
            My Investments
          </div>

          {investments.length > 0 ? (
            <table className="w-full text-left  rounded-md overflow-hidden">
              <thead className="bg-black-500 text-">
                <tr>
                  <th className="px-4 py-2 ">ID</th>
                  <th className="px-4 py-2">Account Name</th>
                  <th className="px-4 py-2">Profit %</th>
                  <th className="px-4 py-2">Leverage</th>
                  <th className="px-4 py-2">Total Profit</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv, index) => (
                  <tr
                    key={index}
                    className="border-t border-yellow-700 hover:bg-[#1c1c1c]"
                  >
                    <td className="px-4 py-2 text-white">{inv.id}</td>
                    <td className="px-4 py-2 text-white ">{inv.accountName}</td>
                    <td className="px-4 py-2 text-white">{inv.profitPercentage}%</td>
                    <td className="px-4 py-2 text-white">{inv.leverage}</td>
                    <td className="px-4 py-2 text-white">${inv.totalProfit?.toFixed(2)}</td>
                    <td className="px-4 py-2 text-white">
                      {inv.enabled ? "Enabled" : "Disabled"}
                    </td>
                    <td className="px-4 py-2 flex gap-3 justify-center">
                      <button
                        onClick={() => setShowViewPopup(inv)}
                        className="bg-yellow-500 text-black px-3 py-1 rounded-md font-semibold hover:bg-yellow-400 transition"
                      >
                        View
                      </button>
                      <button className="bg-yellow-500 text-black px-3 py-1 rounded-md font-semibold hover:bg-yellow-400 transition">
                        Deposit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-yellow-200 text-center">
              No active investments yet.
            </p>
          )}
        </div>
      )}

      {/* Investment Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowPopup(null)}
        >
          <div
            className="bg-[#111] p-6 rounded-2xl shadow-[0_0_20px_rgba(255,215,0,0.6)] max-w-md w-full text-center border border-yellow-500"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">
              Invest in Manager
            </h3>

            <div className="text-left space-y-2 mb-4 text-yellow-200">
              <p>
                <strong>ID:</strong> {showPopup.id}
              </p>
              <p>
                <strong>Account Name:</strong> {showPopup.accountName}
              </p>
              <p>
                <strong>Profit Sharing:</strong> {showPopup.profitPercentage}%
              </p>
              <p>
                <strong>Leverage:</strong> {showPopup.leverage}
              </p>
              <p>
                <strong>Total Profit:</strong> ${showPopup.totalProfit?.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {showPopup.enabled ? "Enabled" : "Disabled"}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-2 rounded-md bg-gray-800 text-yellow-200 focus:outline-yellow-400"
              />
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full p-2 rounded-md bg-gray-800 text-yellow-200 focus:outline-yellow-400"
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmitInvestment}
                className="bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition"
              >
                Submit Request
              </button>
              <button
                onClick={() => setShowPopup(null)}
                className="bg-gray-700 text-yellow-300 px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Account View */}
      {selectedAccount && (
        <div className="mt-6 w-full max-w-6xl bg-[#111] rounded-2xl p-6 border border-gold">
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

          {/* Account Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Info label="Account ID" value={selectedAccount.id} isDarkMode={true} />
            <Info label="Account Name" value={selectedAccount.accountName} isDarkMode={true} />
            <Info label="Profit Percentage" value={`${selectedAccount.profitPercentage}%`} isDarkMode={true} />
            <Info label="Leverage" value={selectedAccount.leverage} isDarkMode={true} />
            <Info label="Total Profit" value={`$${selectedAccount.totalProfit?.toFixed(2) || "0.00"}`} isDarkMode={true} />
            <Info label="Status" value={selectedAccount.enabled ? "Enabled" : "Disabled"} isDarkMode={true} />
            <Info label="Risk Level" value={selectedAccount.riskLevel || "Medium"} isDarkMode={true} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition">
              ⏸️ Pause
            </button>
            <button className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition">
              💰 Deposit
            </button>
            <button className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition">
              💳 Withdraw
            </button>
            <button className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition">
              💼 Investor
            </button>
            <button className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition">
              💼 Manager
            </button>
            <button className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition">
              ✏️ Edit
            </button>
          </div>
        </div>
      )}

      {/* Gold Styles */}
      <style>{`
        .text-gold { color: #FFD700; }
        .border-gold { border-color: #FFD700; }
        .bg-gold { background-color: #FFD700; }
      `}</style>
    </div>
  );
};

// Info component outside
function Info({ label, value, isDarkMode }) {
  return (
    <div className={`p-3 ${isDarkMode ? 'bg-black border-[#333]' : 'bg-white border-gray-300'} border rounded-lg`}>
      <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
      <p className="text-gold text-base font-semibold">{value}</p>
    </div>
  );
}

export default Maminvestments;
