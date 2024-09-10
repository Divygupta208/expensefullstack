import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoDiamond } from "react-icons/io5";
import { useSelector } from "react-redux";

const ProfileView = ({
  isPremiumUser,
  handleRazorPayButtonClick,
  handleUserLogOut,
}) => {
  const userData = useSelector((state) => state.auth.userData);

  return (
    // <motion.div
    //   initial={{ opacity: 0, y: -10 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   exit={{ opacity: 0, y: -10 }}
    //   transition={{ duration: 0.3 }}
    //   className="absolute top-16 w-64 right-4 bg-[#ffffff] text-black p-4 shadow-lg rounded-lg z-50"
    // >
    <div className="flex flex-col items-center">
      <img
        src={userData.image}
        alt="User Profile"
        className="w-20 h-20 rounded-full mb-4"
      />
      <h3 className="text-lg font-semibold">{userData.name}</h3>
      <p className="text-sm text-gray-600">{userData.email}</p>
      <p className="text-sm text-gray-600">{userData.contact}</p>
      {!isPremiumUser ? (
        <button
          onClick={handleRazorPayButtonClick}
          className="mt-4 px-6 py-2 gap-1 bg-[#ff662a] text-white font-semibold rounded-md flex"
        >
          Buy <IoDiamond className="mt-1.5" />
        </button>
      ) : (
        <p>
          <IoDiamond />
        </p>
      )}

      <button
        onClick={handleUserLogOut}
        className="mt-4 px-4 py-2 gap-1 bg-black text-white font-semibold rounded-md flex"
      >
        Log Out
      </button>
    </div>
    // </motion.div>
  );
};

export default ProfileView;
