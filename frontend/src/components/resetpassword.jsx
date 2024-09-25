import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
const ResetPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/user/resetpassword/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Make sure to specify this
          },
          body: JSON.stringify({ newPassword }), // Send the password as JSON
        }
      );

      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      const data = await response.json();

      toast.success(data.message);
      navigate("/auth?mode=login");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
