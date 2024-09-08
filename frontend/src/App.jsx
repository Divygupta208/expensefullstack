import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import SignupPage from "./pages/signuppage";
import Layout from "./pages/layout";
import UserHomePage from "./pages/UserHomePage";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import ReportsPage from "./pages/reportspage";
import ForgotPasswordPage from "./pages/forgotpasswordpage";
import ResetPassword from "./components/resetpassword";

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
          navigate("/auth?mode=login");
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        navigate("/auth?mode=login");
      }
    }
  }, [token, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Navigate to="/auth?mode=signup" />} />
          <Route path="auth" element={<SignupPage />} />
          <Route
            path="Home"
            element={
              token ? <UserHomePage /> : <Navigate to="/auth?mode=login" />
            }
          />
          <Route
            path="reports"
            element={isPremiumUser ? <ReportsPage /> : <Navigate to="/Home" />}
          />
        </Route>
        <Route path="/action" element={<ForgotPasswordPage />} />
        <Route path="/resetpassword/:id" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
