import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./App.css";

import Home from "./pages/home/Home";
import Performers from "./pages/performers/Performers";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import AboutUs from "./pages/aboutus/AboutUs";
import BecomePerformer from "./pages/creator/BecomePerformer";
	import AdminAnalyticsDashboard from "./pages/admin/AdminAnalyticsDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/aboutus" element={<AboutUs />} />
          <Route exact path="/performers" element={<Performers />} />
				  <Route exact path="/be-performer" element={<BecomePerformer />} />
				  <Route exact path="/admin-dashboard" element={<AdminAnalyticsDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
