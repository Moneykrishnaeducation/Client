import React from 'react';
import Header from './Header';

const Main = ({ isSidebarOpen, setIsSidebarOpen, children }) => {
  return (
    <div className={`w-full ${!isSidebarOpen ? 'lg:ml-[16vw]' : ''}`}>
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div onClick={() => setIsSidebarOpen(false)} className='overflow-auto h-[90vh] bg-black transition-all duration-300 ease-in-out '>{children}</div>
    </div>
  );
};

export default Main;
