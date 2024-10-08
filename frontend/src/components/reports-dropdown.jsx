import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useRef } from "react";

const ReportsDropdown = ({ isPremiumUser }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col">
        <button
          onClick={(e) => {
            if (!isPremiumUser) {
              e.preventDefault();
              toast.info("Please subscribe to access this feature.");
            } else {
              navigate("/premium?feature=leaderboard");
            }
          }}
          className="py-2 px-4 hover:bg-lime-300 rounded-md text-start"
        >
          Leaderboard
        </button>
        <button
          onClick={(e) => {
            navigate("/premium?feature=reports");
          }}
          className="py-2 px-4 hover:bg-lime-300 rounded-md text-start"
        >
          Reports
        </button>
      </div>
    </>
  );
};

export default ReportsDropdown;
