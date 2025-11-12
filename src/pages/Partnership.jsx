import React, { useState,useRef, useEffect } from 'react';
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

const ClientTree = ({ clients, level = 1 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-3">
      {clients.map((client) => {
        const isExpanded = expanded[client.id];
        const contentRef = useRef(null);
        const [maxHeight, setMaxHeight] = useState('0px');

        useEffect(() => {
          if (contentRef.current) {
            setMaxHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : '0px');
          }
        }, [isExpanded]);

        return (
          <div key={client.id} className="border border-yellow-500 rounded-md p-3 bg-black-900">
            {/* Client Header */}
            <div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-yellow-500/10 p-2 rounded-md transition-all"
              onClick={() => toggleExpand(client.id)}
            >
              {/* Client Info Side-by-Side */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full">
                <span className="text-yellow-300 font-semibold">{client.username}</span>
                <span className="text-yellow-200 text-sm">{client.email}</span>
                <span className="text-yellow-200 text-sm">{client.phone}</span>
              </div>

              {/* Level and Expand/Collapse */}
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                  L{level}
                </span>
                {client.children?.length > 0 && (
                  <span className="text-yellow-400 font-semibold text-sm">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </div>

            {/* Smoothly render children */}
            <div
              ref={contentRef}
              style={{ maxHeight, transition: 'max-height 0.3s ease', overflow: 'hidden' }}
              className="ml-0 sm:ml-6 mt-2"
            >
              {isExpanded && client.children?.length > 0 && (
                <ClientTree clients={client.children} level={level + 1} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Tabs definition
  const tabs = [
    { name: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'Client', icon: <Users size={16} /> },
    { name: 'Commission', icon: <CreditCard size={16} /> },
    { name: 'Withdraw', icon: <DollarSign size={16} /> },
  ];

  const dashboardData = {
    totalClients: 1,
    directClients: 1,
    totalEarnings: 0.24,
    totalWithdrawals: 0.0,
    commissionBalance: 0.24,
    currentMonthEarnings: 0.0,
    currentMonthVolume: 0.0,
    totalVolume: 0.04,
    referralLink: 'https://client.vtindex.com/register?ref=7SI1WOUI',
  };

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

  const withdrawData = [
    { date: '2025-11-01', user: 'User A', type: 'Bank', amount: '$100', status: 'Pending' },
    { date: '2025-11-05', user: 'User B', type: 'PayPal', amount: '$200', status: 'Completed' },
    { date: '2025-11-10', user: 'User C', type: 'Bank', amount: '$150', status: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-4 mb-8 w-full max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-md font-semibold transition-all shadow-lg w-full sm:w-auto
              ${activeTab === tab.name
                ? 'bg-yellow-500 text-black'
                : 'bg-black-800 text-yellow-500 hover:bg-yellow-500 hover:text-black'
              }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'Dashboard' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Clients', value: dashboardData.totalClients },
              { label: 'Direct Clients', value: dashboardData.directClients },
              { label: 'Total Earnings', value: dashboardData.totalEarnings },
              { label: 'Total Withdrawals', value: dashboardData.totalWithdrawals },
              { label: 'Commission Balance', value: dashboardData.commissionBalance },
              { label: 'Current Month Earnings', value: dashboardData.currentMonthEarnings },
              { label: 'Current Month Volume Traded (Lots)', value: dashboardData.currentMonthVolume },
              { label: 'Total Volume Traded (Lots)', value: dashboardData.totalVolume },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-black-900 p-4 rounded-md shadow-lg border border-yellow-500 flex flex-col items-center justify-center text-center
                           transition-all transform hover:scale-105 hover:shadow-[0_0_15px_#FFD700]"
              >
                <h3 className="text-yellow-400 font-semibold mb-1 text-sm">{item.label}</h3>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-black-800 p-4 rounded-md shadow-md border-2 border-dashed border-yellow-300 flex flex-col items-center justify-center text-center
                           transition-all transform hover:scale-105 hover:shadow-[0_0_20px_#FFAA00]">
              <h3 className="text-white font-bold mb-1 text-sm">Monthly Commission Earnings</h3>
              <p className="text-xl font-bold text-yellow-300">--</p>
            </div>
            <div className="bg-black-800 p-4 rounded-md shadow-md border-2 border-dashed border-yellow-300 flex flex-col items-center justify-center text-center
                           transition-all transform hover:scale-105 hover:shadow-[0_0_20px_#FFAA00]">
              <h3 className="text-white font-bold mb-1 text-sm">Commission Earnings Per Client</h3>
              <p className="text-yellow-300 text-xs mb-2">Top 10 clients by commission earnings</p>
              <p className="text-xl font-bold text-yellow-300">--</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <span className="text-yellow-400 font-semibold text-sm">Referral Link:</span>
            <div className="flex items-center gap-2">
              <span className="text-yellow-100 text-sm break-all">{dashboardData.referralLink}</span>
              <button
                onClick={() => navigator.clipboard.writeText(dashboardData.referralLink)}
                className="bg-yellow-500 text-black px-1 py-0.5 rounded text-xs font-semibold hover:bg-yellow-400"
              >
                📋 Copy
              </button>
            </div>
          </div>
        </>
      )}

      {/* Client Tab */}
      {activeTab === 'Client' && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
  {/* Left: Search */}
  <div className="flex items-center gap-1 bg-black border border-yellow-500 rounded-md px-2 py-1 w-full sm:w-1/3 flex-shrink-0">
  <Search size={14} className="text-yellow-500" />
  <input
    type="text"
    placeholder="Search clients..."
    className="bg-black text-yellow-300 placeholder-yellow-400 focus:outline-none w-full text-sm py-0.5"
  />
</div>


  {/* Right: Controls */}
  <div className="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
    {/* Per Page */}
    <div className="flex items-center gap-2 flex-shrink-0">
      <label className="text-yellow-400 text-sm font-semibold">Per Page:</label>
      <select className="bg-black text-yellow-300 border border-yellow-500 rounded-md px-2 py-1 focus:outline-none">
        <option>10</option>
        <option>20</option>
        <option>50</option>
        <option>100</option>
      </select>
    </div>

    {/* Pagination */}
    <div className="flex items-center gap-3 flex-shrink-0">
      <button className="flex items-center justify-center bg-yellow-500 text-black px-2 py-1 rounded-md hover:bg-yellow-400 shadow-md transition-all">
        <ChevronLeft size={16} />
      </button>
      <span className="text-yellow-300 font-semibold text-sm">Page 1 of 10</span>
      <button className="flex items-center justify-center bg-yellow-500 text-black px-2 py-1 rounded-md hover:bg-yellow-400 shadow-md transition-all">
        <ChevronRight size={16} />
      </button>
    </div>

    {/* Action Buttons */}
    <button className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all flex-shrink-0">
      <DownloadCloud size={16} /> Download
    </button>

    <button className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all flex-shrink-0">
      <UserPlus size={16} /> Add User
    </button>
  </div>
</div>


          <div className="bg-black-900 p-4 rounded-md border border-yellow-500 shadow-lg">
            <h2 className="text-yellow-400 text-lg font-bold mb-4">Client Tree</h2>
            <ClientTree clients={clientData} level={1} />
          </div>
        </>
      )}

     {/* Commission Tab */}
{activeTab === 'Commission' && (
  <div className="bg-black rounded-xl shadow-2xl  border-yellow-500 p-6 space-y-4 transition-shadow">
    
    {/* Top Buttons */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
      {/* Search Input */}
      <div className="flex items-center gap-2 bg-black border border-yellow-500 rounded-md px-3 py-2 w-full sm:w-1/2">
        <Search size={16} className="text-yellow-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-black text-yellow-300 placeholder-yellow-400 focus:outline-none w-full"
        />
      </div>

      {/* Download Button */}
      <button className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all mt-2 sm:mt-0 w-full sm:w-auto justify-center">
        <DownloadCloud size={16} /> Download
      </button>
    </div>

    {/* Commission Table */}
    <div className="overflow-x-auto border border-yellow-500 rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]">
      <table className="min-w-full border-collapse border border-yellow-500">
        <thead>
          <tr className="bg-black text-yellow-300">
            <th className="px-4 py-2 border border-yellow-500 text-left">S.No</th>
            <th className="px-4 py-2 border border-yellow-500 text-left">Position ID</th>
            <th className="px-4 py-2 border border-yellow-500 text-left">Deal Ticket</th>
            <th className="px-4 py-2 border border-yellow-500 text-left">Client</th>
            <th className="px-4 py-2 border border-yellow-500 text-left">Trading Account</th>
            <th className="px-4 py-2 border border-yellow-500 text-left">Symbol</th>
            <th className="px-4 py-2 border border-yellow-500 text-left">Volume</th>
            <th className="px-4 py-2 border border-yellow-500 text-left">P/L</th>
            <th className="px-4 py-2 border border-yellow-500 text-left">Commission to IB</th>
            <th className="px-4 py-2 border border-yellow-500 text-left">MT5 Close Time</th>
            <th className="px-4 py-2 border border-yellow-500 text-left">Commission Created</th>
          </tr>
        </thead>
        <tbody>
          {[ { id: 1, positionId: 'P001', dealTicket: 'D001', client: 'Client A', account: 'ACC1', symbol: 'EURUSD', volume: '1.0', pl: '$50', commission: '$5', closeTime: '2025-11-01 14:00', created: '2025-11-01 14:05' },
            { id: 2, positionId: 'P002', dealTicket: 'D002', client: 'Client B', account: 'ACC2', symbol: 'GBPUSD', volume: '2.0', pl: '$120', commission: '$12', closeTime: '2025-11-02 15:30', created: '2025-11-02 15:35' },
            { id: 3, positionId: 'P003', dealTicket: 'D003', client: 'Client C', account: 'ACC3', symbol: 'USDJPY', volume: '0.5', pl: '$25', commission: '$2.5', closeTime: '2025-11-03 12:20', created: '2025-11-03 12:25' }, ].map((row, index) => (
            <tr key={row.id} className="hover:bg-gray-900 transition-colors">
              <td className="px-4 py-2 border border-yellow-500">{index + 1}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.positionId}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.dealTicket}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.client}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.account}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.symbol}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.volume}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.pl}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.commission}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.closeTime}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* Withdraw Tab */}
{activeTab === 'Withdraw' && (
  <div className="bg-black rounded-xl shadow-2xl border-yellow-500 p-6 space-y-6 transition-shadow">
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
      <p className="text-3xl font-extrabold text-white">$1,250.00</p>

      <style>
        {`
          @keyframes rollDollar {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
          }
        `}
      </style>
    </div>

    {/* Trading Account Select + Amount */}
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      <select className="bg-black text-yellow-300 p-3 rounded-md border border-yellow-500 w-full sm:w-1/3 hover:bg-gray-900 transition-colors">
        <option value="">Select Trading Account</option>
        <option value="acc1">Account 1</option>
        <option value="acc2">Account 2</option>
        <option value="acc3">Account 3</option>
      </select>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <input
          type="number"
          placeholder="Amount"
          className="bg-black text-yellow-300 p-3 rounded-md border border-yellow-500 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
        <button className="bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg transition-all">
          Submit
        </button>
      </div>
    </div>

    {/* Pending / History Buttons */}
    <div className="flex flex-wrap justify-center gap-4">
      <button className="px-5 py-2 rounded-md font-semibold shadow text-yellow-300 bg-black hover:bg-yellow-500 hover:text-black transition-all shadow-md hover:shadow-lg">
        Pending
      </button>
      <button className="px-5 py-2 rounded-md font-semibold shadow text-yellow-300 bg-black hover:bg-yellow-500 hover:text-black transition-all shadow-md hover:shadow-lg">
        History
      </button>
    </div>

    {/* Withdrawals Table */}
    <div className="overflow-x-auto  border-yellow-500 rounded-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]">
      <table className="min-w-full border-collapse  border-yellow-500">
        <thead>
          <tr className="bg-black text-yellow-300">
            {['#', 'Date', 'User', 'Type', 'Amount', 'Status'].map((header, i) => (
              <th key={i} className="px-4 py-2 border border-yellow-500 text-left whitespace-nowrap">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {withdrawData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-900 hover:text-yellow-200 transition-colors duration-200">
              <td className="px-4 py-2 border border-yellow-500">{index + 1}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.date}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.user}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.type}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.amount}</td>
              <td className="px-4 py-2 border border-yellow-500">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


      
    </div>
  );
};

export default App;
