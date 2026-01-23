import React from 'react'
import logo from '../../assets/zomato.png'
import cart from '../../assets/shopping-cart.png'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { Input } from "@/components/ui/input"
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getProvinces, addAddress, updateAddress, deleteAddress } from '../../services/addressService';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import AddAddressModal from './AddAddressModal';
import AccountDetailsModal from './AccountDetailsModal';


const Navbar = () => {
  const [location, setLocation] = useState("Location");
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressToEdit, setAddressToEdit] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ hotels: [], foods: [] });
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const { getCartItemCount } = useCart();
  const { user, logout } = useAuth();
  const cartItemCount = getCartItemCount();

  // Search Effect with Debounce
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const [hotelsRes, foodsRes] = await Promise.all([
            axios.get(`/api/hotels/?search=${searchQuery}`),
            axios.get(`/api/foods/?search=${searchQuery}`)
          ]);

          setSearchResults({
            hotels: hotelsRes.data,
            foods: foodsRes.data
          });
          setShowResults(true);
        } catch (error) {
          console.error("Search failed", error);
        }
      } else {
        setSearchResults({ hotels: [], foods: [] });
        setShowResults(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchAddresses = async () => {
    if (user) {
      try {
        const data = await getProvinces();
        setAddresses(data);
        // Set default location if available and not already set
        const defaultAddress = data.find(addr => addr.is_default);
        if (defaultAddress && location === "Location") {
          setLocation(defaultAddress.city);
        }
      } catch (error) {
        console.error("Failed to fetch addresses", error);
      }
    }
  };

  React.useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleAddressAdded = async (newAddressData) => {
    try {
      await addAddress(newAddressData);
      fetchAddresses(); // Refresh list
      setLocation(newAddressData.city); // Select the new address
    } catch (error) {
      console.error("Failed to add address", error);
      throw error; // Re-throw for modal to handle if needed
    }
  };

  const handleAddressUpdated = async (id, updatedData) => {
    try {
      await updateAddress(id, updatedData);
      fetchAddresses();
      if (location === addressToEdit.city) {
        setLocation(updatedData.city);
      }
      setAddressToEdit(null);
    } catch (error) {
      console.error("Failed to update address", error);
      throw error;
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      fetchAddresses();
      // If deleted address was selected, reset location or pick another?
      // For now, let's leave it as is or reset to "Location" if it matches
      const deletedAddr = addresses.find(a => a.id === id);
      if (deletedAddr && deletedAddr.city === location) {
        setLocation("Location");
      }
    } catch (error) {
      console.error("Failed to delete address", error);
    }
  };

  const openEditModal = (address) => {
    setAddressToEdit(address);
    setModalOpen(true);
  };

  return (
    <nav className="w-full flex flex-col sm:flex-row sm:items-center gap-3 px-3 sm:px-6 py-3 sm:py-4">
      <Link to={`/`} className="flex-shrink-0">
        <img src={logo} className="h-8 object-contain" />
      </Link>

      <div className="flex flex-1 min-w-0 items-center gap-3 px-1 sm:px-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm text-black/60 hover:bg-gray-100 shadow-sm h-10 ">
            <span className="truncate max-w-[150px]">{location}</span>
          </PopoverTrigger>

          <PopoverContent className="p-0 text-xs w-[250px]" align="start">
            <Command>
              <CommandInput placeholder="Search location..." />
              <CommandList className="max-h-60 overflow-y-auto">
                <CommandEmpty>No address found.</CommandEmpty>
                <CommandGroup heading="Saved Addresses">
                  {addresses.map((addr) => (
                    <CommandItem
                      key={addr.id}
                      value={`${addr.label} ${addr.city}`}
                      onSelect={() => {
                        setLocation(addr.city);
                        setOpen(false);
                      }}
                      className="cursor-pointer py-2 flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{addr.label}</span>
                        <span className="text-gray-500 truncate">{addr.city}</span>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-gray-200 rounded-full opacity-60 hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-32 p-1 z-50" align="end" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-col gap-1">
                            <Button variant="ghost" size="sm" className="justify-start gap-2 h-8 px-2 font-normal" onClick={() => { setOpen(false); openEditModal(addr); }}>
                              <Edit2 className="h-3 w-3" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start gap-2 h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 font-normal" onClick={() => handleDeleteAddress(addr.id)}>
                              <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => { setAddressToEdit(null); setModalOpen(true); setOpen(false); }} className="cursor-pointer text-red-500 font-semibold flex items-center gap-2">
                    <span>+ Add New Location</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <AddAddressModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setAddressToEdit(null); }}
          onAddressAdded={handleAddressAdded}
          addressToEdit={addressToEdit}
          onAddressUpdated={handleAddressUpdated}
        />

        <AccountDetailsModal
          isOpen={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
        />

        <div className="w-full relative">
          <Input
            placeholder="Search for restaurant or a dish"
            className="w-full h-10 min-w-0 rounded-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchQuery) setShowResults(true); }}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />

          {showResults && (searchResults.hotels.length > 0 || searchResults.foods.length > 0) && (
            <div className="absolute top-12 left-0 right-0 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {searchResults.hotels.length > 0 && (
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">Restaurants</h3>
                  {searchResults.hotels.map(hotel => (
                    <div
                      key={hotel.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded-md"
                      onClick={() => {
                        navigate(`/restaurant/${hotel.id}`);
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                    >
                      <img src={hotel.image_url || "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg"} alt={hotel.name} className="h-10 w-10 rounded-md object-cover" />
                      <div>
                        <p className="font-medium text-sm">{hotel.name}</p>
                        <p className="text-xs text-gray-500">{hotel.city}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.hotels.length > 0 && searchResults.foods.length > 0 && <div className="border-t my-1" />}

              {searchResults.foods.length > 0 && (
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">Dishes</h3>
                  {searchResults.foods.map(food => (
                    <div
                      key={food.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded-md"
                      onClick={() => {
                        // Attempt to navigate if hotel info is usable, otherwise show alert
                        // Assuming food.hotel might be the name or ID. API example showed name.
                        // Can't navigate to ID without ID.
                        alert(`Found ${food.name} (${food.food_type === 'veg' ? 'Veg' : 'Non-veg'}). Visit restaurant to order.`);
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                    >
                      <img src={food.image || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"} alt={food.name} className="h-10 w-10 rounded-md object-cover" />
                      <div>
                        <p className="font-medium text-sm">{food.name}</p>
                        <p className="text-xs text-gray-500">
                          {typeof food.hotel === 'object' ? food.hotel.name : food.hotel}
                        </p>
                        <p className="text-xs font-medium">&#8377;{food.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Link to="/cart" className="relative flex-shrink-0">
          <img src={cart} className='h-8 cursor-pointer' />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-semibold truncate max-w-[100px] hidden sm:block cursor-pointer hover:underline"
              onClick={() => setAccountModalOpen(true)}
            >
              {user.username[0].toUpperCase()}
            </span>
            <Link to="/orders">
              <Button variant="ghost" className="h-10 px-3 text-gray-700 hover:text-black hover:bg-gray-100">
                My Orders
              </Button>
            </Link>
            <Button
              onClick={logout}
              variant="outline"
              className="h-10 px-3 sm:px-6 text-red-500 border-red-500 hover:bg-red-50 cursor-pointer"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button className="bg-red-500 h-10 px-3 sm:px-6 text-white cursor-pointer hover:bg-red-600">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
