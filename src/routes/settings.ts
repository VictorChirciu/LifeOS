import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "./middleware/auth.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = Router();

router.post(
  "/user/settings",
  requireAuth,
  async (req: Request, res: Response) => {
    const username = (req.session as any).user;
    const {
      username: newUsername,
      password,
      avatar,
      theme,
      darkMode,
    } = req.body;
    const updates: any = {};
    if (newUsername && newUsername !== username) updates.username = newUsername;
    if (avatar && avatar.startsWith("data:image")) updates.avatar = avatar;
    if (password && password.trim() !== "") {
      updates.password = await bcrypt.hash(password, 10);
    }
    if (theme) updates.theme = theme;
    if (darkMode !== undefined) updates.darkMode = darkMode;

    await User.findOneAndUpdate({ username }, { $set: updates });

    if (updates.username) {
      (req.session as any).user = updates.username;
    }

    res.json({ ok: true });
  },
);

router.get("/logout", requireAuth, (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Eroare la distrugerea sesiunii:", err);
      return res.status(500).send("Nu s-a putut efectua logout-ul.");
    }
    res.clearCookie("connect.sid");
    res.redirect("/logout-client");
  });
});

router.get("/logout-client", (req: Request, res: Response) => {
  res.render("logout");
});

export default router;
