import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import React Toastify
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";

const HomeNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isPremiumUser = useSelector((state) => state.auth.isPremiumUser);

  const getFilterFromQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("filter");
  };

  const currentFilter = getFilterFromQuery();

  const handleNavClick = (e, filter) => {
    if (!isPremiumUser) {
      e.preventDefault();
      toast.error("Subscribe to check premium features 😗");
    } else {
      navigate(`/expenses?filter=${filter}`);
    }
  };

  return (
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex space-x-4">
        {/* Premium feature - Monthly Expenses */}

        <NavLink
          to="/expenses?filter=weekly"
          onClick={(e) => handleNavClick(e, "weekly")}
          className={
            currentFilter === "weekly"
              ? "bg-lime-400 px-3 py-2 rounded-md text-sm font-medium"
              : "px-3 py-2 rounded-md text-sm font-medium hover:bg-lime-300"
          }
        >
          Weekly Expenses
        </NavLink>

        <NavLink
          to="/expenses?filter=monthly"
          onClick={(e) => handleNavClick(e, "monthly")}
          className={
            currentFilter === "monthly"
              ? "bg-lime-400 px-3 py-2 rounded-md text-sm font-medium"
              : "px-3 py-2 rounded-md text-sm font-medium hover:bg-lime-300"
          }
        >
          Monthly Expenses
        </NavLink>

        {/* Premium feature - Yearly Expenses */}
        <NavLink
          to="/expenses?filter=yearly"
          onClick={(e) => handleNavClick(e, "yearly")}
          className={
            currentFilter === "yearly"
              ? "bg-lime-400 px-3 py-2 rounded-md text-sm font-medium"
              : "px-3 py-2 rounded-md text-sm font-medium hover:bg-lime-300"
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
        <button className="ml-2 px-3 py-2 bg-black rounded-md text-sm text-white font-medium">
          Search
        </button>
      </div>
    </div>
  );
};

export default HomeNav;
