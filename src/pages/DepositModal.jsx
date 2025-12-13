import React, { useState } from "react";
import { Copy, CheckCircle, X, AlertTriangle, Info } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getAuthHeaders, getCookie, handleUnauthorized, API_BASE_URL, apiCall } from "../utils/api";
import { sharedUtils } from "../utils/shared-utils";

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
  usdtAmount,
  setUsdtAmount,
}) {
  const { isDarkMode } = useTheme();
  const [proofFile, setProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usdInrRate, setUsdInrRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const [usdtProof, setUsdtProof] = useState(null);
  const [isSubmittingUsdt, setIsSubmittingUsdt] = useState(false);
  const [isSubmittingCheesePay, setIsSubmittingCheesePay] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Toast notification
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3200);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("TBkQunj4UD4Mej7pKyRVAUg5Jgm9aJRCHs");
      showToast("Address copied to clipboard!", "success");
    } catch (err) {
      console.error("Failed to copy: ", err);
      showToast("Failed to copy address to clipboard!", "error");
    }
  };

  const fetchUsdInrRate = async () => {
    setLoadingRate(true);
    try {
      const response = await apiCall("get-usd-inr-rate/");
      const data = await response.json();
      setUsdInrRate(data.rate);
      console.log(data.rate)
    } catch (error) {
      console.error("Failed to fetch USD to INR rate:", error);
      // Fallback rate if API fails
      setUsdInrRate(88.6855);
    } finally {
      setLoadingRate(false);
    }
  };

  const handleManualDepositSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDepositAccount || !cheeseAmount || !proofFile) {
      sharedUtils.showToast("Please fill in all required fields.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('mam_id', selectedDepositAccount);
      // Convert amount to USD before posting
      const usdAmount = currency === "INR" ? parseFloat(cheeseAmount) / usdInrRate : parseFloat(cheeseAmount);
      formData.append('amount', usdAmount.toFixed(2));
      formData.append('proof', proofFile);

      const url = `manual-deposit/`.startsWith('http') ? `manual-deposit/` : `${API_BASE_URL}manual-deposit/`;
      const headers = { ...getAuthHeaders() };
      delete headers['Content-Type']; // Remove for multipart
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }
      const config = {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include'
      };

      const response = await fetch(url, config);
      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        throw new Error('Unauthorized access');
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      await response.json(); // Assuming it returns JSON, but not used here

      sharedUtils.showToast("Manual deposit request submitted successfully!", "success");
      setShowDepositModal(false);
      setCheeseAmount("");
      setProofFile(null);
    } catch (error) {
      console.error('Failed to submit manual deposit:', error);
      sharedUtils.showToast("Failed to submit deposit request. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  React.useEffect(() => {
    if (showDepositModal) {
      fetchUsdInrRate();
    }
  }, [showDepositModal]);

  return (
    <>
      {showDepositModal && (
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/50' : 'bg-white/70'} flex items-center justify-center z-50`}>
          <div className={`${isDarkMode ? 'bg-[#111]' : 'bg-white'} border border-[#FFD700] rounded-2xl w-[90%] max-w-xl p-6 relative shadow-2xl`}>
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
                      : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
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
              <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
                Account ID
              </label>
              <input
                type="text"
                value={selectedDepositAccount || "No account selected"}
                readOnly
                className={`w-full p-3 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-900'} border border-[#FFD700] rounded-lg cursor-not-allowed`}
              />
            </div>

            {/* Tab Content */}
            <div className={`${isDarkMode ? 'text-white' : 'text-black'} space-y-5`}>
              {/* CheesePay Section */}
              {activeTab === "cheesepay" && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!selectedDepositAccount || !cheeseAmount) {
                      sharedUtils.showToast("Please fill in all required fields.", "error");
                      return;
                    }

                    setIsSubmittingCheesePay(true);
                    try {
                      const amount_usd = currency === "INR" ? (parseFloat(cheeseAmount) / usdInrRate).toFixed(2) : parseFloat(cheeseAmount).toFixed(2);
                      const amount_inr = currency === "USD" ? (parseFloat(cheeseAmount) * usdInrRate).toFixed(2) : parseFloat(cheeseAmount).toFixed(2);

                      const url = `cheesepay-initiate/`.startsWith('http') ? `cheesepay-initiate/` : `${API_BASE_URL}cheesepay-initiate/`;
                      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
                      const csrfToken = getCookie('csrftoken');
                      if (csrfToken) {
                        headers['X-CSRFToken'] = csrfToken;
                      }
                      const config = {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                          account_id: selectedDepositAccount,
                          amount_usd,
                          amount_inr
                        }),
                        credentials: 'include'
                      };

                      const response = await fetch(url, config);
                      if (response.status === 401 || response.status === 403) {
                        handleUnauthorized();
                        throw new Error('Unauthorized access');
                      }
                      if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                      }
                      const data = await response.json();

                      if (data.success && data.payment_url) {
                        window.location.href = data.payment_url;
                      } else {
                        throw new Error(data.error || 'Failed to initiate CheesePay payment');
                      }
                    } catch (error) {
                      console.error('Failed to initiate CheesePay deposit:', error);
                      sharedUtils.showToast("Failed to initiate CheesePay payment. Please try again.", "error");
                    } finally {
                      setIsSubmittingCheesePay(false);
                    }
                  }}
                  className="space-y-4"
                >
                  {/* Currency Selection (Styled Radios) */}
                  <div className="flex gap-6 justify-center">
                    {["USD", "INR"].map((curr) => (
                      <label
                        key={curr}
                        className={`flex items-center gap-2 cursor-pointer select-none ${currency === curr ? "text-[#FFD700]" : isDarkMode ? "text-gray-400" : "text-gray-600"
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

                  {loadingRate && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'} text-sm`}>
                        ⚠️ Exchange rate not available. Please wait while we fetch the exchange rate to use CheesePay.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                      {currency === "USD" ? "USD Amount (USD)" : "INR Amount (₹)"}
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={cheeseAmount}
                      onChange={(e) => setCheeseAmount(e.target.value)}
                      required
                      className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-lg focus:ring-2 focus:ring-[#FFD700] outline-none transition`}
                    />
                  </div>

                  {cheeseAmount && usdInrRate && (
                    <div>
                      <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                        {currency === "INR" ? "Converted (USD)" : "Converted (INR)"}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={
                          currency === "USD"
                            ? `₹ ${(parseFloat(cheeseAmount) * usdInrRate).toFixed(2)}`
                            : `$ ${(parseFloat(cheeseAmount) / usdInrRate).toFixed(2)}`
                        }
                        placeholder="Auto converted amount"
                        className={`w-full p-3 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-900'} border border-[#FFD700]/60 rounded-lg cursor-not-allowed`}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingCheesePay}
                    className={`w-full ${isSubmittingCheesePay ? 'bg-gray-500' : 'bg-[#FFD700]'} text-black font-semibold py-3 rounded-lg hover:bg-white transition-all ${isSubmittingCheesePay ? 'cursor-not-allowed' : ''}`}
                  >
                    {isSubmittingCheesePay ? "Processing..." : "Confirm & Proceed"}
                  </button>
                </form>
              )}

              {/* Manual Deposit Section */}
              {activeTab === "manual" && (
                <form onSubmit={handleManualDepositSubmit} className="space-y-4">
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-700'} text-center`}>
                    Contact <span className="text-[#FFD700]">Support</span> for Bank
                    Details.
                  </p>

                  <div className="flex gap-6 justify-center">
                    {["USD", "INR"].map((curr) => (
                      <label
                        key={curr}
                        className={`flex items-center gap-2 cursor-pointer select-none ${currency === curr ? "text-[#FFD700]" : isDarkMode ? "text-gray-400" : "text-gray-600"
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
                      required
                      className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-lg focus:ring-2 focus:ring-[#FFD700] outline-none transition`}
                    />
                  </div>

                  {cheeseAmount && usdInrRate && (
                    <div>
                      <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                        {currency === "INR" ? "Converted (USD)" : "Converted (INR)"}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={
                          currency === "USD"
                            ? `₹ ${(parseFloat(cheeseAmount) * usdInrRate).toFixed(2)}`
                            : `$ ${(parseFloat(cheeseAmount) / usdInrRate).toFixed(2)}`
                        }
                        placeholder="Auto converted amount"
                        className={`w-full p-3 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-900'} border border-[#FFD700]/60 rounded-lg cursor-not-allowed`}
                      />
                    </div>
                  )}

                  <div>
                    <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
                      Upload Proof of Payment *
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setProofFile(e.target.files[0])}
                      required
                      className={`w-full ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} file:mr-2 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-[#FFD700] file:text-black hover:file:bg-white transition`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${isSubmitting ? 'bg-gray-500' : 'bg-[#FFD700]'} text-black font-semibold py-3 rounded-lg hover:bg-white transition-all ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Manual Deposit"}
                  </button>
                </form>
              )}

              {/* USDT Section */}
              {activeTab === "usdt" && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!selectedDepositAccount || !usdtAmount || !usdtProof) {
                      sharedUtils.showToast("Please fill in all required fields.", "error");
                      return;
                    }

                    setIsSubmittingUsdt(true);
                    try {
                      const formData = new FormData();
                      formData.append('mam_id', selectedDepositAccount);
                      formData.append('amount', usdtAmount);
                      formData.append('proof', usdtProof);

                      await apiCall('usdt-deposit/', 'POST', formData);

                      sharedUtils.showToast("USDT deposit request submitted successfully!", "success");
                      setShowDepositModal(false);
                      setUsdtAmount("");
                      setUsdtProof(null);
                    } catch (error) {
                      console.error('Failed to submit USDT deposit:', error);
                      sharedUtils.showToast("Failed to submit USDT deposit request. Please try again.", "error");
                    } finally {
                      setIsSubmittingUsdt(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Send <span className="text-[#FFD700]">USDT (TRC20)</span> to this
                    address:
                  </p>
                  <div className={`relative p-3 border border-[#FFD700] rounded-lg text-center text-sm break-all ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}>
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
                    value={usdtAmount}
                    onChange={(e) => setUsdtAmount(e.target.value)}
                    required
                    className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-lg focus:ring-2 focus:ring-[#FFD700] outline-none transition`}
                  />

                  <div>
                    <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
                      Upload Proof of Payment *
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setUsdtProof(e.target.files[0])}
                      required
                      className={`w-full ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} file:mr-2 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-[#FFD700] file:text-black hover:file:bg-white transition`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingUsdt}
                    className={`w-full ${isSubmittingUsdt ? 'bg-gray-500' : 'bg-[#FFD700]'} text-black font-semibold py-3 rounded-lg hover:bg-white transition-all ${isSubmittingUsdt ? 'cursor-not-allowed' : ''}`}
                  >
                    {isSubmittingUsdt ? "Submitting..." : "Submit USDT Deposit"}
                  </button>
                </form>
              )}
            </div>
          </div>
          {/* Toast Notifications */}
          <div className="fixed top-20 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${isDarkMode ? 'text-white' : 'text-black'} transition-all duration-300 ${notification.type === 'success'
                  ? 'bg-green-600'
                  : notification.type === 'error'
                    ? 'bg-red-600'
                    : notification.type === 'warning'
                      ? 'bg-yellow-600'
                      : 'bg-blue-600'
                  }`}
              >
                {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {notification.type === 'error' && <X className="w-5 h-5" />}
                {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {notification.type === 'info' && <Info className="w-5 h-5" />}
                <span className="text-sm font-medium">{notification.message}</span>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className={`ml-auto ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'} transition-colors`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
