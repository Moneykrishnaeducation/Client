import React from 'react'
import Header from './Header'

const Main = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className={`w-full ${!isSidebarOpen ? 'lg:ml-[16vw]' : ''}`}>
            <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
    </div>
  )
}

export default Main
