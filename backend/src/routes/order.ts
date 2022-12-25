import { Router } from "express";
import { Cart, CartStatus } from "../entity/Cart";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { RestaurantStatus } from "../entity/Restaurant";
import { MAuth } from "../middleware";
import { AuthRequest } from "../types";

const router = Router();

router.post("/", MAuth, async (req: AuthRequest, res) => {
  try {
    const { cartId }: { cartId: string } = req.body;
    const cart = await Cart.findOne(cartId, {
      relations: ["items", "items.item", "items.restaurant"],
    });
    if (
      !cart.items.every((oi) => oi.restaurant.status === RestaurantStatus.OPEN)
    ) {
      await OrderItem.remove(cart.items);
      return res.json({ closed: true });
    } else {
      cart.status = CartStatus.ORDERED;
      cart.orders = [];
      for (const [restaurantId, oitems] of Object.entries(
        cart.items.reduce<{ [k: string]: OrderItem[] }>(
          (p, c) => ({
            ...p,
            [c.restaurant.id]: p[c.restaurant.id]
              ? [...p[c.restaurant.id], c]
              : [c],
          }),
          {}
        )
      )) {
        const order = new Order();
        order.items = oitems;
        order.restaurant = <any>{ id: restaurantId };
        order.user = <any>{ id: req.qid };
        cart.orders.push(order);
      }
      await cart.save();
      return res.json(null);
    }
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

router.put("/status", MAuth, async (req: AuthRequest, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findOne(orderId, {
      relations: ["user", "items", "items.item"],
    });
    order.status = status;
    await order.save();

    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

router.get("/", MAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await Cart.find({
      where: { status: CartStatus.ORDERED, user: { id: req.qid } },
      relations: [
        "orders",
        "orders.items",
        "orders.restaurant",
        "orders.items.item",
      ],
    });
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

router.get("/restaurant/:id", MAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({
      where: { restaurant: { id: req.query.id } },
      relations: ["items", "user", "items.item"],
    });
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

export default router;
