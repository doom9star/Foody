import { Request } from "express";
import { Item } from "./entity/Item";

export type AuthRequest = Request & { qid?: string | number };
export type TCategories = {
  [k: string]: Pick<Item, "name" | "price">[];
};

export enum MenuType {
  SINGLE = "SINGLE",
  GROUP = "GROUP",
}
