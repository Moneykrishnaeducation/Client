import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEyeSlash, FaCopy, FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaUserCircle, FaCog, FaSignOutAlt, FaMoon, FaSun, FaBell, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const PammAccount = () => {
  const { isDarkMode } = useTheme();

  // Tab state
  const [activeTab, setActiveTab] = useState('manager');

  // Data states
  const [managerList, setManagerList] = useState([]);
  const [availableList, setAvailableList] = useState([]);
  const [investmentList, setInvestmentList] = useState([]);
  const [showInvestments, setShowInvestments] = useState(false);

  // Search states
  const [mgrSearch, setMgrSearch] = useState('');
  const [invSearch, setInvSearch] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: '',
    profitShare: '',
    leverage: '',
    masterPassword: '',
    investPassword: ''
  });
  const [investForm, setInvestForm] = useState({
    investorName: '',
    pammId: '',
    pammInternalId: ''
  });
  const [depositForm, setDepositForm] = useState({
    activeTab: 'q-cheesepay',
    cpCurrency: 'USD',
    cpAmount: '',
    manualCurrency: 'USD',
    manualAmount: '',
    manualFile: null,
    usdtAmount: '',
    usdtFile: null
  });
  const [withdrawForm, setWithdrawForm] = useState({
    accountId: '',
    balance: '0.00'
  });

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Refs
  const panelRef = useRef(null);

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // API helpers
  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: getHeaders(),
        ...options
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  // Load data functions
  const loadManagerList = async (query = '') => {
    try {
      const data = await apiCall(`/api/pamm/managed/?q=${query}`);
      setManagerList(data.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
    } catch (error) {
      console.error('Error loading manager list:', error);
      showToast('Failed to load manager accounts', 'error');
    }
  };

  const loadAvailableList = async (query = '') => {
    try {
      const data = await apiCall(`/api/pamm/available/?q=${query}`);
      setAvailableList(data.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
    } catch (error) {
      console.error('Error loading available list:', error);
      showToast('Failed to load available accounts', 'error');
    }
  };

  const loadInvestmentList = async (query = '') => {
    try {
      const data = await apiCall(`/api/pamm/investments/?q=${query}`);
      setInvestmentList(data.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
    } catch (error) {
      console.error('Error loading investment list:', error);
      showToast('Failed to load investments', 'error');
    }
  };

  // Toast notification
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3200);
  };

  // Form handlers
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const { name, profitShare, leverage, masterPassword, investPassword } = createForm;

    if (!name || !profitShare || !leverage || !masterPassword || !investPassword) {
      showToast('Please fill all fields', 'error');
      return;
    }

    try {
      await apiCall('/api/pamm/create/', {
        method: 'POST',
        body: JSON.stringify({
          name,
          profit_share: parseFloat(profitShare),
          leverage: parseInt(leverage),
          master_password: masterPassword,
          investor_password: investPassword
        })
      });
      showToast('PAMM account created successfully!', 'success');
      setShowCreateModal(false);
      setCreateForm({ name: '', profitShare: '', leverage: '', masterPassword: '', investPassword: '' });
      loadManagerList();
    } catch (error) {
      showToast('Failed to create PAMM account', 'error');
    }
  };

  const handleInvestSubmit = async (e) => {
    e.preventDefault();
    const { investorName, pammInternalId } = investForm;

    if (!investorName || !pammInternalId) {
      showToast('Please fill all fields', 'error');
      return;
    }

    try {
      await apiCall('/api/pamm/invest/', {
        method: 'POST',
        body: JSON.stringify({
          pamm_id: parseInt(pammInternalId),
          investor_name: investorName
        })
      });
      showToast('Investment successful!', 'success');
      setShowInvestModal(false);
      setInvestForm({ investorName: '', pammId: '', pammInternalId: '' });
      loadAvailableList();
      loadInvestmentList();
    } catch (error) {
      showToast('Failed to invest', 'error');
    }
  };

  // Initial load
  useEffect(() => {
    loadManagerList();
    if (activeTab === 'available') {
      loadAvailableList();
    }
  }, [activeTab]);

  // Toggle theme
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Toggle sidebar (assuming from Header)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="title text-center text-2xl font-bold mb-6">PAMM — Client Portal</div>

        {/* Tabs */}
        <div className={`tabs flex gap-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} pb-2 mb-6`}>
          <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === 'manager' ? 'bg-yellow-500 text-black font-bold' : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('manager')}
          >
            PAMM Manager Accounts
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === 'available' ? 'bg-yellow-500 text-black font-bold' : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('available')}
          >
            Available PAMM Accounts
          </button>
        </div>

        {/* Manager Tab */}
        {activeTab === 'manager' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search my PAMM accounts…"
                value={mgrSearch}
                onChange={(e) => setMgrSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadManagerList(mgrSearch)}
                className={`flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border px-4 py-2 rounded-lg`}
              />
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400"
              >
                + Create New PAMM Manager Account
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managerList.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">👨‍💼</div>
                  <div className="text-xl font-bold mb-2">No PAMM Manager Accounts</div>
                  <div className="text-gray-400 mb-6">Start your journey as a PAMM manager!</div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400"
                  >
                    Create Your First PAMM Account
                  </button>
                </div>
              ) : (
                managerList.map((item) => (
                  <div key={item.id} className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
                    <div className="mb-4">
                      <div className="font-bold text-lg">{item.name}</div>
                      <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>MT5 Account: {item.mt5_login || 'Pending'}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profit Sharing</div>
                        <div className="font-bold">{item.profit_share}%</div>
                      </div>
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pool Balance</div>
                        <div className="font-bold">${item.pool_balance}</div>
                      </div>
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Profit</div>
                        <div className="font-bold">${item.total_profit}</div>
                      </div>
                      <div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Leverage</div>
                        <div className="font-bold">{item.leverage}x</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">💳 Deposit</button>
                      <button className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">🏧 Withdraw</button>
                      <button className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">👥 Investors</button>
                      <button className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">⚙️ Settings</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded font-bold text-sm">✖ Disable</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Available Tab */}
        {activeTab === 'available' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search my investments…"
                value={invSearch}
                onChange={(e) => setInvSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (showInvestments ? loadInvestmentList(invSearch) : loadAvailableList(invSearch))}
                className={`flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-black'} border px-4 py-2 rounded-lg`}
              />
              <button
                onClick={() => setShowInvestments(!showInvestments)}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400"
              >
                {showInvestments ? 'Show Available PAMMs' : 'My Investments'}
              </button>
            </div>

            {!showInvestments ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableList.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <div className="text-xl font-bold mb-2">No Available PAMM Accounts</div>
                    <div className="text-gray-400 mb-6">There are currently no PAMM accounts accepting new investments.</div>
                    <button
                      onClick={() => setActiveTab('manager')}
                      className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400"
                    >
                      Create PAMM Account
                    </button>
                  </div>
                ) : (
                  availableList.map((item) => (
                    <div key={item.id} className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
                      <div className="mb-4">
                        <div className="font-bold text-lg">Manager: {item.name}</div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>MT5 Account: {item.mt5_login || 'Pending'}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profit Sharing</div>
                          <div className="font-bold">{item.profit_share}%</div>
                        </div>
                        <div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pool Balance</div>
                          <div className="font-bold">${item.pool_balance}</div>
                        </div>
                        <div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Leverage</div>
                          <div className="font-bold">{item.leverage}x</div>
                        </div>
                        <div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</div>
                          <div className="font-bold">{item.enabled ? 'Open' : 'Closed'}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setInvestForm({ ...investForm, pammId: item.mt5_login, pammInternalId: item.id });
                            setShowInvestModal(true);
                          }}
                          className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-400"
                        >
                          Invest
                        </button>
                        <button className={`${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} px-4 py-2 rounded`}>View</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {investmentList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💎</div>
                    <div className="text-xl font-bold mb-2">No Active Investments</div>
                    <div className="text-gray-400 mb-6">You haven't invested in any PAMM accounts yet.</div>
                    <button
                      onClick={() => setShowInvestments(false)}
                      className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400"
                    >
                      Browse Available PAMMs
                    </button>
                  </div>
                ) : (
                  investmentList.map((item) => (
                    <div key={item.id} className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="font-bold text-lg">Manager: {item.pam_account_name}</div>
                          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>MT5 Account: {item.pamm_mt5_login || 'Pending'}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Investment</div>
                          <div className="font-bold">${item.amount}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profit Share</div>
                          <div className="font-bold">{item.profit_share}%</div>
                        </div>
                        <div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Allocation</div>
                          <div className="font-bold">{item.allocation_percentage}%</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">💳 Add Funds</button>
                        <button className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">🏧 Withdraw</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded font-bold text-sm">Leave</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create PAMM Account</h3>
            <p className="text-gray-400 mb-4">You will be the manager of this pool.</p>
            <form onSubmit={handleCreateSubmit}>
              <input
                type="text"
                placeholder="Display Name for this PAMM"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded mb-4"
                required
              />
              <input
                type="number"
                placeholder="Profit Share % (e.g., 40)"
                value={createForm.profitShare}
                onChange={(e) => setCreateForm({ ...createForm, profitShare: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded mb-4"
                min="0"
                max="100"
                step="0.01"
                required
              />
              <select
                value={createForm.leverage}
                onChange={(e) => setCreateForm({ ...createForm, leverage: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded mb-4"
                required
              >
                <option value="">Select Leverage</option>
                <option value="50">1:50</option>
                <option value="100">1:100</option>
                <option value="200">1:200</option>
                <option value="300">1:300</option>
                <option value="400">1:400</option>
                <option value="500">1:500</option>
                <option value="1000">1:1000</option>
              </select>
              <div className="relative mb-4">
                <input
                  type="password"
                  placeholder="Master Password"
                  value={createForm.masterPassword}
                  onChange={(e) => setCreateForm({ ...createForm, masterPassword: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded pr-10"
                  required
                />
                <button type="button" className="absolute right-2 top-2 text-gray-400">
                  <FaEye />
                </button>
              </div>
              <div className="relative mb-4">
                <input
                  type="password"
                  placeholder="Invest Password"
                  value={createForm.investPassword}
                  onChange={(e) => setCreateForm({ ...createForm, investPassword: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded pr-10"
                  required
                />
                <button type="button" className="absolute right-2 top-2 text-gray-400">
                  <FaEye />
                </button>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-400">Create</button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invest Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Invest in a PAMM Account</h3>
            <form onSubmit={handleInvestSubmit}>
              <input
                type="text"
                placeholder="Investor Name"
                value={investForm.investorName}
                onChange={(e) => setInvestForm({ ...investForm, investorName: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded mb-4"
                required
              />
              <input
                type="text"
                placeholder="MT5 Account ID"
                value={investForm.pammId}
                readOnly
                className="w-full bg-gray-700 border border-gray-600 text-gray-400 px-4 py-2 rounded mb-4 cursor-not-allowed"
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-400">Invest</button>
                <button type="button" onClick={() => setShowInvestModal(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
            <span>{notification.message}</span>
            <button onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))} className="ml-auto">
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PammAccount;
