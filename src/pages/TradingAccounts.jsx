import React, { useEffect, useState } from "react";
import OpenAccount from "./OpenAccount";
import DemoAccountList from "./DemoAccountsPage";
import Withdraw from "./Withdraw";
import DepositModal from "./DepositModal";
import TradesModal from "./TradesModal";
import SettingsModal from "./SettingsModal";
import { useNavigate } from "react-router-dom";

export default function TradingAccounts({ showDepositModal, setShowDepositModal }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("cheesepay");
  const [cheeseAmount, setCheeseAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [selectedDepositAccount, setSelectedDepositAccount] = useState("");
  const [activeComponent, setActiveComponent] = useState(null);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [transferMessage, setTransferMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTradesModal, setShowTradesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newLeverage, setNewLeverage] = useState("");
  const [selectedPasswordType, setSelectedPasswordType] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const navigate = useNavigate()

  const closeComponent = () => {
    setActiveComponent(null);
    setTransferMessage("");
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (fromAccount === toAccount) {
      setTransferMessage("You cannot transfer between the same account.");
      setIsSubmitting(false);
      return;
    }

    if (insufficientBalance) {
      setTransferMessage("Insufficient balance.");
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setTransferMessage("Transfer successful ✅");
      setIsSubmitting(false);
      setAmount("");
      setFromAccount("");
      setToAccount("");
    }, 1000);
  };

  const accounts = [
    {
      id: 1,
      type: "Pro",
      login: "902165",
      leverage: "1:100",
      balance: "1200.50",
      credit: "0.00",
      equity: "1180.00",
      margin: "0.00",
      freeMargin: "132.0"
    },
    {
      id: 2,
      type: "Standard",
      login: "902166",
      leverage: "1:200",
      balance: "2540.00",
      credit: "0.00",
      equity: "2550.25",
      margin: "0.00",
      freeMargin: "311.0"
    },
    {
      id: 3,
      type: "ECN",
      login: "902167",
      leverage: "1:500",
      balance: "4890.75",
      credit: "0.00",
      equity: "4895.00",
      margin: "0.00",
      freeMargin: "281.0"
    },
  ];

  useEffect(() => {
    const fromAcc = accounts.find((acc) => acc.id === fromAccount);
    if (fromAcc && amount && Number(amount) > fromAcc.balance) {
      setInsufficientBalance(true);
    } else {
      setInsufficientBalance(false);
    }
  }, [fromAccount, amount, accounts]);

  // Auto convert USD → INR (mock rate 1 USD = 83.25 INR)
  useEffect(() => {
    if (cheeseAmount) {
      if (currency === "USD") {
        setConvertedAmount((cheeseAmount * 83.25).toFixed(2)); // USD → INR
      } else if (currency === "INR") {
        setConvertedAmount((cheeseAmount / 83.25).toFixed(2)); // INR → USD
      }
    } else {
      setConvertedAmount("");
    }
  }, [cheeseAmount, currency]);

  const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg relative">
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

  return (
    <div className="min-h-[90vh] bg-black text-white font-sans flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-black py-2 mt-6">
        <div className="max-w-[1100px] mx-auto flex flex-wrap gap-3 justify-around items-center px-4">
          <button
            className="bg-gold  w-80 text-black px-4 py-2 rounded hover:bg-white transition"
            onClick={() => setActiveComponent("openAccount")}
          >
            Open Account
          </button>

          <button
            className="bg-gold  w-80 text-black px-4 py-2 rounded hover:bg-white transition"
            onClick={() => setActiveComponent("internalTransaction")}
          >
            Internal Transaction
          </button>

          <button
            className="bg-gold w-80 text-black px-4 py-2 rounded hover:bg-white transition"
            onClick={() => navigate("/demoAccounts")}
          >
            Explore Demo
          </button>

          {/* Conditional rendering for each component */}
          {activeComponent === "openAccount" && (
            <Modal title="Open Account" onClose={closeComponent}>
              <OpenAccount onClose={closeComponent} />
            </Modal>
          )}

          {/* =======================
           INTERNAL TRANSFER SECTION
         ======================= */}
          {/* Internal Transaction Modal */}
          {activeComponent === "internalTransaction" && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
              <div className="bg-black text-white p-6 rounded-lg w-full max-w-md relative shadow-xl border-2 border-gold">
                {/* Close Button */}
                <button
                  onClick={closeComponent}
                  className="absolute top-3 right-3 text-white hover:text-gold text-2xl transition"
                >
                  &times;
                </button>

                {/* Modal Title */}
                <h2 className="text-2xl font-semibold mb-6 text-center text-gold">
                  Internal Transfer
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* From Account */}
                  <div>
                    <label className="block mb-1 font-medium text-white">
                      <span className="text-red-500">*</span> From Account:
                    </label>
                    <select
                      value={fromAccount}
                      onChange={(e) => setFromAccount(e.target.value)}
                      required
                      className="w-full bg-black text-white border border-gold rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="" disabled>
                        Select Account
                      </option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.type} (${acc.balance})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* To Account */}
                  <div>
                    <label className="block mb-1 font-medium text-white">
                      <span className="text-red-500">*</span> To Account:
                    </label>
                    <select
                      value={toAccount}
                      onChange={(e) => setToAccount(e.target.value)}
                      required
                      className="w-full bg-black text-white border border-gold rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="" disabled>
                        Select Account
                      </option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.type} (${acc.balance})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block mb-1 font-medium text-white">
                      <span className="text-red-500">*</span> Amount:
                    </label>
                    <div className="flex items-center bg-black border border-gold rounded px-3 py-2 focus-within:ring-2 focus-within:ring-gold">
                      <span className="mr-2 text-gold">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        placeholder="Enter amount"
                        className="flex-1 bg-black text-white outline-none"
                      />
                    </div>
                    {insufficientBalance && (
                      <p className="text-red-500 text-sm mt-1">
                        Insufficient balance in the selected account.
                      </p>
                    )}
                  </div>

                  {/* Transfer Message */}
                  {transferMessage && (
                    <div className="text-center text-sm font-medium text-gold">
                      {transferMessage}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeComponent}
                      className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!fromAccount || !toAccount || !amount || isSubmitting}
                      className={`px-4 py-2 rounded text-black transition ${isSubmitting || !fromAccount || !toAccount || !amount
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gold hover:bg-white hover:text-gold"
                        }`}
                    >
                      {isSubmitting ? "Processing..." : "Transfer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          )}

          {activeComponent === "exploreDemo" && (
            <Modal title="Explore Demo" onClose={closeComponent}>
              <DemoAccountList isOpen={true} onClose={closeComponent} />
            </Modal>
          )}
        </div>
      </header>

      <main className="flex-1 w-full flex justify-center">
        <div className="max-w-[1100px] w-full p-6">
          {/* Account Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gold mb-4">
              Account Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#111] border border-gold rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm">Total Balance</p>
                <p className="text-2xl font-bold text-gold">$8,631.25</p>
              </div>
              <div className="bg-[#111] border border-gold rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm">Total Equity</p>
                <p className="text-2xl font-bold text-gold">$8,625.25</p>
              </div>
              <div className="bg-[#111] border border-gold rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm">Total Accounts</p>
                <p className="text-2xl font-bold text-gold">{accounts.length}</p>
              </div>
            </div>
          </div>

          {/* Account Table */}
          {!selectedAccount && (
            <div>
              <h3 className="text-lg font-semibold text-gold mb-3">
                Active Accounts
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm text-gray-200">
                  <thead>
                    <tr className="bg-[#111] text-gold border-b border-gold">
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Login</th>
                      <th className="p-3 text-left">Leverage</th>
                      <th className="p-3 text-left">Balance</th>
                      <th className="p-3 text-left">Equity</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => (
                      <tr
                        key={acc.id}
                        className="border-b border-[#333] hover:bg-[#1a1a1a] transition"
                      >
                        <td className="p-3">{acc.type}</td>
                        <td className="p-3">{acc.login}</td>
                        <td className="p-3">{acc.leverage}</td>
                        <td className="p-3">${acc.balance}</td>
                        <td className="p-3">${acc.equity}</td>
                        <td className="p-3 text-center flex gap-3 justify-center">
                          <button
                            onClick={() => setSelectedAccount(acc)}
                            className="bg-gold text-black px-3 py-1 rounded hover:bg-white transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setShowDepositModal(true);
                              setActiveTab("cheesepay");
                              setSelectedDepositAccount(acc.login);
                            }}
                            className="bg-gold text-black px-3 py-1 rounded hover:bg-white transition"
                          >
                            Deposit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Selected Account View */}
          {selectedAccount && (
            <div className="mt-6">
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

              <div className="bg-[#111] border border-gold rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Info label="Account Type" value={selectedAccount.type} />
                  <Info label="Platform Login" value={selectedAccount.login} />
                  <Info label="Leverage" value={selectedAccount.leverage} />
                  <Info label="Balance" value={`$${selectedAccount.balance}`} />
                  <Info label="Equity" value={`$${selectedAccount.equity}`} />
                  <Info label="Margin level" value={`${selectedAccount.margin}%`} />
                  <Info label="Free Margin" value={`$${selectedAccount.freeMargin}`} />
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <button
                    className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition"
                    onClick={() => {
                      setShowDepositModal(true);
                      setSelectedDepositAccount(selectedAccount.login);
                    }}
                  >
                    Deposit
                  </button>
                  <button
                    className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition"
                    onClick={() => setShowWithdrawModal(true)}
                  >
                    Withdraw
                  </button>
                  <button
                    className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition"
                    onClick={() => setShowTradesModal(true)}
                  >
                    Trades
                  </button>
                  <button
                    className="bg-gold text-black w-30 px-4 py-2 rounded hover:bg-white transition"
                    onClick={() => setShowSettingsModal(true)}
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          <DepositModal
            showDepositModal={showDepositModal}
            setShowDepositModal={setShowDepositModal}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cheeseAmount={cheeseAmount}
            setCheeseAmount={setCheeseAmount}
            currency={currency}
            setCurrency={setCurrency}
            convertedAmount={convertedAmount}
            selectedDepositAccount={selectedDepositAccount}
          />

          {/* Withdraw Modal */}
          {showWithdrawModal && (
            <Withdraw onClose={() => setShowWithdrawModal(false)} />
          )}

          <TradesModal
            showTradesModal={showTradesModal}
            setShowTradesModal={setShowTradesModal}
            selectedAccount={selectedAccount}
          />

          <SettingsModal
            showSettingsModal={showSettingsModal}
            setShowSettingsModal={setShowSettingsModal}
            selectedAccount={selectedAccount}
            newLeverage={newLeverage}
            setNewLeverage={setNewLeverage}
            selectedPasswordType={selectedPasswordType}
            setSelectedPasswordType={setSelectedPasswordType}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPasswords={showPasswords}
            setShowPasswords={setShowPasswords}
          />
        </div>
      </main>

      <style>{`
        .text-gold { color: #FFD700; }
        .border-gold { border-color: #FFD700; }
        .bg-gold { background-color: #FFD700; }
      `}</style>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="p-3 bg-black border border-[#333] rounded-lg">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-gold text-base font-semibold">{value}</p>
    </div>
  );
}
