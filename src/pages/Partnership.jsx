import React, { useState } from 'react';
import { LayoutDashboard, Users, DollarSign, CreditCard } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const tabs = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Client', icon: <Users size={20} /> },
    { name: 'Commission', icon: <DollarSign size={20} /> },
    { name: 'Withdraw', icon: <CreditCard size={20} /> },
  ];

  const tableData = {
    Client: [
      { id: 1, name: 'Client A', value: 'Active' },
      { id: 2, name: 'Client B', value: 'Inactive' },
      { id: 3, name: 'Client C', value: 'Active' },
    ],
    Commission: [
      { id: 1, name: 'Agent X', value: '$500' },
      { id: 2, name: 'Agent Y', value: '$750' },
      { id: 3, name: 'Agent Z', value: '$300' },
    ],
    Withdraw: [
      { id: 1, name: 'Request 001', value: '$1000' },
      { id: 2, name: 'Request 002', value: '$500' },
      { id: 3, name: 'Request 003', value: '$1200' },
    ],
  };

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

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      {/* Centered Tabs */}
<div className="flex flex-col sm:flex-row items-center sm:justify-center gap-4 mb-8 w-full max-w-md mx-auto">
  {tabs.map((tab) => (
    <button
      key={tab.name}
      onClick={() => setActiveTab(tab.name)}
      className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-md font-semibold transition-all shadow-lg w-full sm:w-auto
        ${
          activeTab === tab.name
            ? 'bg-yellow-500 text-black'
            : 'bg-gray-800 text-yellow-500 hover:bg-yellow-500 hover:text-black'
        }`}
    >
      {tab.icon}
      <span>{tab.name}</span>
    </button>
  ))}
</div>


      {/* Content */}
      {activeTab === 'Dashboard' ? (
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
              className="bg-gray-900 p-4 rounded-md shadow-lg border border-yellow-500 flex flex-col items-center justify-center text-center
                         transition-all transform hover:scale-105 hover:shadow-[0_0_15px_#FFD700]"
            >
              <h3 className="text-yellow-400 font-semibold mb-1 text-sm">{item.label}</h3>
              <p className="text-xl font-bold">{item.value}</p>
            </div>
          ))}

          {/* Referral Link at Bottom Center */}
<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
  <input
    type="text"
    readOnly
    value={dashboardData.referralLink}
    className="p-1 rounded bg-gray-800 text-yellow-100 text-sm text-center"
  />
  <button
    onClick={() => navigator.clipboard.writeText(dashboardData.referralLink)}
    className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold hover:bg-yellow-400"
  >
    📋 Copy
  </button>
</div>

        </div>
      ) : (
        <div className="bg-gray-900 rounded-md shadow-lg border border-yellow-500 p-4 overflow-x-auto">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">{activeTab}</h2>
          <table className="min-w-full border border-yellow-500">
            <thead>
              <tr className="bg-gray-800 text-yellow-300">
                <th className="px-4 py-2 border border-yellow-500 text-left">#</th>
                <th className="px-4 py-2 border border-yellow-500 text-left">Name</th>
                <th className="px-4 py-2 border border-yellow-500 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {tableData[activeTab].map((row) => (
                <tr key={row.id} className="hover:bg-gray-800">
                  <td className="px-4 py-2 border border-yellow-500">{row.id}</td>
                  <td className="px-4 py-2 border border-yellow-500">{row.name}</td>
                  <td className="px-4 py-2 border border-yellow-500">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
