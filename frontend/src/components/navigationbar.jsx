import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoDiamond } from "react-icons/io5";
import { authAction } from "../store/store";

const NavigationBar = () => {
  const navigate = useNavigate();
  const isPremiumUser =
    useSelector((state) => state.auth.isPremiumUser) ||
    localStorage.getItem("isPremium");
  const userLoggedIn =
    useSelector((state) => state.auth.isLoggedIn) ||
    localStorage.getItem("isLoggedIn");
  const [openHomeNav, setHomeNav] = useState(false);
  const [openProfileView, setProfileView] = useState(false);

  const dispatch = useDispatch();
  const toggleHomeNavBar = () => {
    setHomeNav(!openHomeNav);
  };
  const toggleProfileView = () => {
    setProfileView(!openProfileView);
  };

  const userProfile = {
    image: "https://via.placeholder.com/100", // Replace with actual image source
    name: "John Doe", // Replace with actual user name
    email: "john.doe@example.com", // Replace with actual user email
    contact: "+1234567890", // Replace with actual user contact
  };

  const handleRazorPayButtonClick = async (e) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/purchase/premiummembership",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    const options = {
      key: data.key_id,
      order_id: data.order.id,
      handler: async function (response) {
        const updateResponse = await fetch(
          "http://localhost:3000/purchase/updatetransactionstatus",
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
          dispatch(authAction.setIsPremium(true));
        }
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", function (response) {
      console.log(response);
      toast("Something went wrong");
    });
  };

  return (
    <>
      <nav className="bg-[#060606] text-white p-4 shadow-lg">
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
            <Link
              to={userLoggedIn ? "/Home" : "#"}
              onClick={(e) => {
                if (!userLoggedIn) {
                  e.preventDefault();
                  toast.warning("Please Log In");
                }
              }}
              className="hover:underline"
            >
              Home
            </Link>
            <Link to="#" onClick={toggleHomeNavBar} className="hover:underline">
              Expenses
            </Link>
            <Link to="#" className="hover:underline">
              Reports
            </Link>
            <Link to="#" className="hover:underline">
              Settings
            </Link>
            <Link
              to="#"
              onClick={toggleProfileView}
              className="hover:underline"
            >
              <FaUserCircle className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {openProfileView && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-4 w-64 bg-[#d6d6d6] text-black p-4 shadow-lg rounded-lg z-50"
          >
            <div className="flex flex-col items-center">
              <img
                src={userProfile.image}
                alt="User Profile"
                className="w-20 h-20 rounded-full mb-4"
              />
              <h3 className="text-lg font-semibold">{userProfile.name}</h3>
              <p className="text-sm text-gray-600">{userProfile.email}</p>
              <p className="text-sm text-gray-600">{userProfile.contact}</p>
              {!isPremiumUser ? (
                <button
                  onClick={handleRazorPayButtonClick}
                  className="mt-4 px-4 py-2 bg-[#7b39ff] text-white rounded-md"
                >
                  Buy Premium
                </button>
              ) : (
                <p>
                  <IoDiamond />
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
