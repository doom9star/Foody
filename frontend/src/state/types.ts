import { ICart, IUser } from "../types";

export type TState = {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  cart: ICart | null;
  setCart: React.Dispatch<React.SetStateAction<ICart | null>>;
};
