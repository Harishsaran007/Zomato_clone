import React from 'react'
import Home from './Pages/Home/Home'
import Details from './Pages/Details/Details'
import Cart from './Pages/Cart/Cart'
import Login from './Pages/Auth/Login'
import Signup from './Pages/Auth/Signup'
import Orders from './Pages/Orders/Orders'
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AddressProvider } from './context/AddressContext';

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<Details />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AddressProvider>
          <CartProvider>
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </CartProvider>
        </AddressProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
