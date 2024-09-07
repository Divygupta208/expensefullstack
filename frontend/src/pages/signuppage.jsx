import { useLocation } from "react-router-dom";
import Signup from "../components/Signup";

const SignupPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "signup";

  return <Signup mode={mode} />;
};

export default SignupPage;
