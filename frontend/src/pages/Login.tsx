import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CAxios } from "../constants";
import { useCtx } from "../state";
import { isObject } from "../utils";

type TInfo = {
  nameOrEmail: string;
  password: string;
};

function Login() {
  const { setUser } = useCtx();
  const navigate = useNavigate();

  const [info, setInfo] = useState<TInfo>({
    nameOrEmail: "",
    password: "",
  });

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }, []);

  const onLogin = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      CAxios.post("/auth/login", info).then(({ data }) => {
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
      <h1>Login</h1>
      <form
        style={{ display: "flex", flexDirection: "column", width: "400px" }}
        onSubmit={onLogin}
      >
        <input
          type="text"
          placeholder="Name/Email"
          name="nameOrEmail"
          value={info.nameOrEmail}
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={info.password}
          onChange={onChange}
        />
        <button type="submit">login</button>
      </form>
    </div>
  );
}

export default Login;
