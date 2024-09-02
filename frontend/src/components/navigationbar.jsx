import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavigationBar = () => {
  const navigate = useNavigate();
  const userLoggedIn =
    useSelector((state) => state.auth.isLoggedIn) ||
    localStorage.getItem("isLoggedIn");
  const [openHomeNav, setHomeNav] = useState(false);
  const toggleHomeNavBar = () => {
    setHomeNav(!openHomeNav);
  };

  const handleHomeClick = () => {
    if (userLoggedIn) {
      navigate("/Home");
    } else {
      toast.warning("Please Log In");
    }
  };

  return (
    <>
      <nav className="bg-[#060606] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-bold flex items-center">
            <img
              src="public\logoipsum-223.svg"
              className="w-10 h-10"
              alt="Logo"
            />
            <span className="ml-2">ExpenseDaily</span>
          </div>

          <div className="space-x-4 flex items-center gap-5">
            <Link onClick={handleHomeClick} className="hover:underline">
              Home
            </Link>
            <Link to="/" onClick={toggleHomeNavBar} className="hover:underline">
              Expenses
            </Link>
            <Link to="#" className="hover:underline">
              Reports
            </Link>
            <Link to="#" className="hover:underline">
              Settings
            </Link>
            <Link to="#" className="hover:underline">
              <FaUserCircle className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {openHomeNav && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 bg-black p-4 text-white z-50"
          >
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex space-x-4">
                <NavLink
                  to="/Home/daily"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                      : "px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500"
                  }
                >
                  Daily Expenses
                </NavLink>
                <NavLink
                  to="/Home/monthly"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                      : "px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500"
                  }
                >
                  Monthly Expenses
                </NavLink>
                <NavLink
                  to="/Home/yearly"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                      : "px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500"
                  }
                >
                  Yearly Expenses
                </NavLink>
              </div>

              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search expenses"
                  className="px-4 py-2 rounded-md text-gray-900"
                />
                <button className="ml-2 px-3 py-2 bg-green-500 rounded-md text-sm font-medium">
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;
