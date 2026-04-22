import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password, birthdate } = req.body;

  const birth = new Date(birthdate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();

  if (age < 5 || age > 100) {
    res.render("register", { error: "Vârstă invalidă." });
    return;
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    res.render("register", { error: "Numele de utilizator există deja." });
    return;
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    res.render("register", { error: "Email-ul există deja." });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashedPassword, birthdate });

  (req.session as any).user = username;
  res.redirect("/dashboard");
});

export default router;
