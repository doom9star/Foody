import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCtx } from "../state";

type Props = {
  children: ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
  const { user } = useCtx();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  return <>{user ? children : null}</>;
};

export const PublicRoute = ({ children }: Props) => {
  const { user } = useCtx();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [navigate, user]);

  return <>{!user ? children : null}</>;
};
