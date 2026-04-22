function initTasks(): void {
  initModal();
}

function initModal(): void {
  const modal = document.getElementById("taskModal");
  if (!modal) return;

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeAddTask();
  });

  document.querySelectorAll<HTMLButtonElement>(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.completed === "true") return;
      editTask(
        btn.dataset.taskId!,
        btn.dataset.taskTitle!,
        btn.dataset.taskDeadline!,
        btn.dataset.taskDesc!,
      );
    });
  });
}

function openAddTask(): void {
  document.getElementById("taskModal")?.classList.remove("hidden");
}

function closeAddTask(): void {
  document.getElementById("taskModal")?.classList.add("hidden");
}

async function deleteTask(id: string, title: string): Promise<void> {
  const modal = document.getElementById("deleteModal");
  const titleDisplay = document.getElementById("deleteTaskTitle");

  if (!modal || !titleDisplay) return;

  titleDisplay.innerText = `Ești sigur că vrei să ștergi task-ul "${title}"?`;
  modal.classList.remove("hidden");

  const confirmBtn = document.getElementById("confirmDelete");
  const cancelBtn = document.getElementById("cancelDelete");

  const onConfirm = async () => {
    await fetch(`/tasks/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  const onCancel = () => {
    modal.classList.add("hidden");
    confirmBtn?.removeEventListener("click", onConfirm);
  };

  confirmBtn?.addEventListener("click", onConfirm, { once: true });
  cancelBtn?.addEventListener("click", onCancel, { once: true });
}

function editTask(
  id: string,
  title: string,
  deadline: string,
  description: string,
) {
  const modal = document.getElementById("taskModal") as HTMLElement;
  const form = document.getElementById("taskForm") as HTMLFormElement;
  const modalTitle = document.getElementById("modalTitle") as HTMLElement;

  const titleInput = document.getElementById(
    "modalTitleInput",
  ) as HTMLInputElement;
  const deadlineInput = document.getElementById(
    "modalDeadlineInput",
  ) as HTMLInputElement;
  const descInput = document.getElementById(
    "modalDescInput",
  ) as HTMLTextAreaElement;

  if (modal && form && modalTitle && titleInput && deadlineInput && descInput) {
    modalTitle.innerText = "Editează Task";
    form.action = `/tasks/edit/${id}`;

    titleInput.value = title;
    descInput.value = description;

    if (deadline) {
      const formattedDate =
        new Date(deadline).toISOString().split("T")[0] || "";
      deadlineInput.value = formattedDate;
    }

    modal.classList.remove("hidden");
  }
}

async function toggleComplete(id: string): Promise<void> {
  await fetch(`/tasks/toggle/${id}`, { method: "POST" });
  window.location.reload();
}
export {
  initTasks,
  openAddTask,
  closeAddTask,
  deleteTask,
  editTask,
  toggleComplete,
};
