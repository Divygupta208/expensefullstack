import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import SignupPage from "./pages/signuppage";
import Layout from "./pages/layout";
import UserHomePage from "./pages/UserHomePage";
import { jwtDecode } from "jwt-decode"; // Note: You don't need to use destructuring here
import { useSelector } from "react-redux";
import ReportsPage from "./pages/reportspage";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isPremiumUser = useSelector((state) => state.auth.isPremiumUser);
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Invalid token", error);

        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [token, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<SignupPage />} />
          <Route
            path="/Home"
            element={token ? <UserHomePage /> : <Navigate to="/" />}
          ></Route>

          <Route
            path="reports"
            element={
              isPremiumUser ? <ReportsPage /> : <Navigate to={"/Home"} />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
