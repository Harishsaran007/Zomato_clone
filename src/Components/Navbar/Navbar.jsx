import React from 'react'
import logo from '../../assets/zomato.png'
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from '../ui/button'
import map_pin from '../../assets/map-pin.png'
import { Input } from "@/components/ui/input"


const Navbar = () => {

  const [location, setLocation] = useState("Location");
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border-b border-gray-200 shadow-sm">
      <nav className="w-full max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3">


      <div className="flex-shrink-0">
        <img src={logo} className="h-8 object-contain" />
      </div>

        <div className="flex flex-1 items-center gap-3 px-3">
          <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm text-black/60 hover:bg-gray-100 shadow-sm h-10 ">
                {location}
              </PopoverTrigger>


              <PopoverContent className=" p-2 text-xs">
                <Command>
                  <CommandInput placeholder="Add your Location" />
                  <CommandList className="max-h-36 overflow-y-auto ">
                    <CommandEmpty>Not Deliverable</CommandEmpty>
                    <CommandGroup>
                      <CommandItem onSelect={()=> {setLocation("Chennai"); setOpen(false); }} className='cursor-pointer py-1.5  pb-0.5 pt-0.5'>Chennai</CommandItem>
                      <CommandItem onSelect={()=> {setLocation("Chidambaram"); setOpen(false); }} className='cursor-pointer py-1.5  pb-0.5 pt-0.5'>Chidambaram</CommandItem>
                      <CommandItem onSelect={()=>{setLocation("Cuddalore"); setOpen(false); }} className='cursor-pointer py-1.5  pb-0.5 pt-0.5'>Cuddalore</CommandItem>
                      <CommandItem onSelect={()=>{setLocation("Bhuvanagiri");setOpen(false); }} className='cursor-pointer py-1.5  pb-0.5 pt-0.5'>Bhuvanagiri</CommandItem>
                      <CommandItem onSelect={()=>{setLocation("Coimbatore"); setOpen(false); }} className='cursor-pointer py-1.5  pb-0.5 pt-0.5'>Coimbatore</CommandItem>
                      <CommandItem onSelect={()=>{setLocation("Vellore"); setOpen(false); }} className='cursor-pointer py-1.5 pb-0.5 pt-0.5'>Vellore</CommandItem>
                      <CommandItem onSelect={()=>{setLocation("Mayiladuthurai"); setOpen(false); }} className='cursor-pointer py-1.5 pb-0.5 pt-0.5'>Mayiladuthurai</CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                  </CommandList>
                </Command>
              </PopoverContent>
          </Popover>
        
        
          <Input 
            placeholder="Search for restaurant, cuisine or a dish"
            className="w-full max-w-[420px] h-10 rounded-lg shadow-sm"
          />
        </div>
        
          <Button className="bg-red-500 h-10 px-6 text-white">
            Login
          </Button>
    </nav>
    </div>
  )
}

export default Navbar
