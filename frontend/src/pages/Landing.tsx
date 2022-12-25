import React from "react";
import { Link } from "react-router-dom";
import { useCtx } from "../state";

function Landing() {
  const { user } = useCtx();
  return (
    <div>
      <h1>Landing</h1>
      <div
        style={{
          display: "flex",
          width: "100vw",
          justifyContent: "space-around",
        }}
      >
        {user ? (
          <Link to={"/home"}>Home</Link>
        ) : (
          <>
            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Landing;
