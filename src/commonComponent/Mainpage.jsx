import React from 'react';
import Header from './Header';
import { useTheme } from '../context/ThemeContext';
import ChatBot from './ChatBox';

const Main = ({ isSidebarOpen, setIsSidebarOpen, children }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`w-full ${!isSidebarOpen ? 'lg:ml-[16vw]' : ''}`}>
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <ChatBot/>
      <div onClick={() => setIsSidebarOpen(false)} className={`overflow-auto h-[90vh] ${isDarkMode ? 'bg-black' : 'bg-white'} transition-all duration-300 ease-in-out `}>{children}</div>
    </div>
  );
};

export default Main;
