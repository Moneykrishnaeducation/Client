import React, { useState } from "react";
import "./MAMInvestments.css";

const MAMInvestments = () => {
  const [activeTab, setActiveTab] = useState("available");

  const managers = [
    {
      name: "VENKATESH R",
      id: "2141712206",
      balance: "$0.0",
      equity: "$0.0",
      profitShare: "10.00%",
      accountAge: "34 days",
      risk: "medium",
      growth: "0%",
    },
    {
      name: "VENKATESH R",
      id: "2141712205",
      balance: "$0.0",
      equity: "$0.0",
      profitShare: "10.00%",
      accountAge: "34 days",
      risk: "medium",
      growth: "0%",
    },
    {
      name: "Siddhi",
      id: "2141712726",
      balance: "$-7.47",
      equity: "$-7.47",
      profitShare: "1.00%",
      accountAge: "28 days",
      risk: "medium",
      growth: "0%",
    },
  ];

  return (
    <div className="mam-main">
      <header className="mam-header">MAM Investments</header>

      <div className="mam-top-bar">
        <div
          className={`mam-tab ${activeTab === "available" ? "active" : ""}`}
          onClick={() => setActiveTab("available")}
        >
          Available Managers
        </div>
        <div
          className={`mam-tab ${activeTab === "investments" ? "active" : ""}`}
          onClick={() => setActiveTab("investments")}
        >
          My Investments
        </div>
        <a href="#" className="mam-manage-btn">
          Go Manage Accounts
        </a>
      </div>

      {activeTab === "available" && (
        <div className="mam-section">
          <div className="mam-section-title">Explore Top MAM Managers</div>
          <div className="mam-card-container">
            {managers.map((m, index) => (
              <div key={index} className="mam-card">
                <h3 className="mam-card-name">{m.name}</h3>
                <p className="mam-card-id">ID: {m.id}</p>

                <div className="mam-card-info">Balance : {m.balance}</div>
                <div className="mam-card-info">Equity : {m.equity}</div>
                <div className="mam-card-info">
                  Profit Share : {m.profitShare}
                </div>
                <div className="mam-card-info">
                  Account Age : {m.accountAge}
                </div>
                <div className="mam-card-info">Risk Level : {m.risk}</div>
                <div className="mam-card-info">Growth : {m.growth}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "investments" && (
        <div className="mam-section">
          <div className="mam-section-title">My Investments</div>
          <p style={{ color: "#aaa", textAlign: "center" }}>
            (No investments found yet)
          </p>
        </div>
      )}
    </div>
  );
};

export default MAMInvestments;
