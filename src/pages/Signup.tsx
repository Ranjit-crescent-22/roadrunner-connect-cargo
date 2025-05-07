
import SignupForm from "@/components/auth/SignupForm";
import { useLocation } from "react-router-dom";

const Signup = () => {
  const location = useLocation();
  const redirectUrl = new URLSearchParams(location.search).get("redirectTo") || undefined;
  const role = new URLSearchParams(location.search).get("role") as "driver" | "customer" | undefined;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <SignupForm redirectUrl={redirectUrl} preselectedRole={role} />
      </div>
    </div>
  );
};

export default Signup;
