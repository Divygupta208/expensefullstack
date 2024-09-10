import React from "react";

import { useLocation } from "react-router-dom";
import LeaderBoard from "../components/reports";
import UserReports from "../components/user-reports";

const ReportsPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const feature = query.get("feature");
  if (feature === "leaderboard") {
    return <LeaderBoard />;
  } else if (feature === "reports") {
    return <UserReports />;
  } else {
    return <div className="text-6xl text-center">OOPS! Page not found :( </div>;
  }
};

export default ReportsPage;
