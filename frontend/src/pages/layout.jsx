import React from "react";
import SignupPage from "./signuppage";
import NavigationBar from "../components/navigationbar";
import Footer from "../components/footer";
import { Outlet } from "react-router-dom";
import MobileNav from "../components/mobilenav";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <NavigationBar />
      <MobileNav />
      <Outlet />
    </div>
  );
};

export default Layout;
