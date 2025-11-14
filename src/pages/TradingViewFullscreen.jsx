import React, { useEffect, useState, useRef } from "react";
import { BarChart3, FileText, Crown, DollarSign } from "lucide-react";

export default function TradingViewFullscreen() {
  const [isApproved, setIsApproved] = useState(true);
  const [approvalRequested, setApprovalRequested] = useState(false);
  const tradingViewContainer = useRef(null);

  // ✅ Check admin approval from localStorage
  const checkAdminApproval = () => {
    const approved = localStorage.getItem("admin_approved") === "true";
    setIsApproved(approved);
  };

  // ✅ Request admin approval (simulated)
  const requestAdminApproval = () => {
    setApprovalRequested(true);
    localStorage.setItem("admin_approval_requested", "true");
  };

  // ✅ Load TradingView widget dynamically
  const loadTradingViewWidget = () => {
    if (!tradingViewContainer.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line no-undef
      new TradingView.widget({
        symbol: "XAUUSD",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#121212",
        enable_publishing: true,
        allow_symbol_change: true,
        container_id: "tradingview_chart",
      });
    };
    tradingViewContainer.current.appendChild(script);
  };

  // ✅ On mount: check approval & setup polling
  useEffect(() => {
    checkAdminApproval();
    const interval = setInterval(() => {
      checkAdminApproval();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Load widget when approved
  useEffect(() => {
    if (isApproved) {
      loadTradingViewWidget();
    }
  }, [isApproved]);

  return (
    <div className=" w-[100vw] min-h-full lg:w-[80vw] overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans">
      {/* 🔹 Static Info Section (Shown when not approved) */}
      {!isApproved && (
        <section className="bg-gradient-to-br from-gray-900 to-black p-10 md:p-8 rounded-2xl w-[80%] md:w-[70%] mx-auto mt-6 shadow-2xl shadow-yellow-500/20 border border-yellow-500/30 text-center">
          <h1 className="text-4xl md:text-5xl text-yellow-500 font-bold drop-shadow-lg flex items-center justify-center">
            <BarChart3 className="mr-3  filter drop-shadow-2xl shadow-yellow-500" /> Trading View
          </h1>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-sm flex-1 shadow-xl shadow-yellow-500/10 border border-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300">
              <FileText className=" mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-bold text-white">
                Open a Free Trading Account
              </h3>
              <p className="text-gray-300 mt-3 text-base">
                Get access to the International Trading software and start your journey today.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-sm flex-1 shadow-xl shadow-yellow-500/10 border border-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300">
              <Crown className=" mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-bold text-white">
                "We are the Leader of the Leader"
              </h3>
              <p className="text-gray-300 mt-3 text-base">
                Join the pioneers of innovation in the global financial markets.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-sm flex-1 shadow-xl shadow-yellow-500/10 border border-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300">
              <DollarSign className=" mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-bold text-white">
                Market is an Open ATM
              </h3>
              <p className="text-gray-300 mt-3 text-base">
                Opportunities are everywhere — learn to trade and unlock financial possibilities.
              </p>
            </div>
          </div>

          <button
            onClick={requestAdminApproval}
            className="mt-5 px-5 py-4 text-sm md:text-xl font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl shadow-lg shadow-yellow-500/50 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-xl hover:shadow-yellow-500/60 transition-all duration-300"
          >
            Request Admin Approval
          </button>

          {approvalRequested && (
            <div className="mt-6 text-gray-300 text-lg">
              Request sent to admin. Waiting for approval...
            </div>
          )}
        </section>
      )}

      {/* 🔹 TradingView Widget Section */}
      {isApproved && (
        <div
          ref={tradingViewContainer}
          className="tradingview-widget-container h-screen w-screen"
        >
          <div id="tradingview_chart"></div>
        </div>
      )}
    </div>
  );
}
