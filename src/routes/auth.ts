import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = Router();

router.get("/auth", (req: Request, res: Response) => {
  if ((req.session as any).user) {
    res.redirect("/dashboard");
    return;
  }
  res.render("auth");
});

router.post("/auth", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.render("auth", { error: "Email sau parolă incorectă" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    (req.session as any).user = user.username;
    res.redirect("/dashboard");
  } else {
    res.render("auth", { error: "Email sau parolă incorectă" });
  }
});

export default router;
