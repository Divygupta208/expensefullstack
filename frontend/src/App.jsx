import { Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/signuppage";
import Layout from "./pages/layout";

import UserHomePage from "./pages/UserHomePage";
import { useSelector } from "react-redux";

function App() {
  const userLoggedIn =
    useSelector((state) => state.auth.isLoggedIn) ||
    localStorage.getItem("isLoggedIn");

  return (
    <>
      <Routes>
        <Route path="/" element=<Layout />>
          <Route path="/" element={<SignupPage />} />
          <Route
            path="/Home"
            element={userLoggedIn ? <UserHomePage /> : <Navigate to="/" />}
          >
            {/* <Route path="daily" element={""} />
            <Route path="monthly" element={""} />
            <Route path="yearly" element={""} /> */}
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
