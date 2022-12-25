import { Router } from "express";
import { getRepository } from "typeorm";
import { Cart, CartStatus } from "../entity/Cart";
import { Item } from "../entity/Item";
import { OrderItem } from "../entity/OrderItem";
import { Restaurant } from "../entity/Restaurant";
import { MAuth } from "../middleware";
import { AuthRequest } from "../types";

const router = Router();

router.post("/", MAuth, async (req: AuthRequest, res) => {
  try {
    const { itemId, restaurantId } = req.body;

    const orderItem = new OrderItem();
    orderItem.item = await Item.findOne({ where: { id: itemId } });
    orderItem.restaurant = await Restaurant.findOne({
      where: { id: restaurantId },
    });

    let cart = await Cart.findOne({
      where: { status: CartStatus.UNORDERED, user: { id: req.qid } },
      relations: ["items", "items.item", "items.restaurant"],
    });
    if (!cart) {
      cart = new Cart();
      cart.user = <any>{ id: req.qid };
      cart.items = [];
    }
    cart.items.push(orderItem);
    cart = await cart.save();

    return res.json(cart);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

router.get("/", MAuth, async (req: AuthRequest, res) => {
  try {
    const cart = await Cart.findOne({
      where: { status: CartStatus.UNORDERED, user: { id: req.qid } },
      relations: ["items", "items.item", "items.restaurant"],
    });
    return res.json(cart);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

router.delete("/item/:id", MAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.query;
    await OrderItem.delete(id as string);
    return res.json(null);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

router.put("/", MAuth, async (req: AuthRequest, res) => {
  try {
    const { orderItemId, op }: { orderItemId: number; op: "incr" | "decr" } =
      req.body;
    if (op === "incr")
      await getRepository(OrderItem).increment(
        { id: orderItemId },
        "quantity",
        1
      );
    else {
      const orderItem = await OrderItem.findOne({ where: { id: orderItemId } });
      if (orderItem.quantity <= 1) await orderItem.remove();
      else {
        orderItem.quantity++;
        await orderItem.save();
      }
    }
    return res.json(null);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

router.delete("/", MAuth, async (req: AuthRequest, res) => {
  try {
    const cart = await Cart.findOne({
      where: { status: CartStatus.UNORDERED, user: { id: req.qid } },
      relations: ["items"],
    });
    await OrderItem.remove(cart.items);
    return res.json(null);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

export default router;
