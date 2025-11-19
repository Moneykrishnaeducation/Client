import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CreditCard,
  DownloadCloud,
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../utils/api';

// Main Tree Component
const ClientTree = ({ clients, level = 1 }) => {
  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <ClientItem key={client.id} client={client} level={level} />
      ))}
    </div>
  );
};

// Individual Client Component
const ClientItem = ({ client, level }) => {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  const openModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isExpanded]);

  // Example accounts
  const accounts = [
    {
      id: "2141713014",
      type: "demo",
      group: "group1",
      lots: 0.01,
      deposits: "$0.00",
      withdrawals: "$0.00",
      commission: "$0.04",
      transactions: []
    },
    {
      id: "2141713006",
      type: "standard",
      group: "group1",
      lots: 0.04,
      deposits: "$50.00",
      withdrawals: "$0.00",
      commission: "$0.2",
      transactions: []
    },
  ];

  return (
    <div className={`border-b border-yellow-200 rounded-md p-3 ${isDarkMode ? 'bg-black' : 'bg-white'} shadow-sm hover:shadow-lg transition-shadow duration-300`}>
      {/* Client Header */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-yellow-500/10 p-2 rounded-md transition-all"
        onClick={toggleExpand}
      >
        {/* Client Info */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full">
          <span className={`${isDarkMode ? 'text-yellow-300' : 'text-black'} font-semibold`}>{client.username}</span>
          <span className={`${isDarkMode ? 'text-yellow-200' : 'text-gray-600'} text-sm`}>{client.email}</span>
          <span className={`${isDarkMode ? 'text-yellow-200' : 'text-gray-600'} text-sm`}>{client.phone}</span>
        </div>

        {/* Level and Expand/Collapse / Modal */}
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            L{level}
          </span>
          <button
            onClick={openModal}
            className="text-yellow-400 font-semibold text-sm hover:underline"
          >
            View Accounts
          </button>
          {client.children?.length > 0 && (
            <span className="text-yellow-400 font-semibold text-sm">
              {isExpanded ? '▲' : '▼'}
            </span>
          )}
        </div>
      </div>

      {/* Smooth Children */}
      <div
        ref={contentRef}
        style={{ maxHeight, transition: 'max-height 0.3s ease', overflow: 'hidden' }}
        className="ml-0 sm:ml-6 mt-2"
      >
        {isExpanded && client.children?.length > 0 && (
          <ClientTree clients={client.children} level={level + 1} />
        )}
      </div>

      {/* Modal for Accounts */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} rounded-lg p-6 w-full max-w-4xl overflow-auto max-h-[80vh] relative`}>
            <button
              className="absolute top-3 right-3 text-yellow-500 font-bold"
              onClick={closeModal}
            >
              ✖
            </button>
            <h2 className="text-yellow-300 text-lg font-semibold mb-4">
              Accounts for {client.username}
            </h2>
            <table className="w-full text-yellow-200 border border-yellow-500">
              <thead>
                <tr className="border-b border-yellow-500">
                  <th className="px-2 py-1 text-left">Account ID</th>
                  <th className="px-2 py-1 text-left">Type</th>
                  <th className="px-2 py-1 text-left">Group</th>
                  <th className="px-2 py-1 text-left">Total Lots</th>
                  <th className="px-2 py-1 text-left">Total Deposits</th>
                  <th className="px-2 py-1 text-left">Total Withdrawals</th>
                  <th className="px-2 py-1 text-left">Commission Earned</th>
                  <th className="px-2 py-1 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.id} className={`border-b border-yellow-500 hover:bg-yellow-500/10 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <td className="px-2 py-1">{acc.id}</td>
                    <td className="px-2 py-1">{acc.type}</td>
                    <td className="px-2 py-1">{acc.group}</td>
                    <td className="px-2 py-1">{acc.lots}</td>
                    <td className="px-2 py-1">{acc.deposits}</td>
                    <td className="px-2 py-1">{acc.withdrawals}</td>
                    <td className="px-2 py-1">{acc.commission}</td>
                    <td>
                      <button
                        className="text-yellow-400 cursor-pointer font-semibold"
                        onClick={() => {
                          setSelectedAccount(acc);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Nested Modal for Account Details */}
      {isDetailModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-60">
          <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} rounded-lg p-6 w-full max-w-5xl overflow-auto max-h-[80vh]`}>
            <button
              className="absolute top-3 right-3 text-yellow-500 font-bold"
              onClick={() => setIsDetailModalOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-yellow-300 text-2xl font-bold mb-6 text-center">
              Details for Account {selectedAccount.id}
            </h2>
            <p className="text-center text-yellow-200">No transactions available</p>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalClients: 0,
    directClients: 0,
    totalEarnings: 0,
    totalWithdrawals: 0,
    commissionBalance: 0,
    currentMonthEarnings: 0,
    currentMonthVolume: 0,
    totalVolume: 0,
    referralLink: '',
    earningsPerClient: [],
    earningsPerMonth: [],
  });
  const [referralLink, setReferralLink] = useState('');
  const [commissionData, setCommissionData] = useState([]);
  const [tradingAccounts, setTradingAccounts] = useState([]);
  const [withdrawalData, setWithdrawalData] = useState([]);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [error, setError] = useState("");
  const [commissionError, setCommissionError] = useState("");

  const tabs = [
    { name: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'Client', icon: <Users size={16} /> },
    { name: 'Commission', icon: <CreditCard size={16} /> },
    { name: 'Withdraw', icon: <DollarSign size={16} /> },
  ];

  const clientData = [
    {
      id: 1,
      username: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 890',
      children: [
        {
          id: 2,
          username: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1 111 222 333',
          children: [],
        },
      ],
    },
    {
      id: 3,
      username: 'Sarah Lee',
      email: 'sarah@example.com',
      phone: '+1 222 333 444',
      children: [
        {
          id: 4,
          username: 'Tom Clark',
          email: 'tom@example.com',
          phone: '+1 777 888 999',
          children: [],
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiCall("/ib/stats/");
        console.log("Dashboard data:", data);
        setDashboardData({
          totalClients: data.total_clients,
          directClients: data.direct_clients,
          totalEarnings: data.total_earnings,
          totalWithdrawals: data.total_withdrawals,
          commissionBalance: data.commission_balance,
          currentMonthEarnings: data.current_month_earnings,
          currentMonthVolume: data.current_month_volume_traded,
          totalVolume: data.total_volume_traded,
          referralLink: data.referralLink,
          earningsPerClient: data.earnings_per_client,
          earningsPerMonth: data.earnings_per_month,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchReferralLink = async () => {
      try {
        const data = await apiCall("client/api/ib/referral-link/");
        console.log("Referral link data:", data);
        setReferralLink(data.referral_link || data.link || data.url || data);
      } catch (err) {
        console.error("Failed to fetch referral link:", err);
      }
    };

    fetchDashboardData();
    fetchReferralLink();
  }, []);

  useEffect(() => {
    if (activeTab === 'Commission') {
      const fetchCommissionData = async () => {
        setCommissionLoading(true);
        setCommissionError("");
        try {
          const data = await apiCall("client/ib/commission-transactions/");
          console.log("Commission data:", data);
          setCommissionData(data);
        } catch (err) {
          console.error("Failed to fetch commission data:", err);
          setCommissionError(err.message || "An error occurred");
        } finally {
          setCommissionLoading(false);
        }
      };

      fetchCommissionData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'Withdraw') {
      const fetchWithdrawalData = async () => {
        setWithdrawalLoading(true);
        setWithdrawalError("");
        try {
          const data = await apiCall("client/ib/transactions/");
          console.log("Withdrawal data:", data);
          setWithdrawalData(data);
        } catch (err) {
          console.error("Failed to fetch withdrawal data:", err);
          setWithdrawalError(err.message || "An error occurred");
        } finally {
          setWithdrawalLoading(false);
        }
      };

      const fetchTradingAccounts = async () => {
        try {
          const data = await apiCall("client/api/user-trading-accounts/");
          console.log("Trading accounts:", data);
          setTradingAccounts(data);
        } catch (err) {
          console.error("Failed to fetch trading accounts:", err);
        }
      };

      fetchWithdrawalData();
      fetchTradingAccounts();
    }
  }, [activeTab]);

  const handleWithdrawalSubmit = async () => {
    if (!selectedAccount || !amount) {
      alert("Please select an account and enter an amount.");
      return;
    }
    try {
      const response = await apiCall("client/ib/transactions/", {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(amount),
          account_id: selectedAccount,
          comment: comment || "",
        }),
      });
      console.log("Withdrawal request submitted:", response);
      alert("Withdrawal request submitted successfully.");
      setAmount("");
      setComment("");
      setSelectedAccount("");
      // Optionally refetch data
      const data = await apiCall("client/ib/transactions/");
      setWithdrawalData(data);
    } catch (err) {
      console.error("Failed to submit withdrawal:", err);
      alert("Failed to submit withdrawal: " + (err.message || "An error occurred"));
    }
  };



  return (
    <div className={`p-6 ${isDarkMode ? 'bg-black text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-4 mb-8 w-full max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-md font-semibold transition-all shadow-lg w-full sm:w-auto
              ${activeTab === tab.name
                ? 'bg-yellow-500 text-black'
                : `${isDarkMode ? 'bg-black' : 'bg-white'} text-yellow-500 hover:bg-yellow-500 hover:text-black`
              }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>




{activeTab === "Dashboard" && (
  <>
    {loading && <p>Loading...</p>}
    {error && <p className="text-red-500">{error}</p>}
    {!loading && !error && (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Total Clients", value: dashboardData.totalClients },
            { label: "Direct Clients", value: dashboardData.directClients },
            { label: "Total Earnings", value: dashboardData.totalEarnings },
            { label: "Total Withdrawals", value: dashboardData.totalWithdrawals },
            { label: "Commission Balance", value: dashboardData.commissionBalance },
            { label: "Current Month Earnings", value: dashboardData.currentMonthEarnings },
            { label: "Current Month Volume Traded (Lots)", value: dashboardData.currentMonthVolume },
            { label: "Total Volume Traded (Lots)", value: dashboardData.totalVolume },
          ].map((item, index) => (
            <div
              key={index}
              className={`${isDarkMode ? 'bg-black' : 'bg-white'} p-4 rounded-md shadow-lg border border-yellow-500 flex flex-col items-center justify-center text-center`}
            >
              <h3 className="text-yellow-400 font-semibold mb-1 text-sm">{item.label}</h3>
              <p className="text-xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Commission Earnings Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div
            className={`${isDarkMode ? 'bg-black' : 'bg-white'} p-4 rounded-md shadow-md border-2 border-dashed border-yellow-300 border-opacity-50 flex flex-col items-center justify-center text-center transition-all transform hover:scale-105 hover:shadow-[0_0_20px_#FFAA00]`}
          >
            <h3 className={`${isDarkMode ? 'text-white' : 'text-black'} font-bold mb-1 text-sm`}>
              Monthly Commission Earnings
            </h3>
            <p className="text-xl font-bold text-yellow-300">--</p>
          </div>
          <div
            className={`${isDarkMode ? 'bg-black' : 'bg-white'} p-4 rounded-md shadow-md border-2 border-dashed border-yellow-300 border-opacity-50 flex flex-col items-center justify-center text-center transition-all transform hover:scale-105 hover:shadow-[0_0_20px_#FFAA00]`}
          >
            <h3 className={`${isDarkMode ? 'text-white' : 'text-black'} font-bold mb-1 text-sm`}>
              Commission Earnings Per Client
            </h3>
            <p className="text-yellow-300 text-xs mb-2">Top 10 clients by commission earnings</p>
            <p className="text-xl font-bold text-yellow-300">--</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center border-2 border-yellow-500 rounded-lg p-3">
          <span className="text-yellow-400 font-semibold text-sm">Referral Link:</span>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 text-sm break-all">{referralLink || dashboardData.referralLink}</span>
            <div className="flex gap-1">
              <button
                onClick={() => navigator.clipboard.writeText(referralLink || dashboardData.referralLink)}
                className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold hover:bg-yellow-400"
              >
                📋 Copy
              </button>
              <button
                onClick={() => window.open(referralLink || dashboardData.referralLink, '_blank')}
                className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold hover:bg-yellow-400"
              >
                🔗 Open
              </button>
            </div>
          </div>
        </div>
      </>
    )}
  </>
)}


 {/* Client Tab */}
{activeTab === 'Client' && (
  <>
    {/* Search + Action Buttons */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
      {/* Left: Search */}
      <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-black' : 'bg-white'} border border-yellow-500 rounded-md px-3 py-2 w-auto max-w-[400px] sm:w-1/2`}>
        <Search size={14} className="text-yellow-500" />
        <input
          type="text" 
          placeholder="Search clients..."
          className={`${isDarkMode ? 'bg-black text-yellow-300' : 'bg-white text-black'} placeholder-yellow-400 focus:outline-none w-full text-sm py-0.5`}
        />
      </div>

      {/* Right: Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
          <DownloadCloud size={16} /> Download
        </button>

        <button
          className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
          onClick={() => setShowAddUserForm(true)}
        >
          <UserPlus size={16} /> Add User
        </button>
      </div>
    </div>


      {/* Client Tab */}
      {activeTab === 'Client' && (
        <>
          <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} p-2 rounded-md border-yellow-500 shadow-md hover:shadow-[0_4px_15px_rgba(255,215,0,0.4)] transition-shadow duration-300`}>
            <h2 className="text-yellow-400 text-lg font-bold mb-4">Client Tree</h2>
            <ClientTree clients={clientData} level={1} />
          </div>
        </>
      )}
      {/* Per Page + Pagination below the tree */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 w-full">
        {/* Per Page */}
        <div className="flex items-center gap-2">
          <label className="text-yellow-400 text-sm font-semibold">Per Page:</label>
          <select className={`${isDarkMode ? 'bg-black' : 'bg-white'} text-yellow-300 border border-yellow-500 rounded-md px-2 py-1 focus:outline-none`}>
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center bg-yellow-500 text-black px-2 py-1 rounded-md hover:bg-yellow-400 shadow-md transition-all">
            <ChevronLeft size={16} />
          </button>
          <span className="text-yellow-300 font-semibold text-sm">Page 1 of 10</span>
          <button className="flex items-center justify-center bg-yellow-500 text-black px-2 py-1 rounded-md hover:bg-yellow-400 shadow-md transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    

    {/* Add User Form Modal */}
    {showAddUserForm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} p-6 rounded-md border border-yellow-500 shadow-lg w-full max-w-md relative`}>
          {/* Close Button */}
          <button
            onClick={() => setShowAddUserForm(false)}
            className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-400 text-lg font-bold"
          >
            ✖
          </button>

          <h3 className="text-yellow-400 font-semibold mb-4 text-lg">Add New User</h3>
          <form className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              className="px-3 py-2 rounded-md border border-yellow-500   focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="px-3 py-2 rounded-md border border-yellow-500   focus:outline-none"
            />
            <input
              type="text"
              placeholder="Phone"
              className="px-3 py-2 rounded-md border border-yellow-500   focus:outline-none"
            />
            <input
              type="date"
              placeholder="DOB"
              className="px-3 py-2 rounded-md border border-yellow-500   focus:outline-none"
            />
            <select className={`px-3 py-2 rounded-md border border-yellow-500 focus:outline-none ${isDarkMode ? 'bg-black text-yellow-200' : 'bg-white text-black'}`}>
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="IN">India</option>
              {/* Add more countries as needed */}
            </select>
            <button
              type="submit"
              className="bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )}
  </>
)}

    

      {/* Commission Tab */}
      {activeTab === 'Commission' && (
        <div className={`${isDarkMode ? 'bg-black text-yellow-200' : 'bg-white text-black'}rounded-xl shadow-2xl border-yellow-500 p-2 space-y-4 transition-shadow`}>
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
  <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-black' : 'bg-white'} border border-yellow-500 rounded-md px-3 py-2 w-auto max-w-[400px] sm:w-1/2`}>
    <Search size={16} className="text-yellow-500" />
    <input
      type="text"
      placeholder="Search..."
      className={`${isDarkMode ? 'bg-black text-yellow-300' : 'bg-white text-black'} placeholder-yellow-400 focus:outline-none w-[120px] sm:w-full`}
    />
  </div>


            <button className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all mt-2 sm:mt-0 w-full sm:w-auto justify-center">
              <DownloadCloud size={16} /> Download
            </button>
          </div>

          {/* Commission Table */}
<div className="w-full overflow-x-auto sm:px-2 px-2 mt-6">
  <div className="inline-block min-w-full border-yellow-500 rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]">
    <table className={`min-w-full border-collapse border-yellow-500 text-center ${isDarkMode ? 'text-yellow-300' : 'text-black'}`}>
              <thead>
                <tr className={`${isDarkMode ? 'bg-black text-yellow-300' : 'bg-white text-black'} border-b-2 border-yellow-500`}>
                  <th className="px-4 py-2">S.No</th>
                  <th className="px-4 py-2">Position ID</th>
                  <th className="px-4 py-2">Deal Ticket</th>
                  <th className="px-4 py-2">Client</th>
                  <th className="px-4 py-2">Trading Account</th>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Volume</th>
                  <th className="px-4 py-2">P/L</th>
                  <th className="px-4 py-2">Commission to IB</th>
                  <th className="px-4 py-2">MT5 Close Time</th>
                  <th className="px-4 py-2">Commission Created</th>
                </tr>
              </thead>
              <tbody>
                {commissionLoading && (
                  <tr>
                    <td colSpan="11" className="px-4 py-2 text-center">Loading...</td>
                  </tr>
                )}
                {commissionError && (
                  <tr>
                    <td colSpan="11" className="px-4 py-2 text-center text-red-500">{commissionError}</td>
                  </tr>
                )}
                {!commissionLoading && !commissionError && commissionData.length === 0 && (
                  <tr>
                    <td colSpan="11" className="px-4 py-2 text-center">No data found</td>
                  </tr>
                )}
                {!commissionLoading && !commissionError && commissionData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{row.position_id}</td>
                    <td className="px-4 py-2">{row.deal_ticket}</td>
                    <td className="px-4 py-2">{row.client}</td>
                    <td className="px-4 py-2">{row.trading_account}</td>
                    <td className="px-4 py-2">{row.symbol}</td>
                    <td className="px-4 py-2">{row.volume}</td>
                    <td className="px-4 py-2">{row.pl}</td>
                    <td className="px-4 py-2">{row.commission_to_ib}</td>
                    <td className="px-4 py-2">{row.mt5_close_time}</td>
                    <td className="px-4 py-2">{row.commission_created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
</div>
          </div>
        </div>
      )}

      {/* Withdraw Tab */}
{activeTab === 'Withdraw' && (
  <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} rounded-xl shadow-2xl border-yellow-500 p-6 space-y-6 transition-shadow`}>
    {/* Balance Display */}
    <div className="text-center flex flex-col items-center">
      <h2 className="text-xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
        Balance
        <DollarSign
          className="text-yellow-400"
          style={{
            display: 'inline-block',
            transformStyle: 'preserve-3d',
            animation: 'rollDollar 3s linear infinite',
          }}
        />
      </h2>
      <p className="text-3xl font-extrabold text-white">${dashboardData.commissionBalance}</p>

      <style>
        {`
          @keyframes rollDollar {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
          }
        `}
      </style>
    </div>

 {/* Trading Account Select + Amount + Comment */}
<div className="flex flex-col gap-4">
  <div className="flex flex-col sm:flex-row items-center w-full gap-4 sm:gap-0 justify-between">
    {/* Left: Select */}
    <div className="w-full sm:w-1/3">
      <select
        value={selectedAccount}
        onChange={(e) => setSelectedAccount(e.target.value)}
        className={` ${isDarkMode ? 'bg-black text-yellow-300 hover:bg-gray-900' : 'bg-white text-black hover:bg-gray-100'} p-3 rounded-md border border-yellow-500 w-full transition-colors`}
      >
        <option value="">Select Trading Account</option>
        {Array.isArray(tradingAccounts) && tradingAccounts.length > 0 ? (
          tradingAccounts.map((acc) => (
            <option key={acc.account_id} value={acc.account_id}>{acc.account_id}</option>
          ))
        ) : (
          <option disabled>No accounts found</option>
        )}
      </select>
    </div>

    {/* Right: Input + Button */}
    <div className="flex gap-2 w-full sm:w-1/3 items-stretch ml-auto">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={`flex-1 ${isDarkMode ? 'bg-black text-yellow-300' : 'bg-white text-black'} p-3 rounded-md border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition`}
      />
      <button
        onClick={handleWithdrawalSubmit}
        className="bg-yellow-500 text-black px-4 py-2 text-sm rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all"
      >
        Submit
      </button>
    </div>
  </div>

  {/* Comment Input */}
  <div className="w-full">
    <input
      type="text"
      placeholder="Comment (optional)"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      className={`w-full ${isDarkMode ? 'bg-black text-yellow-300' : 'bg-white text-black'} p-3 rounded-md border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition`}
    />
  </div>
</div>


    {/* Pending / History Buttons */}
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={() => setFilter("pending")}
        className={`px-5 py-2 rounded-md font-semibold shadow text-black ${filter === "pending" ? 'bg-yellow-500' : 'bg-yellow-300'} hover:bg-yellow-400 transition-all shadow-md hover:shadow-lg`}
      >
        Pending
      </button>
      <button
        onClick={() => setFilter("history")}
        className={`px-5 py-2 rounded-md font-semibold shadow text-black ${filter === "history" ? 'bg-yellow-500' : 'bg-yellow-300'} hover:bg-yellow-400 transition-all shadow-md hover:shadow-lg`}
      >
        History
      </button>
    </div>

    {/* Withdrawals Table */}
    <div className="overflow-x-auto  border-yellow-500 rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]">
      <table className={`min-w-full border-collapse  border-yellow-500 ${isDarkMode ? 'text-yellow-300' : 'text-black'}`}>
        <thead>
          <tr className={`${isDarkMode ? 'bg-black text-yellow-300' : 'bg-white text-black'} border-b-2 border-yellow-500 `}>
            {['#', 'Date', 'User', 'Type', 'Amount', 'Status'].map((header, i) => (
              <th key={i} className="px-4 py-2 text-center whitespace-nowrap">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {withdrawalLoading && (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center">Loading...</td>
            </tr>
          )}
          {withdrawalError && (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center text-red-500">{withdrawalError}</td>
            </tr>
          )}
          {!withdrawalLoading && !withdrawalError && (() => {
            const filteredData = filter === "pending" ? withdrawalData.filter(row => row.status === "pending") : withdrawalData;
            return filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">No data found</td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-center">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center">{row.trading_account || row.account_id}</td>
                  <td className="px-4 py-2 text-center">{row.source}</td>
                  <td className="px-4 py-2 text-center">{row.amount}</td>
                  <td className="px-4 py-2 text-center">{row.status}</td>
                </tr>
              ))
            );
          })()}
        </tbody>
      </table>
    </div>
  </div>
)}


    </div>
  );
};

export default App;
