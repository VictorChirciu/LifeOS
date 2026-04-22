function initNotes(): void {
  initPinButtons();
  initDeleteModal();
  registerGlobalNoteActions();
}

function initPinButtons(): void {
  document.querySelectorAll<HTMLButtonElement>(".pin-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.noteId!;
      const res = await fetch(`/notes/pin/${id}`, { method: "POST" });
      const data = await res.json();

      btn.dataset.pinned = String(data.pinned);
      btn.classList.toggle("bg-gray-400", data.pinned);
      btn.classList.toggle("bg-gray-200", !data.pinned);
      btn.title = data.pinned ? "Dezafișează" : "Fixează";
      btn.innerHTML = data.pinned
        ? `<img src="/images/pin.png" alt="Pinned" class="h-4 w-4 opacity-90" />`
        : `<img src="/images/unpin.png" alt="Unpinned" class="h-4 w-4 opacity-50" />`;
    });
  });
}

function initDeleteModal(): void {
  const modal = document.getElementById("deleteModal");
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}

function registerGlobalNoteActions(): void {
  (window as any).deleteNote = deleteNote;
}

async function deleteNote(id: string): Promise<void> {
  const modal = document.getElementById("deleteModal");
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  if (!modal || !confirmBtn) return;

  modal.classList.remove("hidden");

  confirmBtn.onclick = async () => {
    try {
      const res = await fetch(`/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        location.reload();
      } else {
        alert("Eroare la ștergere");
      }
    } catch {
      alert("Eroare la ștergere");
    }
  };
}

export { initNotes };