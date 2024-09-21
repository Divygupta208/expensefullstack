import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoDiamond } from "react-icons/io5";
import { authAction } from "../store/store";
import { jwtDecode } from "jwt-decode";
import ReportsDropdown from "./reports-dropdown";
import ProfileView from "./viewprofile";
import HomeNav from "./expensesnav";

const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let isPremiumUser = useSelector((state) => state.auth.isPremiumUser);
  const [activeLink, setActiveLink] = useState(null);
  // if (token) {
  //   const decodedToken = jwtDecode(token);
  //   isPremiumUser = decodedToken.isPremium;
  // }
  const userLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [openHomeNav, setHomeNav] = useState(false);
  const [openProfileView, setProfileView] = useState(false);
  const [openReportsDropdown, setReportsDropdown] = useState(false);

  const dispatch = useDispatch();

  const homeNavRef = useRef(null);
  const profileViewRef = useRef(null);
  const reportsDropdownRef = useRef(null);

  const toggleHomeNavBar = (e) => {
    e.preventDefault();
    if (!userLoggedIn) {
      toast.info("Please Log In😒");
    } else {
      setActiveLink("homenav");
      setHomeNav(!openHomeNav);
    }
  };
  const toggleProfileView = (e) => {
    e.preventDefault();
    if (!userLoggedIn) {
      toast.info("Please Log In 😒");
    } else {
      setActiveLink("profile");
      setProfileView(!openProfileView);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (homeNavRef.current && !homeNavRef.current.contains(event.target)) {
        setTimeout(() => {
          setActiveLink(null);
          setHomeNav(false);
        }, 100);
      }

      if (
        profileViewRef.current &&
        !profileViewRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          setActiveLink(null);
          setProfileView(false);
        }, 100);
      }

      if (
        reportsDropdownRef.current &&
        !reportsDropdownRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          setActiveLink(null);
          setReportsDropdown(false);
        }, 100);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = (e) => {
    e.preventDefault();
    if (!userLoggedIn) {
      toast.warning("Please Log In");
      navigate("/auth?mode=login");
    } else {
      setActiveLink("Home");
      navigate("/Home");
    }
  };

  const handleUserLogOut = (e) => {
    e.preventDefault();
    dispatch(authAction.logout());
    navigate("/auth?mode=login");
  };

  const handleRazorPayButtonClick = async (e) => {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/purchase/premiummembership", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    console.log(data);

    const options = {
      key: data.key_id,
      order_id: data.order.id,
      handler: async function (response) {
        const updateResponse = await fetch(
          "/api/purchase/updatetransactionstatus",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            }),
          }
        );

        const result = await updateResponse.json();

        if (result.success) {
          toast("YaY are now a premium user!");
          localStorage.setItem("token", result.token);
          const decodedToken = jwtDecode(result.token);
          const isPremium = decodedToken.isPremium;
          dispatch(authAction.setIsPremium(isPremium));
        } else {
          toast.error("Please Try Again 🫤");
        }
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", async function (response) {
      console.log("Payment Failed: ", response);

      await fetch("/api/purchase/updatetransactionstatus", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: options.order_id,
        }),
      });

      toast("Payment failed. Please try again.");
    });
  };

  return (
    <>
      <nav className=" fixed w-full top-0 bg-white text-black p-4 shadow-xl font-semibold z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-bold flex items-center">
            <img
              src="public/logoipsum-223.svg"
              className="w-10 h-10"
              alt="Logo"
            />
            <span className="ml-2">ExpenseDaily</span>
          </div>

          <div className="space-x-4 flex items-center gap-5">
            <NavLink
              to={userLoggedIn ? "/Home" : ""}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange-500 p-2 rounded-xl"
                  : "bg-white hover:bg-orange-400 p-2 rounded-xl"
              }
            >
              Home
            </NavLink>

            <NavLink
              onClick={toggleHomeNavBar}
              className={
                activeLink === "homenav"
                  ? "bg-orange-500 p-2 rounded-xl"
                  : "hover:bg-orange-400 bg-white p-2 rounded-xl"
              }
            >
              Expenses
            </NavLink>

            <NavLink
              to=""
              onClick={toggleReportsDropdown}
              className={
                activeLink === "reports"
                  ? "bg-orange-500 p-2 rounded-xl"
                  : "hover:bg-orange-400 p-2 rounded-xl"
              }
            >
              Reports
            </NavLink>

            <NavLink
              to=""
              className={
                activeLink === "settings"
                  ? "bg-orange-500 p-2 rounded-xl"
                  : "hover:bg-orange-400 p-2 rounded-xl"
              }
            >
              Settings
            </NavLink>

            <NavLink
              to=""
              onClick={toggleProfileView}
              className={
                activeLink === "profile"
                  ? "bg-indigo-500 p-2 rounded-xl"
                  : "hover:bg-indigo-400 p-2 rounded-xl"
              }
            >
              <FaUserCircle className="w-5 h-5" />
            </NavLink>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {openReportsDropdown && (
          <motion.div
            ref={reportsDropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-40 w-48 bg-[#ffffff] text-black p-4 shadow-lg rounded-lg z-50"
          >
            <ReportsDropdown isPremiumUser={isPremiumUser} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openProfileView && (
          <motion.div
            ref={profileViewRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 w-64 right-4 bg-[#ffffff] text-black p-4 shadow-lg rounded-lg z-50"
          >
            <ProfileView
              isPremiumUser={isPremiumUser}
              handleRazorPayButtonClick={handleRazorPayButtonClick}
              handleUserLogOut={handleUserLogOut}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openHomeNav && (
          <motion.div
            ref={homeNavRef}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 left-0 right-0 bg-gray-100 p-4 text-black z-50 shadow-lg"
          >
            <HomeNav />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;
