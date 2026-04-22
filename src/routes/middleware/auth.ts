import type { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any).user) {
    next();
  } else {
    res.redirect("/auth");
  }
}
