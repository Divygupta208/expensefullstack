import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const NavigationBar = () => {
  return (
    <nav className="bg-[#060606] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold flex justify-center">
          {" "}
          <img src="public\logoipsum-223.svg" className="w-10 h-10" />
          ExpenseDaily
        </div>
        {/* Navigation Links */}
        <div className="space-x-4 flex items-center gap-5">
          <Link to={"#"} className="hover:underline">
            Home
          </Link>
          <Link to="#" className="hover:underline">
            Expenses
          </Link>
          <Link to="#" className="hover:underline">
            Reports
          </Link>
          <Link to="#" className="hover:underline">
            Settings
          </Link>
          <Link to="#" className="hover:underline ">
            <FaUserCircle className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
