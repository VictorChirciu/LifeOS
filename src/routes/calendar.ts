import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "./middleware/auth.js";
import Event from "../models/event.js";

const router = Router();

router.get("/calendar", requireAuth, async (req: Request, res: Response) => {
  const owner = (req.session as any).user;
  const now = new Date();
  const year = parseInt(req.query.year as string) || now.getFullYear();
  const month = parseInt(req.query.month as string) || now.getMonth() + 1;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const events = await Event.find({ owner, date: { $gte: start, $lte: end } });

  res.render("calendar", {
    username: owner,
    activePage: "calendar",
    events,
    year,
    month,
  });
});

router.post("/calendar", requireAuth, async (req: Request, res: Response) => {
  const { title, description, date, culoarea, time } = req.body;

  if (!date) {
    res.redirect("/calendar");
    return;
  }

  await Event.create({
    title,
    description,
    date: new Date(date),
    culoarea: culoarea || "#1D4ED8",
    time: time || "",
    owner: (req.session as any).user,
  });

  res.redirect("/calendar");
});

router.post(
  "/calendar/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { title, description, date, time, color } = req.body;
    await Event.findOneAndUpdate(
      { _id: req.params.id, owner: (req.session as any).user },
      { title, description, date: new Date(date), time, culoarea: color },
    );
    res.json({ ok: true });
  },
);

router.delete(
  "/calendar/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    await Event.findOneAndDelete({
      _id: req.params.id,
      owner: (req.session as any).user,
    });
    res.json({ ok: true });
  },
);

export default router;
