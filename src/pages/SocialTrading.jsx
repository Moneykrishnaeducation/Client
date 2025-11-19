import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info as InfoIcon, Plus, Users, X } from "lucide-react";
import { apiRequest } from "./utils/api.js";

// ✔ InfoBox Component
function InfoBox({ label, value }) {
  return (
    <div className="border border-yellow-400 p-3 rounded-md bg-[#1a1a1a]">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default function MamDashboard() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mamAccounts, setMamAccounts] = useState([]);

  const [form, setForm] = useState({
    account_name: "",
    profit_percentage: "",
    risk_level: "Medium",
    leverage: "500x",
    payout_frequency: "Weekly",
    master_password: "",
    investor_password: "",
  });

  const [loggedIn, setLoggedIn] = useState(true); // <- for now assume logged in
  const [accessToken, setAccessToken] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  // ----------------- CSRF Helper -----------------
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // ----------------- Fetch CSRF Token -----------------
  useEffect(() => {
    fetch("/api/csrf/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken);
      });
  }, []);

  // ----------------- Handle Form Input -----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // ----------------- Submit MAM Account -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedIn) {
      alert("You must be logged in first!");
      return;
    }

    const csrf = getCookie("csrftoken");

    try {
      const response = await fetch("mam-accounts/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf,
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        alert("MAM Account Created Successfully!");

        setMamAccounts((prev) => [
          ...prev,
          { ...data.mam_account, enabled: data.mam_account.is_enabled || true },
        ]);

        // Reset form
        setForm({
          account_name: "",
          profit_percentage: "",
          risk_level: "Medium",
          leverage: "500x",
          payout_frequency: "Weekly",
          master_password: "",
          investor_password: "",
        });

        setShowModal(false);
      } else {
        const errorData = await response.json();
        alert("Error: " + JSON.stringify(errorData));
      }
    } catch (err) {
      console.error("Create MAM Account Error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-white p-6">

      <h2 className="text-2xl font-bold mb-2 text-center">
        Multi-Account Manager
      </h2>

      {/* Info Button */}
      <div className="flex w-full justify-end gap-1 px-10 text-sm mb-4">
        <InfoIcon className="w-4 h-4 text-blue-400" />
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-blue-400 hover:underline"
        >
          Know what it is?
        </button>
      </div>

      {showInfo && (
        <div className="mb-6 bg-gray-900/70 p-6 rounded-md text-gray-300 max-w-3xl w-[90%] text-left">
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">
            Understanding MAM Accounts
          </h3>
          <p className="text-sm mb-2">
            <strong>Manager Trades, Auto-Copied:</strong> All trades made by the
            manager are automatically copied to investor accounts.
          </p>
          <p className="text-sm mb-3">
            <strong>Proportional Lot Sizing:</strong> The system adjusts lot
            size based on investment balance.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-6 mb-6 max-w-5xl">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#FFD700] text-black font-semibold py-3 px-5 rounded-md hover:bg-yellow-400 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New MAM Manager Account
        </button>

        <button
          onClick={() => navigate("/MAMInvestments")}
          className="bg-[#FFD700] text-black font-semibold py-3 px-14 rounded-md hover:bg-yellow-400 flex items-center gap-2"
        >
          <Users className="w-4 h-4" /> Invest in a MAM Account
        </button>
      </div>

      {/* Accounts Table */}
      {mamAccounts.length > 0 && (
        <div className="overflow-x-auto w-[90%] max-w-6xl mb-6">
          <table className="min-w-full text-left">
            <thead className="bg-gray-800 text-yellow-400">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Account Name</th>
                <th className="px-4 py-2">Profit Sharing</th>
                <th className="px-4 py-2">Leverage</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {mamAccounts.map((acc) => (
                <tr
                  key={acc.id}
                  className="bg-[#1a1a1a] hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2">{acc.id}</td>
                  <td className="px-4 py-2">{acc.account_name}</td>
                  <td className="px-4 py-2">{acc.profit_percentage}%</td>
                  <td className="px-4 py-2">{acc.leverage}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      acc.enabled ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {acc.enabled ? "Enabled" : "Disabled"}
                  </td>
                  <td className="px-4 py-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE ACCOUNT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-yellow-400">
                Create New MAM Account
              </h2>
              <X
                className="w-6 h-6 cursor-pointer text-gray-400 hover:text-yellow-400"
                onClick={() => setShowModal(false)}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Account Name</label>
                <input
                  type="text"
                  id="account_name"
                  value={form.account_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Profit Sharing (%)
                </label>
                <input
                  type="number"
                  id="profit_percentage"
                  value={form.profit_percentage}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Risk Level</label>
                <select
                  id="risk_level"
                  value={form.risk_level}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Leverage</label>
                <select
                  id="leverage"
                  value={form.leverage}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800"
                >
                  <option>50x</option>
                  <option>100x</option>
                  <option>200x</option>
                  <option>500x</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Payout Frequency</label>
                <select
                  id="payout_frequency"
                  value={form.payout_frequency}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800"
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Half-Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Master Password</label>
                <input
                  type="password"
                  id="master_password"
                  value={form.master_password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Investor Password
                </label>
                <input
                  type="password"
                  id="investor_password"
                  value={form.investor_password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 px-4 py-2 rounded text-black font-semibold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
