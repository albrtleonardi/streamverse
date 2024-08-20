import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const GuestMiddleware = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [user, fetchUser] = useUser();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return <>{!user && children}</>;
};

export default GuestMiddleware;
