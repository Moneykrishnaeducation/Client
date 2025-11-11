import React from 'react'

const Navbar = () => {
  return (
   <nav className="bg-black text-white px-10 h-screen" id="sidebar">
        <div class="logo" id="logo">
          <img class="logo-img-main" src="https://vtindex.com/img/logo/logo.svg" alt="logo" href="#" onclick="loadpage('dashboard')" />
        </div>

        <div class="flex flex-col gap-10  my-5" id="nav-content">
          <a href="#" onclick="loadpage('dashboard')" aria-label="Go to Dashboard">
            <div class="nav-item" id="dashboard">
              <i class="fa-solid fa-house"></i>
              <span>Dashboard</span>
            </div>
          </a>

          <a href="#" onclick="loadpage('trading')" aria-label="View Trading Accounts">
            <div class="nav-item" id="tradingaccounts">
              <i class="fa-solid fa-wallet"></i>
              <span>Trading Accounts</span>
            </div>
          </a>

          <a href="#" onclick="loadpage('social')" aria-label="View Social Trading">
            <div class="nav-item" id="socialtrading">
              <i class="fa-solid fa-people-group"></i>
              <span>Social Trading</span>
            </div>
          </a>

          <a href="#" onclick="loadpage('partnership')" aria-label="View Partnership">
            <div class="nav-item" id="partnership">
              <i class="fa-solid fa-handshake"></i>
              <span>Partnership</span>
            </div>
          </a>


          <a href="#" onclick="loadpage('platform')" aria-label="View Platform">
            <div class="nav-item" id="platform">
              <i class="fa-solid fa-desktop"></i>
              <span>Platform</span>
            </div>
          </a>
                    <a href="#" onclick="loadpage('tickers')" aria-label="View tickers">
            <div class="nav-item" id="tickers">
              <i class="fa-solid fa-ticket"></i>
              <span>Ticket</span>
            </div>
            </a>
                    <a href="#" onclick="loadpage('transactions')" aria-label="View transactions">
            <div class="nav-item" id="transactions">
              <i class="fa-solid fa-arrow-right-arrow-left"></i>
              <span>Transactions</span>
            </div>
          </a>
          <a href="#" onclick="loadpage('economic')" aria-label="View Economic Calendar">
            <div class="nav-item" id="economic-calendar">
              <i class="fa-solid fa-calendar-days"></i>
              <span>Economic Calendar</span>
            </div>
          </a>

            <a href="#" onclick="loadpage('support')" aria-label="View Support">
            <div class="nav-item" id="support">
                <i class="fa-solid fa-headset"></i>
                <span>Terms & Conditions</span>
            </div>
            </a>
          </div>
  </nav>
  )
}

export default Navbar