import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const PreviousReports = () => {
  const [previousReports, setPreviousReports] = useState([]);

  useEffect(() => {
    const handlePreviousReports = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/premium/downloads`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          toast(data.message);
          return;
        }

        const data = await response.json();
        console.log(data);
        setPreviousReports(data.reports);
      } catch (error) {
        toast("Failed to fetch previous reports.");
      }
    };

    handlePreviousReports();
  }, []);

  return (
    <>
      <motion.div
        className="absolute top-32 right-0 previous-reports mt-6 shadow-2xl rounded-lg bg-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg font-bold mt-4 mb-2 text-center">
          Previous Reports
        </h2>
        {previousReports.length === 0 ? (
          <p className="text-center">No previous reports found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-600 text-white">
              <tr>
                <th className="py-2 px-4 border-b">S.No</th>
                <th className="py-2 px-4 border-b">Month</th>
                <th className="py-2 px-4 border-b">Year</th>
                <th className="py-2 px-4 border-b">Download Link</th>
              </tr>
            </thead>
            <tbody>
              {previousReports.map((report, index) => (
                <tr key={index} className="border-b bg-white hover:bg-gray-300">
                  <td className="py-2 px-4 text-center">{index + 1}</td>
                  <td className="py-2 px-4 text-center">
                    {new Date(report.createdAt).getMonth() + 1}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {new Date(report.createdAt).getFullYear()}
                  </td>

                  <td className="py-2 px-4 text-center">
                    <a
                      href={report.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </>
  );
};

export default PreviousReports;
