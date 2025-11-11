import React from 'react'
import Header from './mainComponent/Header'
import Navbar from './mainComponent/Navbar'

const App = () => {
  return (
    <div className='flex items-start'>
      <Navbar/>
      <Header/>
    </div>
  )
}

export default App