import React, { useEffect, useState } from "react";
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
} from "lucide-react";

const ModalWrapper = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-64 text-center">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-sm mb-4">{children}</p>
      <button
        onClick={onClose}
        className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-semibold text-sm"
      >
        Close
      </button>
    </div>
  </div>
);

const DepositModal = ({ onClose }) => (
  <ModalWrapper title="Deposit" onClose={onClose}>
    Deposit funds to your trading account.
  </ModalWrapper>
);

const WithdrawModal = ({ onClose }) => (
  <ModalWrapper title="Withdraw" onClose={onClose}>
    Withdraw your available funds.
  </ModalWrapper>
);

const OpenAccountModal = ({ onClose }) => (
  <ModalWrapper title="Open Account" onClose={onClose}>
    Create a new trading account quickly.
  </ModalWrapper>
);

const Dashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
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
    setTimeout(() => {
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
    }, 500);
  }, []);

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

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

  const buttonSet = [
    { label: "Open", icon: UserPlus, action: "open" },
    { label: "Deposit", icon: Wallet, action: "deposit" },
    { label: "Withdraw", icon: ArrowDownCircle, action: "withdraw" },
  ];

  return (
    <div className="max-h-[90vh] bg-black text-white flex flex-col w-full text-[18px] overflow-hidden">
      <main className="flex-1 p-6 bg-black mt-[30px] w-full">
        {/* Top Buttons */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {buttonSet.map((btn, i) => (
            <button
              key={i}
              onClick={() => openModal(btn.action)}
              className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-400 shadow-sm hover:shadow-[0_0_10px_rgba(255,215,0,0.6)] h-[46px] w-[150px] text-[16px] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <btn.icon className="w-5 h-5 text-black" />
              {btn.label}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          {statItems.map((box, i) => (
            <div
              key={i}
              className="rounded-lg p-4 text-center bg-gradient-to-b from-gray-900 to-black shadow-md h-[120px] w-[90%] mx-auto hover:shadow-[0_0_12px_rgba(255,215,0,0.5)] transition-all duration-200 flex flex-col items-center justify-center"
            >
              <box.icon className="w-8 h-8 mb-2 text-yellow-400" />
              <strong className="block text-sm text-gray-300">{box.label}</strong>
              <span className="block text-[18px] font-semibold mt-1 text-yellow-400">
                {box.value || <i className="fa-solid fa-hourglass-half"></i>}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 pl-4 w-[90%] mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-yellow-400">Recent Activity</h3>
            <button
              className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-all duration-200"
              onClick={() => alert("View more activity clicked!")}
            >
              View More →
            </button>
          </div>

          <div className="bg-gray-900 rounded-md shadow-md p-4 space-y-3 text-[16px]">
            {[
              { type: "Deposit", color: "text-green-400", amount: "+$100.00" },
              { type: "Withdraw", color: "text-red-400", amount: "-$50.50" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-800 p-3 rounded-md hover:shadow-[0_0_10px_rgba(255,215,0,0.4)] transition-all duration-200 flex justify-between items-center"
              >
                <p>
                  <span className="font-bold text-yellow-400">{item.type}:</span>{" "}
                  <span className={`${item.color}`}>{item.amount}</span> (11/11/2025, 12:38:43 pm)
                </p>
                <ArrowRight className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal === "deposit" && <DepositModal onClose={closeModal} />}
      {activeModal === "withdraw" && <WithdrawModal onClose={closeModal} />}
      {activeModal === "open" && <OpenAccountModal onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;
