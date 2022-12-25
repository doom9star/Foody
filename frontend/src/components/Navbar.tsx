import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CAxios } from "../constants";
import { useCtx } from "../state";
import Back from "./Back";

type Props = {
  addBack?: boolean;
};

function NavBar({ addBack }: Props) {
  const { user, cart, setUser, setCart } = useCtx();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    CAxios.delete("/auth/logout").then(() => {
      setUser(null);
      navigate("/", { replace: true });
    });
  }, [navigate, setUser]);

  useEffect(() => {
    if (!cart) {
      CAxios.get("/cart").then(({ data }) => {
        setCart(data || {});
      });
    }
  }, [cart, setCart]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>Welcome Home, {user?.name}</h1>
        <h5
          style={{ position: "relative" }}
          onClick={() => navigate("/home/cart")}
        >
          Cart{" "}
          <div
            style={{
              position: "absolute",
              top: "-100%",
              right: "0",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "0.2rem",
            }}
          >
            {cart && cart.items ? cart.items.length : 0}
          </div>
        </h5>
      </div>
      <div
        style={{
          display: "flex",
          width: "95vw",
          justifyContent: "flex-end",
          padding: "1rem",
        }}
      >
        <button
          style={{ marginRight: "1rem" }}
          onClick={() => navigate("/home/new-restaurant")}
        >
          New Restaurant
        </button>
        <button
          style={{ marginRight: "1rem" }}
          onClick={() => navigate("/home/my_orders")}
        >
          My Orders
        </button>
        <button onClick={logout}>logout</button>
        {addBack && <Back />}
      </div>
    </div>
  );
}

export default NavBar;
