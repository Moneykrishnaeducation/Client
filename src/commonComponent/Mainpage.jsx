import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useTheme } from '../context/ThemeContext';
import ChatBot from './ChatBox';

const Main = ({ isSidebarOpen, setIsSidebarOpen, children }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full ${!isSidebarOpen ? 'lg:ml-[16vw]' : ''}`}>
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <ChatBot/>
      {loading ? (
        <div className={`flex items-center justify-center overflow-auto h-[90vh] ${isDarkMode ? 'bg-black' : 'bg-white'} transition-all duration-300 ease-in-out`}>
          <div class="w-10 h-10 border-4 border-gray-600 border-t-yellow-500 border-s-yellow-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div onClick={() => setIsSidebarOpen(false)} className={`overflow-auto h-[90vh] ${isDarkMode ? 'bg-black' : 'bg-white'} transition-all duration-300 ease-in-out `}>{children}</div>
      )}
    </div>
  );
};

export default Main;
