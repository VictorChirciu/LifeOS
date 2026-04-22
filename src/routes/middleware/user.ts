import type { Request, Response, NextFunction } from "express";
import User from "../../models/user.js";

export async function attachUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const username = (req.session as any)?.user;
  if (!username) {
    next();
    return;
  }

  const user = await User.findOne({ username });
  if (user) {
    res.locals.username = user.username;
    res.locals.email = user.email;
    res.locals.avatar = user.avatar || "";
    res.locals.theme = user.theme || "stone";
    res.locals.darkMode = user.darkMode || false;
  }

  next();
}
