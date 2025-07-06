import React from "react";

import "./App.css";
import Homepage from "./pages/Homepage/Homepage";

import Navbar from "./components/navbar/Navbar";
import "./App.css";

function App() {
  return (
    <>
      <Homepage />

      <div className="">
        <Navbar />
      </div>
    </>
  );
}

export default App;
