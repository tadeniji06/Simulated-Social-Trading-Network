import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UseAuth } from "../context/UseAuth";
import Header from "./Header";
import Footer from "./Footer";
import RightBar from "./RightBar";

const Layout = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = UseAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div>
      {isAuthenticated && <Header />}
      {isAuthenticated && <RightBar />}
      <Outlet />
      <Footer />
      <Toaster position='top-left' />
    </div>
  );
};

export default Layout;
