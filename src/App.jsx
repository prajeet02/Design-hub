import React from 'react';
import Navbar from './components/navbar/navbar';
import './App.css';



function App() {
  return (
    <>
      <div className=''>
       <Navbar/>
       <div className="content">
        <h1>Welcome to the Website</h1>
        <p>Scroll down to see the logo shrink and navbar appear.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
      </div>
    </>
  );
}
 
export default App;
