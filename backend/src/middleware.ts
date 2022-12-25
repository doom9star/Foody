import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "./types";

export const MAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const qid = req.cookies.qid;
  if (!qid) return res.send("Not Authenticated!");
  req.qid = qid;
  next();
};

export const MNAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const qid = req.cookies.qid;
  if (qid) return res.send("Authenticated!");
  next();
};
