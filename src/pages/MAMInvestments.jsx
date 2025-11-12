import React, { useEffect } from "react";
import "../css/investmam.css";

const MAMInvestments = () => {
  useEffect(() => {
    // ---- Tab switching logic ----
    const depositTabs = document.querySelectorAll(".deposittab");
    depositTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        depositTabs.forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(".deposit-tab-content").forEach((content) => {
          content.classList.add("hidden-con");
          content.classList.remove("active");
        });
        tab.classList.add("active");
        const tabContent = document.getElementById(tab.dataset.tab);
        if (tabContent) {
          tabContent.classList.remove("hidden-con");
          tabContent.classList.add("active");
        }
      });
    });

    // ---- Popup show/hide ----

    const hideAllPopups = () => {
      ["investor-pop", "manager-pop", "edit-invest"].forEach((id) =>
        document.getElementById(id)?.classList.remove("active")
      );
      document.getElementById("popup-overlay")?.classList.remove("active");
    };

    // Close popups on overlay click
    const overlay = document.getElementById("popup-overlay");
    if (overlay) {
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) hideAllPopups();
      });
    }

    return () => {
      // Cleanup listeners
      depositTabs.forEach((tab) => {
        tab.replaceWith(tab.cloneNode(true));
      });
      if (overlay) overlay.replaceWith(overlay.cloneNode(true));
    };
  }, []);

  // --- Functions for modal handling ---
  const switchTab = (sectionId) => {
    const sections = ["availableManagersSection", "myInvestmentsSection"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = id === sectionId ? "block" : "none";
    });
    document.getElementById("availableManagersTab")?.classList.toggle(
      "active",
      sectionId === "availableManagersSection"
    );
    document.getElementById("myInvestmentsTab")?.classList.toggle(
      "active",
      sectionId === "myInvestmentsSection"
    );
  };

  return (
    <div className="mam-main-con">
      <div className="invest-manager-container">
        <header id="titl-h1">MAM Investments</header>

        <div className="back-menu-btn">
          <a href="/" className="manage-accounts-btn">
            Go Manage Accounts
          </a>
        </div>

        <div className="invest-mam-top-bar">
          <div
            id="availableManagersTab"
            className="tab active"
            onClick={() => switchTab("availableManagersSection")}
          >
            Available Managers
          </div>
          <div
            id="myInvestmentsTab"
            className="tab"
            onClick={() => switchTab("myInvestmentsSection")}
          >
            My Investments
          </div>
        </div>
      </div>

      {/* Available Managers */}
      <div id="availableManagersSection" className="section">
        <div className="explore-ttl-section">Explore Top MAM Managers</div>
        <div className="display-cards" id="managerList">
          {/* JS will populate manager cards */}
        </div>
      </div>

      {/* My Investments */}
      <div id="myInvestmentsSection" className="section" style={{ display: "none" }}>
        <div className="explore-ttl-section">My Investments</div>
        <div id="myInvestmentList" className="my-investment-list"></div>
      </div>

      {/* Overlay for popups */}
      <div className="popup-overlay" id="popup-overlay"></div>
    </div>
  );
};

export default MAMInvestments;
