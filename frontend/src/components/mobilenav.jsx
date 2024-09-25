import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { authAction } from "../store/store";
import ProfileView from "./viewprofile";
import HomeNav from "./expensesnav";
import Searched from "./searched";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [openReportsDropdown, setReportsDropdown] = useState(false);
  const [openExpensesDropdown, setExpensesDropdown] = useState(false);
  const [openProfileView, setProfileView] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  let isPremiumUser = useSelector((state) => state.auth.isPremiumUser);
  const userLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const location = useLocation();

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

  const getFilterFromQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("filter");
  };

  const currentFilter = getFilterFromQuery();

  const handleNavClick = (e, filter) => {
    if (!isPremiumUser) {
      e.preventDefault();
      closeSidebar();
      toast.error("Subscribe to check premium features 😗");
    } else {
      navigate(`/expenses?filter=${filter}`);
      closeSidebar();
    }
  };

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    if (!userLoggedIn) {
      toast.warning("Please Log In");
      navigate("/auth?mode=login");
    } else {
      setActiveLink("Home");
      navigate("/Home");
    }
    closeSidebar();
  };

  const handleUserLogOut = (e) => {
    e.preventDefault();
    dispatch(authAction.logout());
    navigate("/auth?mode=login");
    closeSidebar();
  };

  const toggleProfileView = (e) => {
    e.preventDefault();
    if (!userLoggedIn) {
      toast.info("Please Log In 😒");
    } else {
      setProfileView(!openProfileView);
      closeSidebar();
    }
  };

  const toggleReportsDropdown = (e) => {
    e.preventDefault();
    if (!userLoggedIn) {
      toast.info("Please Log In 😒");
    } else {
      setActiveLink("reports");
      setReportsDropdown(!openReportsDropdown);
    }
  };
  const toggleExpensesDropdown = (e) => {
    e.preventDefault();
    if (!userLoggedIn) {
      toast.info("Please Log In");
    } else {
      setActiveLink("expensenav");
      setExpensesDropdown(!openExpensesDropdown);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Hamburger Menu Button */}

      <div className="md:hidden fixed top-3 right-4 z-50 flex gap-7 bg-white shadow-xl rounded-lg">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search expenses"
            className="px-4 py-2 rounded-md text-gray-900"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button
            className="ml-2 px-3 py-2 bg-white rounded-md text-sm text-white font-medium"
            onClick={handleSearch}
          >
            🔍
          </button>
        </div>

        <FaBars
          className="text-2xl cursor-pointer mr-2"
          onClick={toggleSidebar}
        />
      </div>

      {isSearch && (
        <div className="absolute md:hidden top-14 bg-[#dfe4ff] w-[80vw] h-[50vh] z-40 left-10 rounded-xl">
          <button
            className="p-1 bg-black rounded-full w-10 ml-60 mt-4 text-white font-bold"
            onClick={(e) => {
              setIsSearch(false);
            }}
          >
            X
          </button>
          <Searched searchResults={searchResults} />
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 h-full w-3/4 bg-white shadow-lg z-50"
          >
            <div className="p-4">
              <div className="text-lg font-bold flex items-center mb-6">
                <img
                  src="public/logoipsum-223.svg"
                  className="w-10 h-10"
                  alt="Logo"
                />
                <span className="ml-2">ExpenseDaily</span>
              </div>

              {/* Main Links */}
              <ul className="space-y-6">
                <li>
                  <NavLink
                    to={userLoggedIn ? "/Home" : ""}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      isActive
                        ? "text-orange-500 font-bold"
                        : "hover:text-orange-500 font-bold"
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={toggleExpensesDropdown}
                    className="w-full text-left font-bold"
                  >
                    Expenses {openExpensesDropdown ? `▲` : `▼`}
                  </button>
                  <AnimatePresence>
                    {openExpensesDropdown && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-4 space-y-5 mt-3"
                      >
                        {/* Expense Links */}
                        <li>
                          <NavLink
                            to="/expenses?filter=monthly"
                            onClick={handleNavClick}
                            className={
                              currentFilter === "weekly"
                                ? "bg-lime-400 px-3 py-2 rounded-md text-sm font-medium"
                                : "px-3 py-2 rounded-md text-sm font-medium bg-lime-300"
                            }
                          >
                            Monthly Expenses
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/expenses?filter=weekly"
                            onClick={handleNavClick}
                            className={
                              currentFilter === "weekly"
                                ? "bg-lime-400 px-3 py-2 rounded-md text-sm font-medium"
                                : "px-3 py-2 rounded-md text-sm font-medium bg-lime-300"
                            }
                          >
                            Weekly Expenses
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/expenses?filter=yearly"
                            onClick={handleNavClick}
                            className={
                              currentFilter === "weekly"
                                ? "bg-lime-400 px-3 py-2 rounded-md text-sm font-medium"
                                : "px-3 py-2 rounded-md text-sm font-medium bg-lime-300"
                            }
                          >
                            Yearly Expenses
                          </NavLink>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                <li>
                  <button
                    onClick={toggleReportsDropdown}
                    className="w-full text-left font-bold"
                  >
                    Reports {openReportsDropdown ? `▲` : `▼`}
                  </button>
                  <AnimatePresence>
                    {openReportsDropdown && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-4 space-y-5 mt-3 text-sm font-semibold"
                      >
                        <li>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (!isPremiumUser) {
                                toast.info("Subscribe To See");
                                closeSidebar();
                              } else {
                                navigate("/premium?feature=leaderboard");
                              }
                            }}
                            className={"bg-amber-300 p-1 rounded-md"}
                          >
                            Leaderboard
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (!isPremiumUser) {
                                toast.info("Subscribe To See");
                                closeSidebar();
                              } else {
                                navigate("/premium?feature=reports");
                              }
                            }}
                            className={"bg-amber-300 p-1 rounded-md"}
                          >
                            Overall Reports
                          </button>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                <li>
                  <NavLink
                    to=""
                    className={({ isActive }) =>
                      isActive
                        ? "text-orange-500 font-bold"
                        : "hover:text-orange-500 font-bold"
                    }
                  >
                    Settings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to=""
                    onClick={toggleProfileView}
                    className={({ isActive }) =>
                      isActive
                        ? "text-indigo-500 font-bold"
                        : "hover:text-indigo-500 font-bold"
                    }
                  >
                    <FaUserCircle className="w-5 h-5 inline mr-2" />
                    Profile
                  </NavLink>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openProfileView && (
          <motion.div
            initial={{ opacity: 1, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 md:top-16 md:w-64 md:right-4 w-[100vw] h-[100vh]  md:border-none border-t-2  bg-[#fff] text-black font-semibold p-4 shadow-lg rounded-lg z-40"
          >
            <ProfileView
              isPremiumUser={isPremiumUser}
              handleUserLogOut={handleUserLogOut}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
