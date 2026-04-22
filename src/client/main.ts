import { validateForm } from "./modules/validation.js";
import { time, updateDayProgress, startCountdown } from "./modules/time.js";
import { initUserMenu } from "./modules/dropdown.js";
import { initPasswordToggle } from "./modules/password.js";
import { initNotes } from "./modules/notes.js";
import { initSettings } from "./modules/settings.js";
import { initEditor, saveNote } from "./modules/editor.js";
import {
  initTheme,
  applyTheme,
  initBgToggle,
  initDarkMode,
  ColorPicker,
} from "./modules/theme.js";
import {
  initTasks,
  openAddTask,
  closeAddTask,
  deleteTask,
  editTask,
  toggleComplete,
} from "./modules/tasks.js";
import {
  initCalendar,
  openAddModal,
  closeAddModal,
  closeViewModal,
  showEvent,
} from "./modules/calendar.js";

function registerGlobals(): void {
  (window as any).applyTheme = applyTheme;
  (window as any).openAddTask = openAddTask;
  (window as any).closeAddTask = closeAddTask;
  (window as any).deleteTask = deleteTask;
  (window as any).editTask = editTask;
  (window as any).toggleComplete = toggleComplete;
  (window as any).openAddModal = openAddModal;
  (window as any).closeAddModal = closeAddModal;
  (window as any).closeViewModal = closeViewModal;
  (window as any).showEvent = showEvent;
  (window as any).initEditor = initEditor;
  (window as any).saveNote = saveNote;
}

function initClock(): void {
  time();
  setInterval(time, 1000);
  updateDayProgress();
  setInterval(updateDayProgress, 60000);
}

function initCountdown(): void {
  const nextEventTime = (window as any).__nextEventTime;
  if (nextEventTime) startCountdown(nextEventTime);
}

function init(): void {
  initTheme();
  initDarkMode();
  initBgToggle();
  ColorPicker();

  initUserMenu();
  initPasswordToggle();
  initSettings();

  initNotes();
  initTasks();
  initCalendar();

  initClock();
  initCountdown();

  validateForm("/auth");
  validateForm("/register");

  registerGlobals();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
