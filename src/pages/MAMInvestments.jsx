import React, { useState } from "react";

const Maminvestments = () => {
  const [activeTab, setActiveTab] = useState("availableManagers");
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="mam-main-con min-h-screen bg-black text-yellow-300 p-6">
      {/* Header */}
      <div className="invest-manager-container max-w-4xl mx-auto">
        <header id="titl-h1" className="text-3xl font-bold text-center mb-4 text-yellow-400">
          MAM Investments
        </header>

        {/* Back Button */}
        <div className="text-center mb-6">
          <a
            href="/"
            className="manage-accounts-btn inline-block bg-yellow-500 text-black px-5 py-2 rounded-md font-semibold hover:bg-yellow-400 transition"
          >
            Go Manage Accounts
          </a>
        </div>

        {/* Tabs */}
        <div className="invest-mam-top-bar flex justify-center gap-4 mb-6">
          <div
            className={`cursor-pointer px-5 py-2 rounded-md font-semibold border border-yellow-500 transition-all ${
              activeTab === "availableManagers"
                ? "bg-yellow-500 text-black"
                : "bg-black text-yellow-300 hover:bg-yellow-500 hover:text-black"
            }`}
            onClick={() => setActiveTab("availableManagers")}
          >
            Available Managers
          </div>
          <div
            className={`cursor-pointer px-5 py-2 rounded-md font-semibold border border-yellow-500 transition-all ${
              activeTab === "myInvestments"
                ? "bg-yellow-500 text-black"
                : "bg-black text-yellow-300 hover:bg-yellow-500 hover:text-black"
            }`}
            onClick={() => setActiveTab("myInvestments")}
          >
            My Investments
          </div>
        </div>

        {/* Available Managers Section */}
        {activeTab === "availableManagers" && (
          <div
            id="availableManagersSection"
            className="section bg-gray-900 border border-yellow-500 rounded-md p-6"
          >
            <div className="explore-ttl-section text-xl font-bold mb-4 text-yellow-400">
              Explore Top MAM Managers
            </div>

            {/* Placeholder Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((manager) => (
                <div
                  key={manager}
                  className="border border-yellow-500 p-4 rounded-md bg-black hover:bg-yellow-500/10 transition-all"
                >
                  <h3 className="font-semibold text-yellow-300 mb-2">
                    Manager {manager}
                  </h3>
                  <p className="text-yellow-200 text-sm mb-4">
                    Experienced trader with strong returns.
                  </p>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition"
                  >
                    Invest
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Investments Section */}
        {activeTab === "myInvestments" && (
          <div
            id="myInvestmentsSection"
            className="section bg-gray-900 border border-yellow-500 rounded-md p-6"
          >
            <div className="explore-ttl-section text-xl font-bold mb-4 text-yellow-400">
              My Investments
            </div>
            <div className="my-investment-list space-y-3">
              <div className="border border-yellow-500 p-4 rounded-md bg-black">
                <p>No active investments yet.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popup Overlay */}
      {showPopup && (
        <div
          className="popup-overlay fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-black border border-yellow-500 p-6 rounded-md max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-3 text-yellow-400">
              Invest in Manager
            </h3>
            <p className="text-yellow-200 mb-6">
              Are you sure you want to invest with this manager?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-700 text-yellow-300 px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maminvestments;
