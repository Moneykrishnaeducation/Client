import React, { useState } from 'react'
import Navbar from './commonComponent/Navbar'
import Main from './commonComponent/Main'

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='w-screen flex'>
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
      <Main isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
    </div>
  )
}

export default App
