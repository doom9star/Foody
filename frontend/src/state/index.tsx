import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useState,
} from "react";
import { ICart, IUser } from "../types";
import { TState } from "./types";

const Ctx = createContext<TState>({} as TState);

type Props = {
  children: ReactNode;
};

export const useCtx = () => useContext(Ctx);
export const CtxWrapper: FunctionComponent<Props> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [cart, setCart] = useState<ICart | null>(null);
  return (
    <Ctx.Provider value={{ user, setUser, cart, setCart }}>
      {children}
    </Ctx.Provider>
  );
};
