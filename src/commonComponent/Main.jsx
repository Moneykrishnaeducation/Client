import React from 'react'
import Header from './Header'
import Ticket from '../Maincomponent/Ticket'

const Main = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className={`w-full ${!isSidebarOpen ? 'lg:ml-[16vw]' : ''}`}>
            <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
            <Ticket/>
    </div>
  )
}

export default Main
