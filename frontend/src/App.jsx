import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/signuppage";
import Layout from "./pages/layout";

import UserHomePage from "./pages/UserHomePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element=<Layout />>
          <Route path="/" element={<SignupPage />} />
          <Route path="/Home" element={<UserHomePage />}>
            <Route path="daily" element={""} />
            <Route path="monthly" element={""} />
            <Route path="yearly" element={""} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
