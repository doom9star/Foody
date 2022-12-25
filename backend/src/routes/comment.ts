import { Router } from "express";
import { Comment } from "../entity/Comment";
import { MAuth } from "../middleware";
import { AuthRequest } from "../types";

const router = Router();

router.post("/", MAuth, async (req: AuthRequest, res) => {
  try {
    let comment = new Comment();
    comment.body = req.body.body;
    comment.commentator = <any>{ id: req.qid };
    comment.restaurant = <any>{ id: req.body.restaurantId };
    comment = await comment.save();
    return res.json(comment);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

export default router;
