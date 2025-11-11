import React, { useEffect, useState } from "react";

const ModalWrapper = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg w-80 text-center border border-yellow-400">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-sm mb-4">{children}</p>
      <button
        onClick={onClose}
        className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-semibold"
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col w-full">
      

      {/* Main Section */}
      <main className="flex-1 p-8 bg-black mt-[60px] w-full">
        {/* Top Buttons */}
        <div className="flex justify-center gap-8 mb-8">
          <button
            onClick={() => openModal("open")}
            className="bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md hover:bg-yellow-400 shadow-md mt-[10px] mb-[10px] h-[50px] w-[200px]"
          >
            <i className="fa-solid fa-user-plus mr-2"></i>Open Account
          </button>
          <button
            onClick={() => openModal("deposit")}
            className="bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md hover:bg-yellow-400 shadow-md mt-[10px] mb-[10px] h-[50px] w-[200px]"
          >
            <i className="fa-solid fa-wallet mr-2"></i>Deposit
          </button>
          <button
            onClick={() => openModal("withdraw")}
            className="bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md hover:bg-yellow-400 shadow-md mt-[10px] mb-[10px] h-[50px] w-[200px]"
          >
            <i className="fa-solid fa-money-bill-transfer mr-2"></i>Withdraw
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[
            { label: "Live Accounts", value: stats.live },
            { label: "Demo Accounts", value: stats.demo },
            { label: "Real Balance (USD)", value: `$${stats.realBalance}` },
            { label: "Total Clients (IB)", value: stats.clients },
            { label: "Overall Deposits", value: `$${stats.deposits}` },
            { label: "MAM Funds Invested", value: `$${stats.mamFunds}` },
            { label: "MAM Managed Funds", value: `$${stats.mamManaged}` },
            { label: "IB Earnings", value: `$${stats.ibEarnings}` },
            { label: "Withdrawable Commission", value: `$${stats.withdrawable}` },
          ].map((box, i) => (
            <div
              key={i}
              className="border border-yellow-400 rounded-xl p-5 text-center bg-gradient-to-b from-gray-900 to-black shadow-lg mt-[10px] mb-[10px] h-[150px] w-full"
            >
              <strong className="block text-sm text-gray-300">{box.label}</strong>
              <span className="block text-2xl font-semibold mt-2">
                {box.value || <i className="fa-solid fa-hourglass-half"></i>}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-10 border-l-4 border-yellow-500 pl-4">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">
            Recent Activity
          </h3>
          <div className="bg-gray-900 rounded-lg shadow-md p-4 space-y-2">
            <div className="border border-gray-700 p-2 rounded-md">
              <p>
                <span className="font-bold text-yellow-400">Transaction:</span>{" "}
                <span className="text-green-400">$100.00</span> by (11/11/2025,
                12:38:43 pm)
              </p>
            </div>
            <div className="border border-gray-700 p-2 rounded-md">
              <p>
                <span className="font-bold text-yellow-400">Transaction:</span>{" "}
                <span className="text-red-400">-$50.50</span> by (11/11/2025,
                12:38:43 pm)
              </p>
            </div>
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
