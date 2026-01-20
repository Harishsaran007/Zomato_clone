import React from 'react'
import Home from './Pages/Home/Home'
import Details from './Pages/Details/Details'
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter,Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen overflow-x-hidden">
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<Details />} />
          </Routes>    
      </div>
    </BrowserRouter>

  )
}

export default App
