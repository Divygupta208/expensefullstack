import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import React Toastify
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import Searched from "./searched";

const HomeNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const expenses = useSelector((state) => state.expense.items);

  const searchExpenses = (query) => {
    console.log(query);

    const normalizedQuery = query.toLowerCase().trim();

    const results = expenses.filter(
      (expense) =>
        expense.description.toLowerCase().includes(normalizedQuery) ||
        expense.category.toLowerCase().includes(normalizedQuery)
    );

    return results;
  };

  const handleSearch = () => {
    setIsSearch(true);
    if (searchQuery.trim() !== "") {
      const results = searchExpenses(searchQuery);
      setSearchResults(results);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearch(true);

    if (query.trim() !== "") {
      const results = searchExpenses(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

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
    <div>
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
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button
            className="ml-2 px-3 py-2 bg-black rounded-md text-sm text-white font-medium"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      {isSearch && <Searched searchResults={searchResults} />}
    </div>
  );
};

export default HomeNav;
