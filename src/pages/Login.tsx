
import LoginForm from "@/components/auth/LoginForm";
import { useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const redirectUrl = new URLSearchParams(location.search).get("redirectTo") || undefined;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <LoginForm redirectUrl={redirectUrl} />
      </div>
    </div>
  );
};

export default Login;
