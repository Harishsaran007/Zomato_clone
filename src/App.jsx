import React from 'react'
import Home from './Pages/Home/Home'
import { Button } from "@/components/ui/button";
import Navbar from './Components/Navbar/Navbar';
import Deliver from './Components/Deliver/Deliver';

const App = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full max-w-[1200px] mx-auto">
        <Home />
      </div>
    </div>

  )
}

export default App
