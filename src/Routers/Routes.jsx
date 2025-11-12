import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../commonComponent/Navbar';
import Main from '../commonComponent/Mainpage';
import Dashboard from '../pages/Dashboard';
import TradingAccounts from '../pages/TradingAccounts';
import TermsPage from '../pages/Termspage';
import SocialTrading from '../pages/SocialTrading';
import Tickets from '../pages/tickets';
import EconomicCalendarWidget from '../pages/EconomicCalendarWidget';
import Platform from '../pages/Platform';
import Partnership from '../pages/Partnership';
import Transactions from '../pages/Transactions';

const Routers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className='w-screen flex'>
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Main isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tradingaccounts" element={<TradingAccounts />} />
            <Route path="/socialtrading" element={<SocialTrading />} />
            <Route path="/partnership" element={<Partnership/>} />
            <Route path="/platform" element={<Platform/>} />
            <Route path="/tickets" element={<Tickets />}  />
            <Route path="/transactions" element={<Transactions/>} />
            <Route path="/economic-calendar" element={<EconomicCalendarWidget />} />
            <Route path="/support" element={<TermsPage />}  />
          </Routes>
        </Main>
      </div>
    </Router>
  );
};

export default Routers;
