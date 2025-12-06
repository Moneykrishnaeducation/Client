
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
  UserPlus,
  CheckCircle
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

  const formatKey = (key) => key.replace(/_/g, ' ').toUpperCase();
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
    <div className={`border-b border-yellow-200 rounded-md p-3 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>

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
          <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} rounded-lg p-6 w-full max-w-7xl overflow-auto max-h-[80vh] relative`}>
            <button
              className="absolute top-3 right-3 text-yellow-500 font-bold"
              onClick={closeModal}
            >
              ✖
            </button>
            <h2 className="text-yellow-300 text-lg font-semibold mb-4">
              Accounts for {client.name}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-yellow-300 border border-yellow-500">
                <thead>
                  <tr className="border-b p-3 border-yellow-500">
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
                          className="bg-yellow-500 text-black px-1 py-0.5 rounded text-xs font-semibold hover:bg-yellow-400"
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
        </div>
      )}

      {/* Nested Modal for Account Details */}
      {isDetailModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-60 ">
          <div
            className={`${isDarkMode ? 'bg-black' : 'bg-white'}
        shadow-[0_0_25px_rgba(255,215,0,0.5)] rounded-lg p-6 w-full max-w-7xl 
        max-h-[90vh] relative`}  // ← Replaced border with glowing shadow
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-yellow-500 font-bold text-xl"
              onClick={() => setIsDetailModalOpen(false)}
            >
              ✖
            </button>

            {/* Header */}
            <h2 className="text-yellow-300 text-2xl font-bold mb-6 text-center">
              Account Details for {selectedAccount.account_id}
            </h2>

            {/* Account Information */}
            {accountDetailsLoading && (
              <p className="text-center text-yellow-200">Loading account details...</p>
            )}
            {accountDetailsError && (
              <p className="text-center text-red-500">{accountDetailsError}</p>
            )}

            {!accountDetailsLoading && !accountDetailsError && accountDetails && (
              <div className="mb-6 max-w-md mx-auto">
                <h3 className="text-yellow-300 text-lg font-semibold mb-4">
                  Account Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(accountDetails)
                    .filter(([key]) => ['balance', 'equity'].includes(key))
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between bg-white/5 hover:bg-yellow-500/10 p-3 rounded-md transition-colors"
                      >
                        <span className="text-yellow-300 font-medium">
                          {formatKey(key)}:
                        </span>
                        <span >{value}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* OPEN POSITIONS TABLE */}
            <h3 className="text-yellow-300 text-lg font-semibold mb-4">
              Open Positions
            </h3>

            {positionsLoading && (
              <p className="text-center">Loading positions...</p>
            )}
            {positionsError && (
              <p className="text-center text-red-500">{positionsError}</p>
            )}
            {!positionsLoading &&
              !positionsError &&
              positionsData.length === 0 && (
                <p className="text-center text-yellow-300">
                  No open positions available
                </p>
              )}

            {!positionsLoading &&
              !positionsError &&
              positionsData.length > 0 && (
                <div className="shadow-[0_0_20px_rgba(255,215,0,0.35)] rounded-md max-h-[60vh] overflow-hidden bg-black/20">
                  {/* ↑ glowing shadow instead of border */}

                  <table className="min-w-[1200px] w-full text-yellow-200">
                    <thead>
                      <tr className="border-b border-yellow-200">
                        {[
                          'Ticket',
                          'Symbol',
                          'Type',
                          'Volume',
                          'Open Price',
                          'Current Price',
                          'SL',
                          'TP',
                          'Profit',
                          'Swap',
                          'Open Time',
                          'Comment',
                        ].map((header, i) => (
                          <th
                            key={i}
                            className="px-4 py-3 font-bold text-left border-r border-white/20 text-yellow-300"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {positionsData.map((position, index) => (
                        <tr
                          key={index}
                          className={`border-b border-white/20 hover:bg-yellow-500/10 transition ${isDarkMode ? 'text-white' : 'text-black'
                            }`}
                        >
                          <td className="px-4 py-3 border-r border-white/20">{position.ticket}</td>
                          <td className="px-4 py-3 border-r border-white/20">{position.symbol}</td>
                          <td className="px-4 py-3 border-r border-white/20">{position.type}</td>
                          <td className="px-4 py-3 border-r border-white/20">{position.volume}</td>
                          <td className="px-4 py-3 border-r border-white/20">{position.open_price}</td>
                          <td className="px-4 py-3 border-r border-white/20">{position.current_price}</td>
                          <td className="px-4 py-3 border-r border-white/20">{position.sl}</td>
                          <td className="px-4 py-3 border-r border-white/20">{position.tp}</td>
                          <td className="px-4 py-3 border-r border-white/20">{position.profit}</td>
                          <td className="px-4 py-3 border-r border-white/20">{position.swap}</td>
                          <td className="px-4 py-3 border-r border-white/20">{position.open_time}</td>
                          <td className="px-4 py-3">{position.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
  const [allCommissionData, setAllCommissionData] = useState([]);
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
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  // Pagination for Commission
  const [commissionCurrentPage, setCommissionCurrentPage] = useState(1);
  const [commissionPerPage, setCommissionPerPage] = useState(10);
  const [commissionTotalPages, setCommissionTotalPages] = useState(1);
  const [commissionTotalItems, setCommissionTotalItems] = useState(0);
  const [commissionSearchQuery, setCommissionSearchQuery] = useState("");
  const [copyMessage, setCopyMessage] = useState("");


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
        const data = await apiCall("client/ib/stats/");
        console.log("Dashboard data:", data);
        // Aggregate earningsPerMonth by month (JAN to DEC), summing totals across years, filling missing months with 0
        const aggregatedMonthly = {};
        data.earnings_per_month.forEach(item => {
          const monthName = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][item.month - 1];
          if (!aggregatedMonthly[monthName]) aggregatedMonthly[monthName] = 0;
          aggregatedMonthly[monthName] += item.total;
        });
        const allMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
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
          // Fetch all commission data without pagination for client-side handling
          const data = await apiCall(`client/ib/commission-transactions/`);
          console.log("Commission data:", data);

          setAllCommissionData(data.results || data);
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

  // Client-side filtering and pagination
  useEffect(() => {
    if (allCommissionData.length > 0) {
      // Filter data based on search query
      const filteredData = commissionSearchQuery
        ? allCommissionData.filter(row =>
            row.client_user?.toLowerCase().includes(commissionSearchQuery.toLowerCase()) ||
            row.client_trading_account?.toString().includes(commissionSearchQuery) ||
            row.position_symbol?.toLowerCase().includes(commissionSearchQuery.toLowerCase()) ||
            row.deal_ticket?.toString().includes(commissionSearchQuery)
          )
        : allCommissionData;

      // Update total items and pages
      setCommissionTotalItems(filteredData.length);
      setCommissionTotalPages(Math.ceil(filteredData.length / commissionPerPage));

      // Slice data for current page
      const startIndex = (commissionCurrentPage - 1) * commissionPerPage;
      const endIndex = startIndex + commissionPerPage;
      setCommissionData(filteredData.slice(startIndex, endIndex));
    }
  }, [allCommissionData, commissionSearchQuery, commissionCurrentPage, commissionPerPage]);

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
          setTradingAccounts(data.accounts || []);
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
      const response = await apiCall("client/ib/request-withdrawal/", {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(amount),
          account_id: selectedAccount,
          comment: comment || "",
        }),
      });
      console.log("Withdrawal request submitted:", response);
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

  const handleDownloadCommission = () => {
    return commissionData.map((row, index) => ({
      'S.No': index + 1,
      'Position ID': row.position_id,
      'Deal Ticket': row.deal_ticket,
      'Client': row.client_user,
      'Trading Account': row.client_trading_account,
      'Symbol': row.position_symbol,
      'Volume': row.volume,
      'P/L': row.profit,
      'Commission to IB': row.amount,
      'MT5 Close Time': row.mt5_close_time,
      'Commission Created': row.created_at,
    }));
  };



  return (
    <div className={`p-6 lg:max-w-[80vw] max-h-full ${isDarkMode ? 'bg-black text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Global Scrollbar Styles */}
      <style>{`
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: ${isDarkMode ? '#111' : '#f0f0f0'}; }
        ::-webkit-scrollbar-thumb { background-color: #ffff00; border-radius: 10px; border: 2px solid ${isDarkMode ? '#111' : '#f0f0f0'}; }
        * { scrollbar-width: thin; scrollbar-color: #ffff00 ${isDarkMode ? '#111' : '#f0f0f0'}; }
      `}</style>
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
                    <p className="text-xl font-bold">
                      {["Commission Balance", "Current Month Volume Traded (Lots)", "Total Volume Traded (Lots)"].includes(item.label)
                        ? (parseFloat(item.value) || 0).toFixed(2)
                        : item.value}
                    </p>
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
              <div className="mt-6 relative flex flex-col items-center gap-2 text-center border-2 border-yellow-500 rounded-lg p-3">
                <span className="text-yellow-400 font-semibold text-sm">Referral Link:</span>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 text-sm break-all">{referralLink || dashboardData.referralLink}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(referralLink || dashboardData.referralLink);
                        setCopyMessage("Link copied to clipboard!");
                        setTimeout(() => setCopyMessage(""), 3000);
                      }}
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
                {copyMessage && <div
    className="
      fixed top-16 right-6 
      flex items-center gap-3
      bg-black/70 backdrop-blur-md
      text-white border border-gold
      px-4 py-3 rounded-lg shadow-lg
      animate-slideIn
      z-50
    "
  >
    <CheckCircle className="w-6 h-6 text-yellow-400" />
    <p className="text-sm font-medium">{copyMessage}</p>
  </div>}
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
            <div className="flex flex-row gap-3 w-full justify-center sm:justify-end">
              <CSVLink data={handleDownloadClients()} filename={"clients.csv"}>
                <button className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all w-auto">
                  <DownloadCloud size={16} /> Download
                </button>
              </CSVLink>

              <button
                className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all w-auto"
                onClick={() => setShowAddUserForm(true)}
              >
                <UserPlus size={16} /> Add User
              </button>
            </div>
          </div>

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
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="American Samoa">American Samoa</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Anguilla">Anguilla</option>
                    <option value="Antarctica">Antarctica</option>
                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Aruba">Aruba</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bermuda">Bermuda</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Cape Verde">Cape Verde</option>
                    <option value="Cayman Islands">Cayman Islands</option>
                    <option value="Central African Republic">Central African Republic</option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo">Congo</option>
                    <option value="Congo, Democratic Republic">Congo, Democratic Republic</option>
                    <option value="Cook Islands">Cook Islands</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Curaçao">Curaçao</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Falkland Islands">Falkland Islands</option>
                    <option value="Faroe Islands">Faroe Islands</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Gibraltar">Gibraltar</option>
                    <option value="Greece">Greece</option>
                    <option value="Greenland">Greenland</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guam">Guam</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guernsey">Guernsey</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Isle of Man">Isle of Man</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jersey">Jersey</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Korea, North">Korea, North</option>
                    <option value="Korea, South">Korea, South</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Laos">Laos</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Macao">Macao</option>
                    <option value="Macedonia">Macedonia</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Caledonia">New Caledonia</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Niue">Niue</option>
                    <option value="Norfolk Island">Norfolk Island</option>
                    <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Palestine">Palestine</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Pitcairn">Pitcairn</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Puerto Rico">Puerto Rico</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="São Tomé and Príncipe">São Tomé and Príncipe</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Sint Maarten">Sint Maarten</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Swaziland">Swaziland</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Timor-Leste">Timor-Leste</option>
                    <option value="Togo">Togo</option>
                    <option value="Tokelau">Tokelau</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Vatican City">Vatican City</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Virgin Islands, British">Virgin Islands, British</option>
                    <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                    <option value="Wallis and Futuna">Wallis and Futuna</option>
                    <option value="Western Sahara">Western Sahara</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
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


            <CSVLink data={handleDownloadCommission()} filename={"commission.csv"}>
              <button className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all mt-2 sm:mt-0 w-full sm:w-auto justify-center">
                <DownloadCloud size={16} /> Download
              </button>
            </CSVLink>
          </div>

          {/* Commission Table */}
          <div className="w-full overflow-x-auto sm:px-2 px-2 mt-6">
            <div className="inline-block min-w-full border-yellow-500 rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]">
              <table className={`min-w-full border-collapse border-yellow-500 text-center ${isDarkMode ? 'text-yellow-300' : 'text-black'}`}>
                <thead>
                  <tr className={`${isDarkMode ? 'bg-black text-yellow-300' : 'bg-yellow-500 text-black'} border-b-2 border-yellow-500`}>
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
                      <td colSpan="11" className="px-4 py-2 text-center text-white-300">Loading...</td>
                    </tr>
                  )}

                  {commissionError && (
                    <tr>
                      <td colSpan="11" className="px-4 py-2 text-center text-red-500">
                        {commissionError}
                      </td>
                    </tr>
                  )}

                  {!commissionLoading && !commissionError && commissionData.length === 0 && (
                    <tr>
                      <td colSpan="11" className="px-4 py-2 text-center">
                        No data found
                      </td>
                    </tr>
                  )}

                  {!commissionLoading && !commissionError && commissionData.map((row, index) => (
                    <tr key={index} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{index + 1}</td>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.position_id}</td>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.deal_ticket}</td>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.client_user}</td>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.client_trading_account}</td>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.position_symbol}</td>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.volume}</td>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.profit}</td>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.amount}</td>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.mt5_close_time}</td>
                      <td className={`px-4 py-2 ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.created_at}</td>
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
        <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} rounded-xl shadow-2xl p-6 space-y-6 transition-shadow`}>

          {/* Balance + Select Trading Account */}
          <div className="flex flex-col md:flex-row ">

            {/* Balance */}
            <div className="flex text-center w-full flex items-center justify-center md:gap-20 gap-5">


              <div className="flex justify-center items-center">
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className={`w-full max-w-xs ${isDarkMode
                      ? 'bg-black text-yellow-300 hover:bg-gray-900'
                      : 'bg-white text-black hover:bg-gray-100'
                    } p-3 rounded-md border border-yellow-500 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors`}
                >
                  <option value="">Select Trading Account</option>

                  {Array.isArray(tradingAccounts) && tradingAccounts.length > 0 ? (
                    tradingAccounts.map((acc) => {
                      const displayText = `${acc.account_name} (${acc.account_id}) - ${acc.account_type}`;
                      const truncatedText =
                        displayText.length > 40
                          ? displayText.substring(0, 35) + '...'
                          : displayText;
                      return (
                        <option className="overflow-hidden w-full"
                          key={acc.account_id}
                          value={acc.account_id}
                          title={displayText}
                        >
                          {truncatedText}
                        </option>
                      );
                    })
                  ) : (
                    <option disabled>No accounts found</option>
                  )}
                </select>
              </div>
              <div className=" flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold text-yellow-400 mb-2 flex items-center">
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

                <p className="text-3xl font-extrabold text-yellow-300">
                  ${dashboardData.commissionBalance.toFixed(2)}
                </p>

              </div>
              <style>
                {`
            @keyframes rollDollar {
              from { transform: rotateY(0deg); }
              to { transform: rotateY(360deg); }
            }
          `}
              </style>
            </div>

            {/* Select Trading Account */}

          </div>

          {/* Amount + Submit Button (Side by Side) */}
          <div className="flex sm:flex-row gap-4 w-full justify-center md:gap-20 gap-5 items-center">

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full md:w-80 ${isDarkMode ? 'bg-black text-yellow-300' : 'bg-white text-black'
                } text-sm rounded-md border border-yellow-500 h-12 px-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition`}
            />

            <button
              onClick={handleWithdrawalSubmit}
              className="w-full sm:w-auto bg-yellow-500 text-black  md:px-6 py-3 text-sm rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all h-12"
            >
              Submit
            </button>
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
          <div className="w-full overflow-x-auto  border-yellow-500 rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]">
            <table className={`min-w-full border-collapse  border-yellow-500 ${isDarkMode ? 'text-yellow-300' : 'text-black'}`}>
              <thead>
                <tr className={`${isDarkMode ? 'bg-black text-yellow-300' : 'bg-white text-yellow-300'} border-b-2 border-yellow-500 `}>
                  {['#', 'Date', 'Account Id', 'User', 'Type', 'Amount', 'Status', 'Comment'].map((header, i) => (
                    <th key={i} className="px-4 py-2 text-center whitespace-nowrap">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawalLoading && (
                  <tr>
                    <td colSpan="8" className="px-4 py-2 text-center">Loading...</td>
                  </tr>
                )}
                {withdrawalError && (
                  <tr>
                    <td colSpan="8" className="px-4 py-2 text-center text-red-500">{withdrawalError}</td>
                  </tr>
                )}
                {!withdrawalLoading && !withdrawalError && (() => {
                  const filteredData = filter === "pending" ? withdrawalData.filter(row => row.status === "pending") : withdrawalData;
                  return filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-2 text-center">No data found</td>
                    </tr>
                  ) : (
                    filteredData.map((row, index) => (
                      <tr key={index} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                        <td className={`px-4 py-2 text-center ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{index + 1}</td>
                        <td className={`px-4 py-2 text-center ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{new Date(row.created_at).toLocaleDateString()}</td>
                        <td className={`px-4 py-2 text-center ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.trading_account}</td>
                        <td className={`px-4 py-2 text-center ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.account_name}</td>
                        <td className={`px-4 py-2 text-center ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.account_type}</td>
                        <td className={`px-4 py-2 text-center ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.amount}</td>
                        <td className={`px-4 py-2 text-center ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.status}</td>
                        <td className={`px-4 py-2 text-center ${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>{row.comment}</td>
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
