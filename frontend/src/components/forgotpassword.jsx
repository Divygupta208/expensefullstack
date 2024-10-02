import React, { useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const emailRef = useRef();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;

    try {
      const response = await fetch(
        "http://localhost:3001/api/user/forgotpassword",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast(data.message);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        console.log("Error:", errorData.message || response.statusText);
      }
    } catch (err) {
      toast.error(err);
      console.error("An error occurred:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Forgot Your Password?
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address below and we'll send you instructions to
          reset your password.
        </p>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <motion.button
            type="submit"
            onClick={handleForgotPassword}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-700 text-white py-3 rounded-lg shadow-lg font-semibold tracking-wide"
          >
            Send Reset Link
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
