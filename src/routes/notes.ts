import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "./middleware/auth.js";
import Note from "../models/note.js";

const router = Router();

router.get("/notes", requireAuth, async (req: Request, res: Response) => {
  const notes = await Note.find({ owner: (req.session as any).user }).sort({
    pinned: -1,
    updatedAt: -1,
  });
  res.render("notes", {
    username: (req.session as any).user,
    activePage: "notes",
    notes,
  });
});

router.post("/notes", requireAuth, async (req: Request, res: Response) => {
  const { title } = req.body;
  const note = await Note.create({
    title,
    content: "",
    owner: (req.session as any).user,
  });
  res.redirect(`/notes/${note._id}`);
});

router.get("/notes/:id", requireAuth, async (req: Request, res: Response) => {
  const note = await Note.findOne({
    _id: req.params.id,
    owner: (req.session as any).user,
  });
  if (!note) {
    res.redirect("/notes");
    return;
  }
  res.render("note", {
    username: (req.session as any).user,
    activePage: "notes",
    note,
  });
});

router.post("/notes/:id", requireAuth, async (req: Request, res: Response) => {
  const { title, content } = req.body;
  await Note.findOneAndUpdate(
    { _id: req.params.id, owner: (req.session as any).user },
    { title, content },
  );
  res.json({ ok: true });
});

router.post(
  "/notes/pin/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const note = await Note.findOne({
      _id: req.params.id,
      owner: (req.session as any).user,
    });
    if (!note) {
      res.status(404).json({ ok: false });
      return;
    }
    await Note.findByIdAndUpdate(req.params.id, { pinned: !note.pinned });
    res.json({ ok: true, pinned: !note.pinned });
  },
);

router.delete(
  "/notes/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    await Note.findOneAndDelete({
      _id: req.params.id,
      owner: (req.session as any).user,
    });
    res.json({ ok: true });
  },
);

export default router;
