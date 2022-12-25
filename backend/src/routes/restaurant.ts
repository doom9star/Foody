import e, { Router } from "express";
import { Category } from "../entity/Category";
import { Item } from "../entity/Item";
import { Restaurant, RestaurantStatus } from "../entity/Restaurant";
import { MAuth } from "../middleware";
import { AuthRequest, MenuType, TCategories } from "../types";

const router = Router();

router.post("/", MAuth, async (req: AuthRequest, res) => {
  try {
    const categories: TCategories = req.body.categories;

    let restaurant = new Restaurant();
    restaurant.name = req.body.name;
    restaurant.address = req.body.address;
    restaurant.menuType = req.body.menuType;
    restaurant.owner = <any>{ id: <number>req.qid };
    restaurant.contact = req.body.contact;
    restaurant.ratings = [0, 0, 0, 0, 0];
    restaurant.categories = [];

    for (const [c, itms] of Object.entries(categories)) {
      const category = new Category();
      category.name = c;
      category.items = itms.map((i) => {
        const item = new Item();
        item.name = i.name;
        item.price = i.price;
        return item;
      });
      restaurant.categories.push(category);
    }
    restaurant = await restaurant.save();
    return res.json(restaurant);
  } catch (error) {
    console.error(error);
    return res.send("Something has happened!");
  }
});

router.get("/many/:type/:query?", MAuth, async (req: AuthRequest, res) => {
  const type = req.query.type as "my" | "all" | "search";
  try {
    let restaurants: Restaurant[] = [];
    if (type === "all") {
      restaurants = await Restaurant.createQueryBuilder("r").getMany();
    } else if (type === "my") {
      restaurants = await Restaurant.createQueryBuilder("r")
        .where("r.owner = :uid", { uid: req.qid })
        .getMany();
    } else {
      const query = req.query.query;
      restaurants = await Restaurant.createQueryBuilder("r")
        .where("r.name like :query", { query: `%${query}%` })
        .getMany();
    }
    return res.json(restaurants);
  } catch (error) {
    console.error(error);
    return res.send("Something has happened!");
  }
});

router.get("/one/:id", MAuth, async (req: AuthRequest, res) => {
  try {
    const restaurant = await Restaurant.findOne(<string>req.query.id, {
      relations: [
        "owner",
        "comments",
        "comments.commentator",
        "categories",
        "categories.items",
      ],
    });
    return res.json(restaurant);
  } catch (error) {
    console.error(error);
    return res.send("Something has happened!");
  }
});

router.put("/", MAuth, async (req: AuthRequest, res) => {
  const {
    name,
    address,
    contact,
    status,
    menuModified,
    menuType,
    categories,
  }: {
    name: string;
    address: string;
    contact: string[];
    status: RestaurantStatus;
    menuModified: boolean;
    menuType: MenuType;
    categories: Category[];
  } = req.body;
  console.log(req.body);
  const id = <number>req.body.id;
  try {
    if (!menuModified)
      await Restaurant.update(id, { name, address, contact, status });
    else {
      const restaurant = await Restaurant.findOne(id, {
        relations: ["categories", "categories.items"],
      });
      restaurant.name = name;
      restaurant.address = address;
      restaurant.contact = contact;
      restaurant.status = status;
      if (menuType !== restaurant.menuType) restaurant.categories = [];
      restaurant.menuType = menuType;
      for (const category of categories) {
        if (category.id) {
          const cidx = restaurant.categories.findIndex(
            (c) => c.id === category.id
          );
          restaurant.categories[cidx].items = [];
          for (const item of category.items) {
            if (item.id) {
              restaurant.categories[cidx].items.push(item);
            } else {
              const newItem = new Item();
              newItem.name = item.name;
              newItem.price = item.price;
              restaurant.categories[cidx].items.push(newItem);
            }
          }
        } else {
          const newCategory = new Category();
          newCategory.name = category.name;
          newCategory.items = [];
          for (const item of category.items) {
            const newItem = new Item();
            newItem.name = item.name;
            newItem.price = item.price;
            newCategory.items.push(newItem);
          }
          restaurant.categories.push(newCategory);
        }
      }
      await restaurant.save();
    }
    return res.json(null);
  } catch (error) {
    console.error(error);
    return res.send("Something has happened!");
  }
});

router.delete("/", MAuth, async (req: AuthRequest, res) => {
  try {
    const id = <number>req.body.id;
    await Restaurant.delete(id);
    return res.json(null);
  } catch (error) {
    console.error(error);
    return res.send("Something has happened!");
  }
});

export default router;
