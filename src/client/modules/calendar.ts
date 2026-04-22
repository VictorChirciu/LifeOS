function initCalendar(): void {
  applyEventColors();
  initModals();
}

function applyEventColors(): void {
  document.querySelectorAll<HTMLElement>("[data-color]").forEach((el) => {
    const color = el.dataset.color ?? "#1D4ED8";
    el.style.backgroundColor = color + "20";
    el.style.color = color;
    el.style.borderLeft = `3px solid ${color}`;
  });
}

function initModals(): void {
  const addModal = document.getElementById("addModal");
  const viewModal = document.getElementById("viewModal");

  addModal?.addEventListener("click", (e) => {
    if (e.target === addModal) closeAddModal();
  });

  viewModal?.addEventListener("click", (e) => {
    if (e.target === viewModal) closeViewModal();
  });
}

function openAddModal(date: string): void {
  const modal = document.getElementById("addModal")!;
  const dateInput =
    modal.querySelector<HTMLInputElement>('input[name="date"]')!;

  if (date) {
    dateInput.value = date;
    dateInput.readOnly = true;
    dateInput.classList.add("bg-stone-50", "text-gray-400");
  } else {
    dateInput.value = "";
    dateInput.readOnly = false;
    dateInput.classList.remove("bg-stone-50", "text-gray-400");
  }

  modal.classList.remove("hidden");
}

function closeAddModal(): void {
  const modal = document.getElementById("addModal")!;
  const dateInput =
    modal.querySelector<HTMLInputElement>('input[name="date"]')!;
  dateInput.disabled = false;
  modal.classList.add("hidden");
}

function closeViewModal(): void {
  document.getElementById("viewModal")?.classList.add("hidden");
}

function showEvent(
  id: string,
  title: string,
  desc: string,
  date: string,
  time: string,
  color: string,
): void {
  const modal = document.getElementById("viewModal")!;
  const saveBtn = document.getElementById("saveViewBtn") as HTMLButtonElement;
  const deleteBtn = document.getElementById("deleteBtn") as HTMLButtonElement;

  const fields = {
    title: document.getElementById("viewTitle") as HTMLElement,
    date: document.getElementById("viewDate") as HTMLInputElement,
    time: document.getElementById("viewTime") as HTMLInputElement,
    color: document.getElementById("viewColor") as HTMLInputElement,
    desc: document.getElementById("viewDesc") as HTMLElement,
  };

  fields.title.textContent = title;
  fields.date.value = date;
  fields.time.value = time || "";
  fields.color.value = color || "#1D4ED8";
  fields.desc.textContent = desc || "Fără descriere";

  saveBtn.classList.add("hidden");

  const showSave = () => saveBtn.classList.remove("hidden");
  fields.title.oninput = showSave;
  fields.desc.oninput = showSave;
  fields.date.onchange = showSave;
  fields.time.onchange = showSave;
  fields.color.onchange = showSave;

  saveBtn.onclick = async () => {
    await fetch(`/calendar/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fields.title.textContent,
        description: fields.desc.textContent,
        date: fields.date.value,
        time: fields.time.value,
        color: fields.color.value,
      }),
    });
    window.location.reload();
  };

  deleteBtn.onclick = async () => {
    await fetch(`/calendar/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  modal.classList.remove("hidden");
}

export { initCalendar, openAddModal, closeAddModal, closeViewModal, showEvent };
