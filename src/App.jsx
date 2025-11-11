import React, { useState } from 'react'
import Navbar from './commonComponent/Navbar'
import Routes from './Routers/Routes';

const App = () => {
  return (
    <div className='w-screen flex'>
      <Routes/>
    </div>
  )
}

export default App
