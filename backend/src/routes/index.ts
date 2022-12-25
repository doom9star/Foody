import { Router } from "express";
import AuthRouter from "./auth";
import RestaurantRouter from "./restaurant";
import CommentRouter from "./comment";
import OrderRouter from "./order";
import CartRouter from "./cart";
import MiscRouter from "./misc";

const router = Router();

router.get("/", (_, res) => res.send("Working"));

router.use("/auth", AuthRouter);
router.use("/restaurant", RestaurantRouter);
router.use("/comment", CommentRouter);
router.use("/order", OrderRouter);
router.use("/cart", CartRouter);
router.use("/misc", MiscRouter);

export default router;
