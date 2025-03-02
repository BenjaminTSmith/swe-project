import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return (
    <div className="App">
      <Header title="Tutors4U(F)" />
      <Outlet />
    </div>
  );
};

export default Layout;
