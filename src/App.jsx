
import Navbar from "./components/navbar/Navbar";
import "./App.css";
import HeroSection from "./features/home/herosection/HeroSection";
import RotatingCard from "./components/card/rotatingcard/RotatingCard";
import Homepage from "./pages/Homepage/Homepage";


function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Homepage />

    </>
  );
}

export default App;
