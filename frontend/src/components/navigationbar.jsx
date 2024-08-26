import React from "react";

const NavigationBar = () => {
  return (
    <nav className="bg-[#060606] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold flex justify-center">
          {" "}
          <img src="public\logoipsum-223.svg" className="w-10 h-10" />
          Expense Tracker
        </div>
        {/* Navigation Links */}
        <div className="space-x-4">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Expenses
          </a>
          <a href="#" className="hover:underline">
            Reports
          </a>
          <a href="#" className="hover:underline">
            Settings
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
