import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { apiCall } from "../utils/api";
import {
  UserPlus,
  Wallet,
  ArrowDownCircle,
  Users,
  PiggyBank,
  Coins,
  Briefcase,
  DollarSign,
  CreditCard,
  Banknote,
  ArrowRight,
  Copy,
  CheckCircle,
  AlertTriangle,
  X,
  Info,
} from "lucide-react";
import OpenAccount from "./OpenAccount";
import Withdraw from "./Withdraw";

/* --------------------- Modal Wrapper --------------------- */
export const ModalWrapper = ({ title, children, onClose, isDarkMode }) => (
  <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-white/70'} flex items-center justify-center z-50`}>
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg w-[90%] max-w-lg relative`}>
      <h3 className="text-lg font-semibold mb-3 text-[#FFD700] text-center">
        {title}
      </h3>
      <div className="max-h-[80vh] overflow-y-auto">{children}</div>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded font-semibold text-sm"
      >
        ✕
      </button>
    </div>
  </div>
);

/* --------------------- Deposit Modal --------------------- */
const DepositModal = ({ onClose, showToast }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("cheesepay");
  const [currency, setCurrency] = useState("INR");
  const [cheeseAmount, setCheeseAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [selectedDepositAccount, setSelectedDepositAccount] = useState("902165"); // Example ID


  const accounts = [
    { id: "902165", name: "Account 902165" },
    { id: "902166", name: "Account 902166" },
    { id: "902167", name: "Account 902167" },
  ];

  // Currency conversion logic
  useEffect(() => {
    const rate = 83.25; // 1 USD = 83.25 INR
    if (cheeseAmount) {
      if (currency === "USD") {
        setConvertedAmount((cheeseAmount * rate).toFixed(2)); // USD → INR
      } else {
        setConvertedAmount((cheeseAmount / rate).toFixed(2)); // INR → USD
      }
    } else {
      setConvertedAmount("");
    }
  }, [cheeseAmount, currency]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("TBkQunj4UD4Mej7pKyRVAUg5Jgm9aJRCHs");
      showToast("Address copied to clipboard!", "success");
    } catch (err) {
      console.error("Failed to copy: ", err);
      showToast("Failed to copy address!", "error");
    }
  };

  return (
    <ModalWrapper title="💰 Deposit Funds" onClose={onClose} isDarkMode={isDarkMode}>
      {/* Tabs */}
      <div className="flex justify-center gap-4 border-b border-[#FFD700] mb-6">
        {["cheesepay", "manual", "usdt"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-5 font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
              activeTab === tab
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

      {/* Selected Account */}
      <div className="mb-5">
        <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
          Select Account
        </label>
        <select
          value={selectedDepositAccount}
          onChange={(e) => setSelectedDepositAccount(e.target.value)}
          className={`w-full p-3 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-900'} border border-[#FFD700] rounded-lg`}
        >
          <option value="">-- Choose Account --</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      {/* ---------------- Tab Content ---------------- */}
      {activeTab === "cheesepay" && (
        <form className="space-y-4">
          {/* Currency Selection */}
          <div className="flex gap-6 justify-center">
            {["USD", "INR"].map((curr) => (
              <label
                key={curr}
                className={`flex items-center gap-2 cursor-pointer select-none ${
                  currency === curr ? "text-[#FFD700]" : isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="currency"
                  value={curr}
                  checked={currency === curr}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="appearance-none w-5 h-5 border-2 border-[#FFD700] rounded-full
                    checked:bg-[#FFD700] transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                />
                <span className="font-medium">{curr}</span>
              </label>
            ))}
          </div>

          {/* Amount */}
          <input
            type="number"
            placeholder="Enter amount"
            value={cheeseAmount}
            onChange={(e) => setCheeseAmount(e.target.value)}
            className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-lg focus:ring-2 focus:ring-[#FFD700] outline-none transition`}
          />

          {/* Converted */}
          {convertedAmount && (
            <div>
              <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                {currency === "USD"
                  ? "Converted (INR)"
                  : "Converted (USD)"}
              </label>
              <input
                type="text"
                readOnly
                value={
                  currency === "USD"
                    ? `₹ ${convertedAmount}`
                    : `$ ${convertedAmount}`
                }
                className={`w-full p-3 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-900'} border border-[#FFD700]/60 rounded-lg cursor-not-allowed`}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
                Conversion rate: 1 USD = 83.25 INR
              </p>
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

      {activeTab === "manual" && (
        <form className="space-y-4">
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-700'} text-center`}>
            Contact <span className="text-[#FFD700]">Support</span> for Bank Details.
          </p>

          <div className="flex gap-6 justify-center">
            {["USD", "INR"].map((curr) => (
              <label
                key={curr}
                className={`flex items-center gap-2 cursor-pointer select-none ${
                  currency === curr ? "text-[#FFD700]" : isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="currency"
                  value={curr}
                  checked={currency === curr}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="appearance-none w-5 h-5 border-2 border-[#FFD700] rounded-full
                    checked:bg-[#FFD700] transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                />
                <span className="font-medium">{curr}</span>
              </label>
            ))}
          </div>

          <input
            type="number"
            placeholder="Enter amount"
            value={cheeseAmount}
            onChange={(e) => setCheeseAmount(e.target.value)}
            className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-lg focus:ring-2 focus:ring-[#FFD700] outline-none transition`}
          />

          {convertedAmount && (
            <div>
              <label className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                {currency === "INR"
                  ? "Converted (USD)"
                  : "Converted (INR)"}
              </label>
              <input
                type="text"
                readOnly
                value={
                  currency === "USD"
                    ? `₹ ${convertedAmount}`
                    : `$ ${convertedAmount}`
                }
                className={`w-full p-3 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-900'} border border-[#FFD700]/60 rounded-lg cursor-not-allowed`}
              />
            </div>
          )}

          <input
            type="file"
            className={`w-full ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} file:mr-2 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-[#FFD700] file:text-black hover:file:bg-white transition`}
          />

          <button
            type="submit"
            className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-white transition-all"
          >
            Submit
          </button>
        </form>
      )}

      {activeTab === "usdt" && (
        <form className="space-y-4">
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
            Send <span className="text-[#FFD700]">USDT (TRC20)</span> to:
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
            className={`w-full p-3 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} border border-[#FFD700] rounded-lg`}
          />

          <input
            type="file"
            required
            className={`w-full ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} file:mr-2 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-[#FFD700] file:text-black hover:file:bg-white transition`}
          />

          <button
            type="submit"
            className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-white transition-all"
          >
            Submit USDT Deposit
          </button>
        </form>
      )}
    </ModalWrapper>
  );
};

/* --------------------- Withdraw & Open Account --------------------- */
const WithdrawModal = ({ onClose }) => {
  return <Withdraw onClose={onClose}/>
};

/* --------------------- Open Account Modal --------------------- */
const OpenAccountModal = ({ onClose }) => {
  return <OpenAccount onClose={onClose} />;
};


/* --------------------- Dashboard --------------------- */
const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [activeModal, setActiveModal] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stats, setStats] = useState({
    live: 0,
    demo: 0,
    realBalance: 0,
    clients: 0,
    deposits: 0,
    mamFunds: 0,
    mamManaged: 0,
    ibEarnings: 0,
    withdrawable: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiCall('stats-overview/');
        setStats({
          live: data.live_accounts || 0,
          demo: data.demo_accounts || 0,
          realBalance: data.real_balance || 0,
          clients: data.total_clients || 0,
          deposits: data.total_deposits || 0,
          mamFunds: data.mam_investments || 0,
          mamManaged: data.mam_managed_funds || 0,
          ibEarnings: data.total_earnings || 0, 
          withdrawable: data.commission_balance || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to mock data if API fails
        setStats({
          live: 2,
          demo: 3,
          realBalance: 1560,
          clients: 5,
          deposits: 7200,
          mamFunds: 3000,
          mamManaged: 5000,
          ibEarnings: 150,
          withdrawable: 120,
        });
      }
    };

    const fetchRecentTransactions = async () => {
      try {
        const data = await apiCall('recent-transactions/');
        setRecentTransactions(data.transactions || []);
      } catch (error) {
        console.error('Failed to fetch recent transactions:', error);
        // Fallback to mock data if API fails
        setRecentTransactions([
          { type: "Deposit", amount: 100.00, date: "2025-11-11T12:38:43" },
          { type: "Withdraw", amount: -50.50, date: "2025-11-11T12:38:43" }
        ]);
      }
    };

    fetchStats();
    fetchRecentTransactions();
  }, []);

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  // Toast notification
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3200);
  };

  const buttonSet = [
    { label: "Open", icon: UserPlus, action: "open" },
    { label: "Deposit", icon: Wallet, action: "deposit" },
    { label: "Withdraw", icon: ArrowDownCircle, action: "withdraw" },
  ];

  const statItems = [
    { label: "Live Accounts", value: stats.live, icon: UserPlus },
    { label: "Demo Accounts", value: stats.demo, icon: Wallet },
    { label: "Real Balance (USD)", value: `$${stats.realBalance}`, icon: DollarSign },
    { label: "Total Clients (IB)", value: stats.clients, icon: Users },
    { label: "Overall Deposits", value: `$${stats.deposits}`, icon: PiggyBank },
    { label: "MAM Funds Invested", value: `$${stats.mamFunds}`, icon: Coins },
    { label: "MAM Managed Funds", value: `$${stats.mamManaged}`, icon: Briefcase },
    { label: "IB Earnings", value: `$${stats.ibEarnings}`, icon: CreditCard },
    { label: "Withdrawable", value: `$${stats.withdrawable}`, icon: Banknote },
  ];

  return (
    <div className={`h-[100%] ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col w-full text-[18px] overflow-hidden`}>
      <main className={`flex-1 p-4 ${isDarkMode ? 'bg-black' : 'bg-white'} w-full overflow-y-auto sm:overflow-y-visible`}>
        {/* Buttons */}
        <div className="flex justify-evenly items-center gap-3 md:flex-row flex-col mb-6 flex-wrap">
          {buttonSet.map((btn, i) => (
            <button
              key={i}
              onClick={() => openModal(btn.action)}
              className={`bg-yellow-500 w-80 ${isDarkMode ? 'text-black' : 'text-white'} font-semibold px-4 py-2 rounded-md hover:bg-yellow-400 shadow-sm hover:shadow-[0_0_10px_rgba(255,215,0,0.6)] h-[46px] text-[15px] transition-all duration-200 flex items-center justify-center gap-2`}
            >
              <btn.icon className={`w-5 h-5 ${isDarkMode ? 'text-black' : 'text-white'}`} />
              {btn.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {statItems.map((box, i) => (
            <div
              key={i}
              className={`rounded-lg p-4 text-center ${isDarkMode ? 'bg-gradient-to-b from-gray-700 to-black' : 'bg-gradient-to-b from-gray-100 to-white'} shadow-md h-[120px] w-full mx-auto hover:shadow-[0_0_12px_rgba(255,215,0,0.5)] transition-all duration-200 flex flex-col items-center justify-center`}
            >
              <box.icon className="w-8 h-8 mb-2 text-yellow-400" />
              <strong className={`block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{box.label}</strong>
              <span className="block text-[18px] font-semibold mt-1 text-yellow-400">
                {box.value}
              </span>
            </div>
          ))}
        </div>

         {/* Recent Activity */}
        <div className="mt-8 pl-2 w-full mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-yellow-400">Recent Activity</h3>
            <button
              className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-all duration-200"
              onClick={() => showToast("View more activity clicked!", "info")}
            >
              View More →
            </button>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-md shadow-md p-4 space-y-3 text-[15px]`}>
            {recentTransactions.map((item, i) => {
              const isDeposit = item.amount > 0;
              const color = isDeposit ? "text-green-400" : "text-red-400";
              const amount = isDeposit ? `+$${item.amount}` : `-$${Math.abs(item.amount)}`;
              const date = new Date(item.date).toLocaleString();
              return (
                <div
                  key={i}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-3 rounded-md hover:shadow-[0_0_10px_rgba(255,215,0,0.4)] transition-all duration-200 flex justify-between items-center`}
                >
                  <p>
                    <span className="font-bold text-yellow-400">{item.type}:</span>{" "}
                    <span className={`${color}`}>{amount}</span> ({date})
                  </p>
                  <ArrowRight className="w-4 h-4 text-yellow-400" />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal === "deposit" && <DepositModal onClose={closeModal} showToast={showToast} isDarkMode={isDarkMode} />}
      {activeModal === "withdraw" && <WithdrawModal onClose={closeModal} />}
      {activeModal === "open" && <OpenAccountModal onClose={closeModal} />}

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${isDarkMode ? 'text-white' : 'text-black'} transition-all duration-300 ${
              notification.type === 'success'
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
  );
};

export default Dashboard;
