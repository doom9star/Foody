import { Router } from "express";
import { _24HR_ } from "../constant";
import { User } from "../entity/User";
import { MAuth, MNAuth } from "../middleware";
import { AuthRequest } from "../types";

const router = Router();

router.get("/", MAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findOne(req.qid);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

router.post("/login", MNAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      [req.body.nameOrEmail.includes("@") ? "email" : "name"]:
        req.body.nameOrEmail,
    });
    if (!user) return res.json("Wrong Credentials");
    if (user.password !== req.body.password) return res.json("Wrong Password");

    res.cookie("qid", user.id, {
      maxAge: _24HR_ * 7,
    });

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

router.post("/register", MNAuth, async (req, res) => {
  try {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user = await user.save();

    res.cookie("qid", user.id, {
      maxAge: _24HR_ * 7,
    });

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
});

router.delete("/logout", MAuth, (_, res) => {
  res.clearCookie("qid");
  return res.send("Logged out!");
});

export default router;
