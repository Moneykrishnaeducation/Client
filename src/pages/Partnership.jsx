import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Users2,
  DollarSign,
  CreditCard,
  DownloadCloud,
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  FileText
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { apiCall } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CSVLink } from 'react-csv';

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
  const [accountDetails, setAccountDetails] = useState({});
  const [accountDetailsLoading, setAccountDetailsLoading] = useState(false);
  const [accountDetailsError, setAccountDetailsError] = useState("");
  const [positionsData, setPositionsData] = useState([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [positionsError, setPositionsError] = useState("");

  const fetchPositions = async (accountId) => {
    setPositionsLoading(true);
    setPositionsError("");
    try {
      const data = await apiCall(`client/api/open-positions/${accountId}/`);
      console.log("Positions data:", data);
      setPositionsData(data.positions || []);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
      setPositionsError(err.message || "An error occurred");
    } finally {
      setPositionsLoading(false);
    }
  };

  const fetchAccountDetails = async (accountId) => {
    setAccountDetailsLoading(true);
    setAccountDetailsError("");
    try {
      const data = await apiCall(`client/api/account-details/${accountId}/`);
      console.log("Account details data:", data);
      setAccountDetails(data);
    } catch (err) {
      console.error("Failed to fetch account details:", err);
      setAccountDetailsError(err.message || "An error occurred");
    } finally {
      setAccountDetailsLoading(false);
    }
  };

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

  // Use accounts from client data
  const accounts = client.accounts || [];

  return (
    <div className={`border-b border-yellow-200 rounded-md p-3 ${isDarkMode ? 'bg-black' : 'bg-white'} shadow-sm hover:shadow-lg transition-shadow duration-300`}>
      {/* Client Header */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-yellow-500/10 p-2 rounded-md transition-all"
        onClick={toggleExpand}
      >
        {/* Client Info */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full">
          <span className={`${isDarkMode ? 'text-yellow-300' : 'text-black'} font-semibold`}>{client.name}</span>
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
          {client.clients?.length > 0 && (
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
        {isExpanded && client.clients?.length > 0 && (
          <ClientTree clients={client.clients} level={level + 1} />
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
              Accounts for {client.name}
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
                  <tr key={acc.account_id} className={`border-b border-yellow-500 hover:bg-yellow-500/10 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <td className="px-2 py-1">{acc.account_id}</td>
                    <td className="px-2 py-1">{acc.account_type}</td>
                    <td className="px-2 py-1">{acc.group_alias}</td>
                    <td className="px-2 py-1">{acc.total_lots}</td>
                    <td className="px-2 py-1">{acc.total_deposits}</td>
                    <td className="px-2 py-1">{acc.total_withdrawals}</td>
                    <td className="px-2 py-1">{acc.total_commission}</td>
                    <td>
                      <button
                        className="text-yellow-400 cursor-pointer font-semibold"
                        onClick={() => {
                          setSelectedAccount(acc);
                          setIsDetailModalOpen(true);
                          fetchPositions(acc.account_id);
                          fetchAccountDetails(acc.account_id);
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
              Account Details for {selectedAccount.account_id}
            </h2>
            {accountDetailsLoading && <p className="text-center text-yellow-200">Loading account details...</p>}
            {accountDetailsError && <p className="text-center text-red-500">{accountDetailsError}</p>}
            {!accountDetailsLoading && !accountDetailsError && accountDetails && (
              <div className="mb-6">
                <h3 className="text-yellow-300 text-lg font-semibold mb-4">Account Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(accountDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-yellow-200 font-medium">{key.replace(/_/g, ' ').toUpperCase()}:</span>
                      <span className="text-yellow-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <h3 className="text-yellow-300 text-lg font-semibold mb-4">Open Positions</h3>
            {positionsLoading && <p className="text-center text-yellow-200">Loading positions...</p>}
            {positionsError && <p className="text-center text-red-500">{positionsError}</p>}
            {!positionsLoading && !positionsError && positionsData.length === 0 && (
              <p className="text-center text-yellow-200">No open positions available</p>
            )}
            {!positionsLoading && !positionsError && positionsData.length > 0 && (
              <table className="w-full text-yellow-200 border border-yellow-500">
                <thead>
                  <tr className="border-b border-yellow-500">
                    <th className="px-2 py-1 text-left">Symbol</th>
                    <th className="px-2 py-1 text-left">Volume</th>
                    <th className="px-2 py-1 text-left">Price</th>
                    <th className="px-2 py-1 text-left">Profit</th>
                    <th className="px-2 py-1 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {positionsData.map((position, index) => (
                    <tr key={index} className={`border-b border-yellow-500 hover:bg-yellow-500/10 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      <td className="px-2 py-1">{position.symbol}</td>
                      <td className="px-2 py-1">{position.volume}</td>
                      <td className="px-2 py-1">{position.price}</td>
                      <td className="px-2 py-1">{position.profit}</td>
                      <td className="px-2 py-1">{position.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
  const [clientData, setClientData] = useState([]);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  // Pagination for Commission
  const [commissionCurrentPage, setCommissionCurrentPage] = useState(1);
  const [commissionPerPage, setCommissionPerPage] = useState(20);
  const [commissionTotalPages, setCommissionTotalPages] = useState(1);
  const [commissionTotalItems, setCommissionTotalItems] = useState(0);
  const [commissionSearchQuery, setCommissionSearchQuery] = useState("");


  // Add User Form State
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    country: '',
  });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');

  const tabs = [
    { name: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'Client', icon: <Users size={16} /> },
    { name: 'Commission', icon: <CreditCard size={16} /> },
    { name: 'Withdraw', icon: <DollarSign size={16} /> },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiCall("ib/stats/");
        console.log("Dashboard data:", data);
        // Aggregate earningsPerMonth by month (JAN to DEC), summing totals across years, filling missing months with 0
        const aggregatedMonthly = {};
        data.earnings_per_month.forEach(item => {
          const monthName = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][item.month - 1];
          if (!aggregatedMonthly[monthName]) aggregatedMonthly[monthName] = 0;
          aggregatedMonthly[monthName] += item.total;
        });
        const allMonths = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        const aggregatedEarningsPerMonth = allMonths.map(month => ({ month, total: aggregatedMonthly[month] || 0 }));
        // Sort earningsPerClient by total_commission descending and take top 10
        const sortedEarningsPerClient = data.earnings_per_client.sort((a, b) => b.total_commission - a.total_commission).slice(0, 10);
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
          earningsPerClient: sortedEarningsPerClient,
          earningsPerMonth: aggregatedEarningsPerMonth,
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
          const params = new URLSearchParams({
            page: commissionCurrentPage,
            per_page: commissionPerPage,
            ...(commissionSearchQuery && { q: commissionSearchQuery }),
          });
        const data = await apiCall(`client/ib/commission-transactions/?${params}`);
        console.log("Commission data:", data);
        setCommissionData(data.results || data);
        setCommissionTotalPages(data.pagination?.total_pages || 1);
        setCommissionTotalItems(data.pagination?.total || 0);
        } catch (err) {
          console.error("Failed to fetch commission data:", err);
          setCommissionError(err.message || "An error occurred");
        } finally {
          setCommissionLoading(false);
        }
      };

      fetchCommissionData();
    }
  }, [activeTab, commissionCurrentPage, commissionPerPage, commissionSearchQuery]);

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

  useEffect(() => {
    if (activeTab === 'Client') {
      const fetchClientData = async () => {
        setClientLoading(true);
        setClientError("");
        try {
          const params = new URLSearchParams({
            page: currentPage,
            per_page: perPage,
            ...(searchQuery && { q: searchQuery }),
          });
          const data = await apiCall(`client/ib/client-tree/?${params}`);
          console.log("Client tree data:", data);
          setClientData(data.clients || []);
          setTotalPages(data.pagination?.total_pages || 1);
          setTotalClients(data.pagination?.total || 0);
        } catch (err) {
          console.error("Failed to fetch client tree:", err);
          setClientError(err.message || "An error occurred");
        } finally {
          setClientLoading(false);
        }
      };

      fetchClientData();
    }
  }, [activeTab, currentPage, perPage, searchQuery]);

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

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!addUserForm.name || !addUserForm.email || !addUserForm.phone || !addUserForm.country) {
      setAddUserError("Please fill in all required fields.");
      return;
    }
    setAddUserLoading(true);
    setAddUserError("");
    try {
      const response = await apiCall("client/ib/add-client/", {
        method: 'POST',
        body: JSON.stringify(addUserForm),
      });
      console.log("Add user response:", response);
      alert("User added successfully!");
      setAddUserForm({ name: '', email: '', phone: '', country: '' });
      setShowAddUserForm(false);
      // Optionally refetch client data
      const params = new URLSearchParams({
        page: currentPage,
        per_page: perPage,
        ...(searchQuery && { q: searchQuery }),
      });
      const data = await apiCall(`client/ib/client-tree/?${params}`);
      setClientData(data.clients || []);
      setTotalPages(data.pagination?.total_pages || 1);
      setTotalClients(data.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to add user:", err);
      setAddUserError(err.message || "An error occurred while adding the user.");
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleDownloadClients = () => {
    // Flatten the client tree into a CSV-friendly format
    const flattenClients = (clients, level = 1) => {
      let flat = [];
      clients.forEach(client => {
        flat.push({
          Level: level,
          Name: client.name,
          Email: client.email,
          Phone: client.phone,
          Accounts: client.accounts ? client.accounts.length : 0,
        });
        if (client.clients && client.clients.length > 0) {
          flat = flat.concat(flattenClients(client.clients, level + 1));
        }
      });
      return flat;
    };

    const csvData = flattenClients(clientData);
    return csvData;
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

        {/* Commission Earnings Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} p-4 rounded-md shadow-md border border-yellow-500`}>
            <h3 className="text-yellow-400 font-bold mb-4 text-center">Monthly Commission Earnings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.earningsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFD700" />
                <XAxis dataKey="month" stroke="#FFD700" />
                <YAxis stroke="#FFD700" tickFormatter={(value) => `$${value.toFixed(2)}`} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#000' : '#fff', border: '1px solid #FFD700' }} formatter={(value) => [`$${value.toFixed(2)}`, 'Total']} />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#FFD700" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} p-4 rounded-md shadow-md border border-yellow-500`}>
            <h3 className="text-yellow-400 font-bold mb-4 text-center">Commission Earnings Per Client</h3>
            <p className="text-yellow-300 text-xs mb-2 text-center">Top 10 clients by commission earnings</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.earningsPerClient.map(item => ({ name: item.name, total: item.total_commission }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFD700" />
                <XAxis dataKey="name" stroke="#FFD700" tick={false} />
                <YAxis stroke="#FFD700" tickFormatter={(value) => `$${value.toFixed(2)}`} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#000' : '#fff', border: '1px solid #FFD700' }} />
                <Legend />
                <Bar dataKey="total" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
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
  <div>
    {/* Search + Action Buttons */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
      {/* Left: Search */}
      <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-black' : 'bg-white'} border border-yellow-500 rounded-md px-3 py-2 w-auto max-w-[400px] sm:w-1/2`}>
        <Search size={14} className="text-yellow-500" />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${isDarkMode ? 'bg-black text-yellow-300' : 'bg-white text-black'} placeholder-yellow-400 focus:outline-none w-full text-sm py-0.5`}
        />
      </div>

      {/* Right: Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <CSVLink data={handleDownloadClients()} filename={"clients.csv"}>
          <button className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
            <DownloadCloud size={16} /> Download
          </button>
        </CSVLink>

        <button
          className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
          onClick={() => setShowAddUserForm(true)}
        >
          <UserPlus size={16} /> Add User
        </button>
      </div>
    </div>


      {clientLoading && <p>Loading...</p>}
      {clientError && <p className="text-red-500">{clientError}</p>}
      {!clientLoading && !clientError && (
        <>
          <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} p-2 rounded-md border-yellow-500 shadow-md hover:shadow-[0_4px_15px_rgba(255,215,0,0.4)] transition-shadow duration-300`}>
            <h2 className="text-yellow-400 text-lg font-bold mb-4">Client Tree</h2>
            <ClientTree clients={clientData} level={1} />
          </div>

          {/* Per Page + Pagination below the tree */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 w-full">
            {/* Per Page */}
            <div className="flex items-center gap-2">
              <label className="text-yellow-400 text-sm font-semibold">Per Page:</label>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className={`${isDarkMode ? 'bg-black' : 'bg-white'} text-yellow-300 border border-yellow-500 rounded-md px-2 py-1 focus:outline-none`}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="flex items-center justify-center bg-yellow-500 text-black px-2 py-1 rounded-md hover:bg-yellow-400 shadow-md transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-yellow-300 font-semibold text-sm">Page {currentPage} of {totalPages} ({totalClients} clients)</span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="flex items-center justify-center bg-yellow-500 text-black px-2 py-1 rounded-md hover:bg-yellow-400 shadow-md transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    

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
          {addUserError && <p className="text-red-500 mb-4">{addUserError}</p>}
          <form onSubmit={handleAddUserSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              value={addUserForm.name}
              onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
              className="px-3 py-2 rounded-md border border-yellow-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={addUserForm.email}
              onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
              className="px-3 py-2 rounded-md border border-yellow-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Phone"
              value={addUserForm.phone}
              onChange={(e) => setAddUserForm({ ...addUserForm, phone: e.target.value })}
              className="px-3 py-2 rounded-md border border-yellow-500 focus:outline-none"
            />
            <input
              type="date"
              placeholder="DOB"
              value={addUserForm.dob}
              onChange={(e) => setAddUserForm({ ...addUserForm, dob: e.target.value })}
              className="px-3 py-2 rounded-md border border-yellow-500 focus:outline-none"
            />
            <select
              value={addUserForm.country}
              onChange={(e) => setAddUserForm({ ...addUserForm, country: e.target.value })}
              className={`px-3 py-2 rounded-md border border-yellow-500 focus:outline-none ${isDarkMode ? 'bg-black text-yellow-200' : 'bg-white text-black'}`}
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="IN">India</option>
              {/* Add more countries as needed */}
            </select>
            <button
              type="submit"
              disabled={addUserLoading}
              className="bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {addUserLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
)}

    

      {/* Commission Tab */}
      {activeTab === 'Commission' && (
        <div className={`${isDarkMode ? 'bg-black text-yellow-200' : 'bg-white text-black'} rounded-xl shadow-2xl border-yellow-500 p-2 space-y-4 transition-shadow`}>
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
  <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-black' : 'bg-white'} border border-yellow-500 rounded-md px-3 py-2 w-auto max-w-[400px] sm:w-1/2`}>
    <Search size={16} className="text-yellow-500" />
    <input
      type="text"
      placeholder="Search..."
      value={commissionSearchQuery}
      onChange={(e) => setCommissionSearchQuery(e.target.value)}
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
                    <td className="px-4 py-2">{row.client_user}</td>
                    <td className="px-4 py-2">{row.client_trading_account}</td>
                    <td className="px-4 py-2">{row.position_symbol}</td>
                    <td className="px-4 py-2">{row.volume}</td>
                    <td className="px-4 py-2">{row.profit}</td>
                    <td className="px-4 py-2">{row.amount}</td>
                    <td className="px-4 py-2">{row.mt5_close_time}</td>
                    <td className="px-4 py-2">{row.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>

</div>

</div>

          {/* Pagination for Commission */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 w-full">
            {/* Per Page */}
            <div className="flex items-center gap-2">
              <label className="text-yellow-400 text-sm font-semibold">Per Page:</label>
              <select
                value={commissionPerPage}
                onChange={(e) => setCommissionPerPage(Number(e.target.value))}
                className={`${isDarkMode ? 'bg-black' : 'bg-white'} text-yellow-300 border border-yellow-500 rounded-md px-2 py-1 focus:outline-none`}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCommissionCurrentPage(Math.max(1, commissionCurrentPage - 1))}
                className="flex items-center justify-center bg-yellow-500 text-black px-2 py-1 rounded-md hover:bg-yellow-400 shadow-md transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-yellow-300 font-semibold text-sm">Page {commissionCurrentPage} of {commissionTotalPages} ({commissionTotalItems} items)</span>
              <button
                onClick={() => setCommissionCurrentPage(Math.min(commissionTotalPages, commissionCurrentPage + 1))}
                className="flex items-center justify-center bg-yellow-500 text-black px-2 py-1 rounded-md hover:bg-yellow-400 shadow-md transition-all"
              >
                <ChevronRight size={16} />
              </button>
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
