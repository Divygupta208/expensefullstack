import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/premium/leaderboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }

      const data = await response.json();

      setLeaderboard(data.leaderboard);
    } catch (error) {
      toast.error("Failed to load leaderboard");
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-4 mb-60"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Top Users</h1>
        <div className="overflow-x-auto rounded-lg border-2 ">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-400">
                <th className="p-4 border border-gray-300 text-left">Rank</th>
                <th className="p-4 border border-gray-300 text-left">User</th>
                <th className="p-4 border border-gray-300 text-left">Email</th>
                <th className="p-4 border border-gray-300 text-left">
                  Total Expenses
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((user, index) => (
                  <tr
                    key={user.email}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-300 transition`}
                  >
                    <td className="p-4 border border-gray-300">{index + 1}</td>
                    <td className="p-4 border border-gray-300">{user.name}</td>
                    <td className="p-4 border border-gray-300">{user.email}</td>
                    <td className="p-4 border border-gray-300">
                      ${user.totalExpense.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeaderBoard;
