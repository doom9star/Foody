import React from "react";
import { useNavigate } from "react-router-dom";

function Back() {
  const navigate = useNavigate();
  return (
    <button style={{ margin: "0rem 1rem" }} onClick={() => navigate(-1)}>
      Back
    </button>
  );
}

export default Back;
