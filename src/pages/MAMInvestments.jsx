import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DepositModal from "./DepositModal";
import Withdraw from "./Withdraw";
import TradesModal from "./TradesModal";

// Simple Error Boundary to catch render errors and show a helpful message
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for now
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-red-500">Something went wrong rendering this page.</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{String(this.state.error)}</pre>
          <button onClick={this.reset} className="mt-4 px-4 py-2 bg-yellow-500 rounded">Reload UI</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Maminvestments = () => {
    // Helper to safely format numeric values
    const formatNumber = (v) => {
      const n = Number(v);
      if (!isFinite(n)) return "0.00";
      return n.toFixed(2);
    };
  const [activeTab, setActiveTab] = useState("availableManagers");
  const [showPopup, setShowPopup] = useState(null);
  const [showViewPopup, setShowViewPopup] = useState(null);
  const [managers, setManagers] = useState([]);
  const [investments, setInvestments] = useState([]);

  // ✅ Added missing states
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDarkMode] = useState(true);
  const [investorPassword, setInvestorPassword] = useState("");
  const [confirmInvestorPassword, setConfirmInvestorPassword] = useState("");
  const [investLoading, setInvestLoading] = useState(false);
  const [investError, setInvestError] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError, setToggleError] = useState(null);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [positionsError, setPositionsError] = useState(null);
  const [showTradesModal, setShowTradesModal] = useState(false);
  const [showCopyCoefficientModal, setShowCopyCoefficientModal] = useState(false);

  // Copy Coefficient modal states
  const [copyCoefficientMode, setCopyCoefficientMode] = useState("balance"); // "balance" or "fixed"
  const [multiTradeEnabled, setMultiTradeEnabled] = useState(false);
  const [multiTradeCount, setMultiTradeCount] = useState(2);

  const navigate = useNavigate();
  // Deposit/Withdraw modal state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositActiveTab, setDepositActiveTab] = useState("cheesepay");
  const [cheeseAmount, setCheeseAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [selectedDepositAccount, setSelectedDepositAccount] = useState(null);
  const [usdtAmount, setUsdtAmount] = useState("");

  // Load managers and investments: prefer API, fallback to localStorage
  useEffect(() => {
    const fetchAvailableManagers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await fetch("http://client.localhost:8000/available-mam-managers/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch available managers: ${res.status}`);
        }

        const data = await res.json();

        // Map API shape to component's expected shape
        const mapped = data.map((m) => ({
          id: m.accountId || m.id || m.mam_account_id,
          accountName: m.name || m.account_name || m.accountName,
          account_id: m.accountId || m.id || m.mam_account_id,
          profitPercentage: m.profit_sharing_percentage || m.profit_sharing || (m.profitShare ? parseFloat(m.profitShare) : undefined) || 0,
          leverage: m.leverage || m.leverage || "",
          enabled: m.is_enabled ?? (m.status ? m.status.toLowerCase() === "enabled" : true),
          balance: m.current_balance || m.balance || m.current_balance || 0,
          equity: m.current_equity || m.equity || 0,
          accountAge: m.account_age || m.accountAge || `${m.account_age_in_days || 0} days`,
          totalProfit: m.total_profit || 0,
          riskLevel: m.risk_level || m.riskLevel || "Medium",
        }));

        setManagers(mapped);
      } catch (err) {
        console.warn("Could not load available managers from API, falling back to localStorage:", err);

        // If API call fails, keep managers empty and let UI show no managers
        setManagers([]);
      }
    };
    fetchAvailableManagers();
  }, []);

  // Fetch user investments when user switches to My Investments tab
  useEffect(() => {
    const fetchUserInvestments = async () => {
      setInvestError(null);
      setInvestLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Missing auth token");

        const res = await fetch("http://client.localhost:8000/user-investments/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          let txt = `${res.status} ${res.statusText}`;
          try {
            const j = await res.json();
            txt = j.error || JSON.stringify(j);
          } catch (e) {}
          throw new Error(txt);
        }

        const data = await res.json();

        // Map server response to local shape
        const mapped = (Array.isArray(data) ? data : []).map((it) => ({
          id: it.accountId || it.id || it.account_id,
          master_account_id: it.master_account_id || it.masterAccountId || it.master_id || null,
          accountName: it.name || it.account_name || it.username || (it.mam_account_name ? `${it.mam_account_name} - Investment` : "Investment"),
          profitPercentage: it.profit_sharing_percentage || it.profit_sharing || (it.profitShare ? parseFloat(it.profitShare) : 0) || 0,
          leverage: it.leverage || it.package_leverage || "",
          totalProfit: it.profit != null ? it.profit : (it.amount_invested && it.amount_invested - 0 ? it.amount_invested : 0),
          enabled: it.status ? (String(it.status).toLowerCase() === "copying" || String(it.status).toLowerCase() === "running") : (it.is_enabled ?? true),
          riskLevel: it.risk_level || it.riskLevel || "Medium",
        }));

        setInvestments(mapped);
      } catch (e) {
        console.error("Failed to load user investments:", e);
        setInvestments([]);
        setInvestError(String(e));
      } finally {
        setInvestLoading(false);
      }
    };

    if (activeTab === "myInvestments") {
      fetchUserInvestments();
    }
  }, [activeTab]);

  const handleInvestClick = (manager) => {
    try {
      console.debug("Invest clicked", manager);
      // clone to avoid accidental shared references
      setShowPopup(manager ? { ...manager } : manager);
    } catch (e) {
      console.error("handleInvestClick error:", e);
      setShowPopup(null);
    }
  };

  const handleSubmitInvestment = async () => {
    setInvestError(null);
    if (!showPopup || typeof showPopup !== "object") {
      alert("No manager selected. Please try again.");
      setShowPopup(null);
      return;
    }

    if (!investorPassword || investorPassword !== confirmInvestorPassword) {
      setInvestError("Passwords must match and cannot be empty.");
      return;
    }

    setInvestLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Missing auth token. Please log in again.");

      const payload = {
        manager_id: showPopup.account_id || showPopup.id || showPopup.accountId,
        password: investorPassword,
      };

      const res = await fetch("http://client.localhost:8000/mam/investments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errText = "Failed to create investment";
        try {
          const json = await res.json();
          errText = json.error || JSON.stringify(json);
        } catch (e) {
          errText = `${res.status} ${res.statusText}`;
        }
        throw new Error(errText);
      }

      const data = await res.json();

      // Build investment entry from response when possible
      const createdAccountId = data.account_id || data.accountId || (data.account && data.account.account_id) || null;
      const newInvestment = {
        id: createdAccountId || showPopup.id,
        // Use the creating user's username as the account name when available
        accountName: data.username || data.account_name || showPopup.accountName || showPopup.name,
        profitPercentage: data.profit_sharing_percentage || showPopup.profitPercentage || 0,
        leverage: data.leverage || showPopup.leverage || "",
        totalProfit: 0,
        enabled: true,
        riskLevel: showPopup.riskLevel || "Medium",
      };

      const updatedInvestments = [...investments, newInvestment];
      setInvestments(updatedInvestments);
      localStorage.setItem("myInvestments", JSON.stringify(updatedInvestments));

      alert(`Investment account created (ID: ${createdAccountId || 'unknown'})`);
      setShowPopup(null);
      setInvestorPassword("");
      setConfirmInvestorPassword("");
    } catch (e) {
      console.error("Invest API error:", e);
      setInvestError(String(e));
    } finally {
      setInvestLoading(false);
    }
  };

  // Toggle investor copy (pause/resume) for an account
  const handleToggleCopy = async (accountId, currentEnabled) => {
    setToggleError(null);
    setToggleLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Missing auth token. Please log in again.");

      const endpoint = currentEnabled ? 'pause-copying/' : 'start-copying/';
      const url = `http://client.localhost:8000/${endpoint}`;
      const body = { mam_id: accountId };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let errText = `${res.status} ${res.statusText}`;
        try {
          const j = await res.json();
          errText = j.error || JSON.stringify(j);
        } catch (e) {}
        throw new Error(errText);
      }

      const data = await res.json();

      // Backend confirms success with message
      const newEnabled = !currentEnabled; // Flip the state

      // Update selected account view
      setSelectedAccount((prev) => (prev && String(prev.id) === String(accountId) ? { ...prev, enabled: newEnabled, master_account_id: prev.master_account_id } : prev));

      // Update investments list if present
      setInvestments((prev) => prev.map((it) => (String(it.id) === String(accountId) ? { ...it, enabled: newEnabled, master_account_id: it.master_account_id } : it)));

      // Small user feedback
      alert(data.message || (newEnabled ? 'Copying resumed for account.' : 'Copying paused for account.'));
    } catch (e) {
      console.error('Toggle copy API error:', e);
      setToggleError(String(e));
    } finally {
      setToggleLoading(false);
    }
  };

  // Fetch open positions for an account and attach them to selectedAccount
  const handleOpenPositions = async (accountId) => {
    setPositionsError(null);
    setPositionsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Missing auth token. Please log in again.');

      const url = `http://client.localhost:8000/open-positions/${accountId}/`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        let errText = `${res.status} ${res.statusText}`;
        try {
          const j = await res.json();
          errText = j.error || JSON.stringify(j);
        } catch (e) {}
        throw new Error(errText);
      }

      const data = await res.json();

      // Attach positions to selectedAccount if it matches
      setSelectedAccount((prev) => (prev && String(prev.id) === String(accountId) ? { ...prev, positions: data } : prev));

      // Also attach to investments list if present
      setInvestments((prev) => prev.map((it) => (String(it.id) === String(accountId) ? { ...it, positions: data } : it)));

      console.debug('Open positions loaded:', data);
    } catch (e) {
      console.error('Open positions API error:', e);
      setPositionsError(String(e));
    } finally {
      setPositionsLoading(false);
    }
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
    onClick={() => navigate("/socialtrading")}
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
                      <span className="font-semibold">Balance : ${formatNumber(manager.balance)}</span>
                    </p>
                    <p className="bg-[#2a2a2a] p-2 rounded-md flex justify-between">
                      <span className="font-semibold">Equity : ${formatNumber(manager.equity)}</span>
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
                    <td className="px-4 py-2 text-white">${formatNumber(inv.totalProfit)}</td>
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
                      <button
                        onClick={() => {
                          setSelectedDepositAccount(inv.id || inv.account_id);
                          setDepositActiveTab("cheesepay");
                          setCheeseAmount("");
                          setUsdtAmount("");
                          setShowDepositModal(true);
                        }}
                        className="bg-yellow-500 text-black px-3 py-1 rounded-md font-semibold hover:bg-yellow-400 transition"
                      >
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
                <strong>Total Profit:</strong> ${formatNumber(showPopup.totalProfit)}
              </p>
              <p>
                <strong>Status:</strong> {showPopup.enabled ? "Enabled" : "Disabled"}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <input
                type="password"
                placeholder="Enter investor password"
                value={investorPassword}
                onChange={(e) => setInvestorPassword(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-800 text-yellow-200 focus:outline-yellow-400"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmInvestorPassword}
                onChange={(e) => setConfirmInvestorPassword(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-800 text-yellow-200 focus:outline-yellow-400"
              />
              {investError && <div className="text-red-400 text-sm">{investError}</div>}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmitInvestment}
                disabled={investLoading}
                className={`bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition ${investLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {investLoading ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                onClick={() => { setShowPopup(null); setInvestorPassword(''); setConfirmInvestorPassword(''); setInvestError(null); }}
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
          <Info label="Account ID" value={selectedAccount.id || selectedAccount.account_id} isDarkMode={true} />
          <Info label="Master Account ID" value={selectedAccount.master_account_id || ""} isDarkMode={true} />
            <Info label="Account Name" value={selectedAccount.accountName} isDarkMode={true} />
            <Info label="Account Name" value={selectedAccount.accountName} isDarkMode={true} />
            <Info label="Profit Percentage" value={`${selectedAccount.profitPercentage}%`} isDarkMode={true} />
            <Info label="Leverage" value={selectedAccount.leverage} isDarkMode={true} />
            <Info label="Total Profit" value={`$${formatNumber(selectedAccount.totalProfit)}`} isDarkMode={true} />
            <Info label="Status" value={selectedAccount.enabled ? "Enabled" : "Disabled"} isDarkMode={true} />
            <Info label="Risk Level" value={selectedAccount.riskLevel || "Medium"} isDarkMode={true} />
          </div>

          {/* Open Positions (if loaded) */}
          {selectedAccount.positions && Array.isArray(selectedAccount.positions) && (
            <div className="mt-4 w-full">
              <h4 className="text-lg font-semibold text-yellow-400 mb-2">Open Positions</h4>
              <div className="w-full overflow-auto bg-[#0b0b0b] p-3 rounded-lg">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-sm">Symbol</th>
                      <th className="px-2 py-1 text-sm">Volume</th>
                      <th className="px-2 py-1 text-sm">Profit</th>
                      <th className="px-2 py-1 text-sm">Open Price</th>
                      <th className="px-2 py-1 text-sm">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAccount.positions.map((pos, idx) => (
                      <tr key={idx} className="border-t border-yellow-800">
                        <td className="px-2 py-1 text-sm text-white">{pos.symbol || pos.asset || pos.symbol_name}</td>
                        <td className="px-2 py-1 text-sm text-white">{pos.volume ?? pos.lots ?? pos.size}</td>
                        <td className="px-2 py-1 text-sm text-white">${formatNumber(pos.profit ?? pos.pnl ?? 0)}</td>
                        <td className="px-2 py-1 text-sm text-white">{pos.open_price ?? pos.price ?? '-'}</td>
                        <td className="px-2 py-1 text-sm text-white">{pos.type || pos.direction || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => handleToggleCopy(selectedAccount.id || selectedAccount.account_id, selectedAccount.enabled)}
              disabled={toggleLoading}
              className={`bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition ${toggleLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {toggleLoading ? 'Processing...' : (selectedAccount.enabled ? '⏸️ Pause' : '▶️ Resume')}
            </button>
            {toggleError && <div className="text-red-400 mt-2">{toggleError}</div>}
            <button
              onClick={() => {
                // Open deposit modal for this selected account
                setSelectedDepositAccount(selectedAccount.id || selectedAccount.account_id);
                setDepositActiveTab("cheesepay");
                setCheeseAmount("");
                setUsdtAmount("");
                setShowDepositModal(true);
              }}
              className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition"
            >
              💰 Deposit
            </button>
            <button
              onClick={() => {
                setShowWithdrawModal(true);
              }}
              className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition"
            >
              💳 Withdraw
            </button>
            <button
              onClick={() => {
                const acct = {
                  ...(selectedAccount || {}),
                  account_id: (selectedAccount && (selectedAccount.account_id || selectedAccount.id)) || undefined,
                };
                setSelectedAccount(acct);
                setShowTradesModal(true);
              }}
              disabled={positionsLoading}
              className={`bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition ${positionsLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {positionsLoading ? 'Loading...' : '💼 Investor'}
            </button>
            <button
              onClick={() => {
                const acct = {
                  ...(selectedAccount || {}),
                  account_id: (selectedAccount && (selectedAccount.master_account_id || selectedAccount.masterAccountId)) || undefined,
                };
                setSelectedAccount(acct);
                setShowTradesModal(true);
              }}
              disabled={positionsLoading}
              className={`bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition ${positionsLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {positionsLoading ? 'Loading...' : '💼 Manager'}
            </button>
            {positionsError && <div className="text-red-400 w-full text-center">{positionsError}</div>}
            <button
             onClick={() => setShowCopyCoefficientModal(true)}
             className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition">
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
      {/* Deposit & Withdraw Modals */}
      <DepositModal
        showDepositModal={showDepositModal}
        setShowDepositModal={setShowDepositModal}
        activeTab={depositActiveTab}
        setActiveTab={setDepositActiveTab}
        cheeseAmount={cheeseAmount}
        setCheeseAmount={setCheeseAmount}
        currency={currency}
        setCurrency={setCurrency}
        convertedAmount={convertedAmount}
        selectedDepositAccount={selectedDepositAccount}
        usdtAmount={usdtAmount}
        setUsdtAmount={setUsdtAmount}
      />
      {showWithdrawModal && (
        <Withdraw 
          onClose={() => setShowWithdrawModal(false)} 
          currentAccount={selectedAccount}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      {/* Trades Modal (open positions) */}
      <TradesModal
        showTradesModal={showTradesModal}
        setShowTradesModal={setShowTradesModal}
        selectedAccount={selectedAccount}
        // Add role prop to indicate if showing manager or investor trades
        tradeRole={showTradesModal && selectedAccount && selectedAccount.account_id === (selectedAccount.master_account_id || selectedAccount.masterAccountId) ? "manager" : "investor"}
      />
      {/* Copy Coefficient Modal */}
      {showCopyCoefficientModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="copyCoefficientTitle"
        >
          <div className="bg-[#111] relative p-6 rounded-2xl shadow-lg max-w-md w-full text-white border border-yellow-500">
            {/* Title */}
            <h3 id="copyCoefficientTitle" className="text-2xl font-bold mb-4 flex items-center gap-2">
              Copy Coefficient <span>ⓘ</span>
            </h3>

            {/* Current Mode & Select Mode */}
            <div>
              <p className="mb-2">
                Account Id : {selectedAccount?.account_id || selectedAccount?.id || "Loading..."}
              </p>
              <div className="mb-2">
                <span className="font-semibold">Current Mode:</span> {copyCoefficientMode === "balance" ? "By Balance Ratio" : "By Fixed Multiple"}
              </div>

              <div className="mb-4 flex gap-4">
                <button
                  className={`px-4 py-2 rounded ${copyCoefficientMode === "balance" ? "bg-yellow-500 text-black" : "bg-gray-700 text-yellow-300"}`}
                  onClick={() => setCopyCoefficientMode("balance")}
                >
                  By Balance Ratio
                </button>
                <button
                  className={`px-4 py-2 rounded ${copyCoefficientMode === "fixed" ? "bg-yellow-500 text-black" : "bg-gray-700 text-yellow-300"}`}
                  onClick={() => setCopyCoefficientMode("fixed")}
                >
                  By Fixed Multiple
                </button>
              </div>
            </div>

            {/* Factor input (only visible if fixed mode) */}
            {copyCoefficientMode === "fixed" && (
              <div className="mb-4">
                <label htmlFor="factorInput" className="block mb-1">Factor:</label>
                <input
                  id="factorInput"
                  type="text"
                  placeholder="Enter factor 1x"
                  className="w-full p-2 rounded bg-gray-700 text-yellow-300 border border-yellow-500"
                  // onChange or bind state if needed
                />
              </div>
            )}

            {/* Multi Trade Mode toggle */}
            <div className="mb-4 border-t border-yellow-500 pt-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="text-lg font-semibold flex items-center gap-2">
                    <span>🔄</span> Multi Trade Mode
                  </div>
                  <p className="text-sm text-yellow-400">
                    Copy each master trade multiple times to your investor account
                  </p>
                </div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={multiTradeEnabled}
                    onChange={(e) => setMultiTradeEnabled(e.target.checked)}
                    id="multiTradeToggle"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-yellow-500 peer-focus:ring-4 peer-focus:ring-yellow-400 transition"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                </label>
              </div>

              {/* Number of trades selector, visible only when toggle is ON */}
              {multiTradeEnabled && (
                <div>
                  <label htmlFor="multiTradeCount" className="block mb-1">📊 Number of Trades:</label>
                  <select
                    id="multiTradeCount"
                    value={multiTradeCount}
                    onChange={(e) => setMultiTradeCount(Number(e.target.value))}
                    className="w-full p-2 rounded bg-gray-700 text-yellow-300 border border-yellow-500"
                  >
                    {[...Array(10)].map((_, i) => {
                      const val = i + 1;
                      return (
                        <option key={val} value={val}>
                          {val} {val === 1 ? "Trade (Normal)" : `Trades (${val}x)`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              className="w-full py-3 mt-4 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("accessToken");
                  if (!token) throw new Error("Missing auth token. Please log in again.");
  
                  const modeToSend = copyCoefficientMode === "balance" ? "balance_ratio" : "fixed_multiple";
                  const factor = copyCoefficientMode === "fixed" ? (document.getElementById("factorInput")?.value || "1.00") : "1.00";
                  const payload = {
                    mode: modeToSend,
                    factor: factor,
                    account_id: selectedAccount?.account_id || selectedAccount?.id,
                    multi_trade_enabled: multiTradeEnabled,
                    multi_trade_count: multiTradeCount,
                  };
  
                  const res = await fetch("http://client.localhost:8000/api/save-coefficient/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify(payload),
                  });
  
                  if (!res.ok) {
                    let errText = `${res.status} ${res.statusText}`;
                    try {
                      const j = await res.json();
                      errText = j.error || JSON.stringify(j);
                    } catch (e) {}
                    throw new Error(errText);
                  }
  
                  const data = await res.json();
                  alert(data.message || "Coefficient saved successfully.");
                  setShowCopyCoefficientModal(false);
                } catch (e) {
                  alert(`Failed to save coefficient: ${e.message || e}`);
                  console.error("Save Coefficient error:", e);
                }
              }}
            >
              ✅ Save Coefficient
            </button>
            {/* Close Icon Button */}
            <button
              type="button"
              aria-label="Close copy coefficient modal"
              onClick={() => setShowCopyCoefficientModal(false)}
              className="absolute top-3 right-3 text-yellow-300 hover:text-yellow-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
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
