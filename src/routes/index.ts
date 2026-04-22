import { Router } from "express";
import registerRouter from "./register.js";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import notesRouter from "./notes.js";
import calendarRouter from "./calendar.js";
import settingsRouter from "./settings.js";
import tasksRouter from "./tasks.js";

const router = Router();
router.use(registerRouter);
router.use(authRouter);
router.use(dashboardRouter);
router.use(notesRouter);
router.use(calendarRouter);
router.use(settingsRouter);
router.use(tasksRouter);

router.get("/", (req, res) => {
  
  res.render("index");
});

export default router;
