import { Router } from "express";
import { Restaurant } from "../entity/Restaurant";
import { MAuth } from "../middleware";
import { AuthRequest } from "../types";

const router = Router();

router.post("/rating", MAuth, async (req: AuthRequest, res) => {
  try {
    const rating = <number>req.body.rating;
    const restaurant = await Restaurant.findOne({
      where: { id: req.body.restaurantId },
    });
    restaurant.ratings[rating - 1]++;
    await restaurant.save();
    return res.json(null);
  } catch (error) {
    console.error(error);
    return res.send("Something has happened!");
  }
});

export default router;
