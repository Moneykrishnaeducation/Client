import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../commonComponent/Navbar';
import Main from '../commonComponent/Mainpage';
import Dashboard from '../pages/Dashboard';
import TradingAccounts from '../pages/TradingAccounts';
import TermsPage from '../pages/Termspage';
import SocialTrading from '../pages/SocialTrading';
import Tickets from '../pages/Tickets';
import EconomicCalendarWidget from '../pages/EconomicCalendarWidget';
import Platform from '../pages/Platform';
import Partnership from '../pages/Partnership';
import Transactions from '../pages/Transactions';
import MamInvestments from '../pages/MAMInvestments';
import ProfilePage from '../pages/Profile';
import TradingViewFullscreen from '../pages/TradingViewFullscreen';
import PammAccount from '../pages/PammAccount';
import DemoAccountsPage from '../pages/DemoAccountsPage';
import ChatBot from '../commonComponent/ChatBox';

const Routers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  return (
    <ThemeProvider>
      <Router>
        <div className='w-screen flex'>
          <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Main isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal}/>} />
              <Route path="/tradingaccounts" element={<TradingAccounts showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal} />} />
              <Route path="/socialtrading" element={<SocialTrading />} />
              <Route path="/partnership" element={<Partnership/>} />
              <Route path="/platform" element={<Platform/>} />
              <Route path="/tickets" element={<Tickets />}  />
              <Route path="/transactions" element={<Transactions/>} />
              <Route path="/economic-calendar" element={<EconomicCalendarWidget />} />
              <Route path="/support" element={<TermsPage />}  />
              <Route path="/MAMInvestments" element={<MamInvestments />} />
              <Route path="/profile" element={<ProfilePage />}  />
              <Route path="/tradingviewpage" element={<TradingViewFullscreen />}  />
              <Route path='demoAccounts' element={<DemoAccountsPage/>}/>
              <Route path='/PammAccount'element={<PammAccount/>}/>
              </Routes>
          </Main>
        </div>
      </Router>
      <ChatBot />
    </ThemeProvider>
  );
};

export default Routers;
