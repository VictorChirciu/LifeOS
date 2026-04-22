import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "./middleware/auth.js";
import task from "../models/task.js";

const router = Router();

router.get("/tasks", requireAuth, async (req: Request, res: Response) => {
  const tasks = await task.find({ owner: (req.session as any).user });
  res.render("tasks", {
    username: (req.session as any).user,
    activePage: "tasks",
    tasks,
  });
});

router.post("/tasks", requireAuth, async (req: Request, res: Response) => {
  const { title, description, deadline } = req.body;
  const newTask = new task({
    title,
    description,
    deadline,
    owner: (req.session as any).user,
  });
  await newTask.save();
  res.redirect("/tasks");
});

router.post(
  "/tasks/toggle/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const t = await task.findOne({
      _id: req.params.id,
      owner: (req.session as any).user,
    });
    if (!t) {
      res.status(404).json({ ok: false });
      return;
    }
    await task.findByIdAndUpdate(req.params.id, { completed: !t.completed });
    res.json({ ok: true });
  },
);

router.post(
  "/tasks/edit/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, deadline, description } = req.body;

      await task.findByIdAndUpdate(id, {
        title,
        deadline,
        description,
      });

      res.redirect("/tasks");
    } catch (error) {
      console.error(error);
      res.status(500).send("Eroare la actualizarea task-ului");
    }
  },
);
router.delete(
  "/tasks/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    await task.findOneAndDelete({
      _id: req.params.id,
      owner: (req.session as any).user,
    });
    res.json({ ok: true });
  },
);
export default router;
