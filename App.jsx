import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';

export default function App(){ 
  return (
    <div className="app">
      <header className="header">
        <div className="logo"><Link to="/">MyShop</Link></div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/cart" className="cart-link">Cart</Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>

      <footer className="footer">Made by Aditya Kashyap — Shopping App</footer>
    </div>
  )
}
