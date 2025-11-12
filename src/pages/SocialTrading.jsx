import React, { useState } from "react";
import { Info } from "lucide-react";

const MAMManager = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);

  return (
    <div className="max-h-[90vh] w-full bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl mx-auto p-8 relative bg-transparent text-center">

        {/* Header Row */}
        <div className="flex justify-center items-center mb-4 relative">
          
   <div>
  <h1
    onClick={() => {
      setAnimateTitle(true);
      setTimeout(() => setAnimateTitle(false), 1500); // stop animation
    }}
    className={`hidden sm:block text-[25px] font-bold cursor-pointer 
      ${
        animateTitle
          ? "bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 bg-[length:200%_100%] animate-gold-move text-transparent bg-clip-text"
          : "text-yellow-400"
      }`}
  >
    Multi-Account Manager
  </h1>
</div>




          {/* Info Button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 underline font-semibold text-sm absolute right-0 transition-all duration-200"
          >
            <Info className="w-4 h-4 text-blue-400" />
            Know what it is?
          </button>
        </div>

        {/* Expandable Info Box */}
        {showInfo && (
          <div className="mb-6 bg-gray-900/70 p-6 rounded-md text-gray-300 max-w-3xl mx-auto text-left transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">
              Understanding MAM Accounts
            </h3>

            <p className="text-sm mb-2">
              <strong>Manager Trades, Auto-Copied:</strong> Trades by the manager
              are automatically replicated in your investment account in real
              time.
            </p>

            <p className="text-sm mb-3">
              <strong>Proportional Lot Sizing:</strong> Lot size adjusts based on
              your account balance relative to the manager's.
            </p>

            <ul className="list-disc list-inside text-sm space-y-1 ml-3">
              <li>Example: Manager trades 1 lot for $10,000.</li>
              <li>$20,000 Investor: Gets 2 lots.</li>
              <li>$5,000 Investor: Gets 0.5 lots.</li>
            </ul>

            <p className="text-green-400 text-sm mt-3">
              ✅ <strong>Important Note:</strong> All trades will be copied with a
              minimum size of 0.01 lot, ensuring you participate in every trading
              opportunity.
            </p>
          </div>
        )}

        {/* Buttons Section */}
        {/* Buttons Section */}
<div className="flex flex-col sm:flex-row gap-6 justify-center mb-8 mt-[20px]">
  <button className="bg-yellow-400 text-black font-semibold py-3 px-4 rounded-md w-full sm:w-1/2 hover:bg-yellow-300 transition-all duration-200">
    + Create New MAM Manager Account
  </button>
  <button className="bg-yellow-400 text-black font-semibold py-3 px-4 rounded-md w-full sm:w-1/2 hover:bg-yellow-300 transition-all duration-200">
    + Invest in a MAM Account
  </button>
</div>


        {/* No Accounts Section */}
        <div className="text-center border-2 border-dashed border-yellow-400 rounded-md p-4 mt-4 animate-border-glow">
  <p className="font-semibold text-[16px] mb-1 text-white">
    No MAM Accounts Found
  </p>
  <p className="text-sm text-gray-300">
    Click the{" "}
    <span className="text-yellow-400 font-semibold">
      <a href="#">"Create New MAM Account"</a>
    </span>{" "}
    button to create your first MAM account.
  </p>
</div>

      </div>
    </div>
  );
};

export default MAMManager;
