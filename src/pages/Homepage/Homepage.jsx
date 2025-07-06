import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/footer';
import './Homepage.module.scss';
import PerformerSection from '../../features/Homepage/performerSection/PerformerSection';

function Homepage() {
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
      <PerformerSection/>
      <Footer/>
      </div>
    </>
  );
}
 
export default Homepage;
