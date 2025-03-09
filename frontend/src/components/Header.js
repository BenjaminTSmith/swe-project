import { useLocation, Link } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../css/header.css";

const Header = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  return (
    <header className="Header">
      <img className="logo" src={logo} alt="Logo" />

      {!isLoginPage && (
        <nav className="navigation-menu">
          <ul>
            <li className={location.pathname === "/discover" ? "active" : ""}>
              <Link to="/discover">Discover Tutors</Link>
            </li>
            <li className={location.pathname === "/scheduler" ? "active" : ""}>
              <Link to="/scheduler">Tutor Calendar</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
