import React from 'react';
import Header from './Header';

const Main = ({ isSidebarOpen, setIsSidebarOpen, children }) => {
  return (
    <div className={`w-full transition-all duration-300 ${!isSidebarOpen ? 'lg:ml-[16vw]' : ''}`}>
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div>{children}</div>
    </div>
  );
};

export default Main;
