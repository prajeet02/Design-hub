import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import "./App.css";

import HeroSection from "./features/home/herosection/HeroSection";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import AboutUs from './pages/AboutUs/AboutUs';
import Performers from './pages/PerformersPage/Performers';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Route - Default Homepage */}
          <Route path="/" element={<Login />} />

          {/* Homepage Route */}
          <Route path="/home" element={
            <>
              <HeroSection />
              <Homepage />
            </>
          } />

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Signup Route */}
          <Route path="/signup" element={<Signup />} />

          {/* About Us Route */}
          <Route path="/about" element={<AboutUs />} />

          <Route path='/performers' element={<Performers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
