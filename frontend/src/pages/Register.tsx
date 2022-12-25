import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CAxios } from "../constants";
import { useCtx } from "../state";
import { isObject } from "../utils";

type TInfo = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const { setUser } = useCtx();
  const navigate = useNavigate();

  const [info, setInfo] = useState<TInfo>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }, []);

  const onRegister = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      CAxios.post("/auth/register", info).then(({ data }) => {
        if (isObject(data)) {
          setUser(data);
          navigate("/home", { replace: true });
        }
      });
    },
    [info, setUser, navigate]
  );

  return (
    <div>
      <h1>Register</h1>
      <form
        style={{ display: "flex", flexDirection: "column", width: "400px" }}
        onSubmit={onRegister}
      >
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={info.name}
          onChange={onChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={info.email}
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={info.password}
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={info.confirmPassword}
          onChange={onChange}
        />
        <button type="submit">register</button>
      </form>
    </div>
  );
}

export default Register;
