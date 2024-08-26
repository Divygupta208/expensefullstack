import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/signuppage";
import Layout from "./pages/layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element=<Layout />>
          <Route path="/" element={<SignupPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
