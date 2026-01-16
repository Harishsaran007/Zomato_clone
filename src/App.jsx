import React from 'react'
import Home from './Pages/Home/Home'
import { Button } from "@/components/ui/button";
import Navbar from './Components/Navbar/Navbar';
import Deliver from './Components/Deliver/Deliver';

const App = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Navbar />
      <Home />
      
    </div>

  )
}

export default App
