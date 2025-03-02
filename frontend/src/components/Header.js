import { useState, useEffect } from "react";
import logo from "../assets/Logo.png";

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    return windowWidth;
  };

const Header = () => {
  const width = useWindowWidth();
  return (
    <header className="Header">
      <img className = "logo" src={logo} alt="Logo" />
    </header>
  );
};

export default Header;
