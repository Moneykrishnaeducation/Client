import React, { useState } from "react";
import { ModalWrapper } from "./Dashboard"; // Make sure ModalWrapper is exported
import { X } from "lucide-react";

const Withdraw = ({ onClose }) => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [availableBalance, setAvailableBalance] = useState(120); // Example balance
  const [activeTab, setActiveTab] = useState("bank");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const accounts = [
    { id: "902165", name: "Account 902165", balance: 500 },
    { id: "902166", name: "Account 902166", balance: 300 },
    { id: "902167", name: "Account 902167", balance: 120 },
  ];

  const handleAccountChange = (e) => {
    const accId = e.target.value;
    setSelectedAccount(accId);
    const acc = accounts.find((a) => a.id === accId);
    setAvailableBalance(acc ? acc.balance : 0);
    setAmount("");
    setError("");
  };

  const handleWithdraw = () => {
    if (!selectedAccount) {
      setError("❌ Please select an account.");
      return;
    }
    if (!amount || amount <= 0 || amount > availableBalance) {
      setError("❌ Please enter a valid amount within the withdrawable limit.");
      return;
    }
    alert(`✅ Withdrawn $${amount} from ${selectedAccount}`);
    onClose();
  };

  return (
    <ModalWrapper title="💸 Withdraw Funds" onClose={onClose}>
      <div className="space-y-5">
        {/* Error Message */}
        {error && (
          <div className="bg-red-800 text-red-400 p-2 rounded-md text-sm font-medium shadow-md">
            {error}
          </div>
        )}

        {/* Account Selection */}
        <div>
          <label className="block text-sm text-gray-300 mb-1 font-semibold">Account ID</label>
          <select
            value={selectedAccount}
            onChange={handleAccountChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 border-yellow-500 focus:ring-2 focus:ring-yellow-400 transition-all"
          >
            <option value="">-- Select Account --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Available Balance */}
        <div>
          <label className="block text-sm text-gray-300 mb-1 font-semibold">Available Balance</label>
          <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black font-bold text-lg shadow-md">
            ${availableBalance}
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-lg overflow-hidden border border-yellow-500">
          <div className="flex">
            <button
              className={`flex-1 py-2 font-semibold transition-all ${
                activeTab === "bank"
                  ? "bg-yellow-500 text-black shadow-md"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("bank")}
            >
              Bank Transfer
            </button>
            <button
              className={`flex-1 py-2 font-semibold transition-all ${
                activeTab === "crypto"
                  ? "bg-yellow-500 text-black shadow-md"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("crypto")}
            >
              Crypto Wallet
            </button>
          </div>

          <div className="p-4 bg-gray-900 text-gray-300 space-y-2">
            {activeTab === "bank" ? (
              <div className="space-y-1">
                <strong className="text-yellow-400 block">Bank Transfer</strong>
                <div>Bank Name: <span className="text-white">Bank ABC</span></div>
                <div>Account Number: <span className="text-white">1234567890</span></div>
                <div>Branch: <span className="text-white">Main Branch</span></div>
                <div>IFSC Code: <span className="text-white">IFSC001</span></div>
              </div>
            ) : (
              <div className="space-y-1">
                <strong className="text-yellow-400 block">Crypto Wallet</strong>
                <div>Wallet Address: <span className="text-white">TXYZ123ABC456</span></div>
                <div>Exchange Name: <span className="text-white">Binance</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border-2 border-yellow-500 text-white focus:ring-2 focus:ring-yellow-400 transition-all shadow-inner"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 shadow-md transition-all"
          >
            <X/>
          </button>
          <button
            onClick={handleWithdraw}
            className="flex-1 py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 shadow-md transition-all"
          >
            Withdraw
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default Withdraw;
