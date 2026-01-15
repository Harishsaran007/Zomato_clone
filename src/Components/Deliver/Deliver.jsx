import React from 'react'
import img2 from '../../assets/img2.jpg'
import { Button } from '../ui/button'

const Deliver = () => {
  return (
    <div
      className="w-full h-[300px] relative bg-cover bg-[center_70%]"
      style={{ backgroundImage: `url(${img2})` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex ">
            <Button className="bg-black/50 text-white px-6 py-2 rounded-none font-medium shadow hover:bg-black">
            Delivery
            </Button>
            <Button className="bg-black/50 text-white px-6 py-2 font-medium rounded-none shadow hover:bg-black">
            Dining
            </Button>
            <Button className="bg-black/50 text-white px-6 py-2  font-medium rounded-none shadow hover:bg-black">
            Nightlife
            </Button>
        </div>
    </div>
  )
}

export default Deliver
