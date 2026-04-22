declare const Quill: any;

let quill: any = null;

function initEditor(content: string): void {
  quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: { container: "#toolbar" },
    },
    placeholder: "Începe să scrii...",
  });

  if (content && content.trim()) {
    try {
      let parsed = JSON.parse(content);
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      quill.setContents(parsed);
    } catch {
      quill.setText(content);
    }
  }
}

async function saveNote(noteId: string): Promise<void> {
  let title = (document.getElementById("note-title") as HTMLElement)?.innerText.trim();
  if (!title) title = "Notiță fără titlu";

  const content = JSON.stringify(quill.getContents());

  await fetch(`/notes/${noteId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  window.location.href = "/notes";
}

export { initEditor, saveNote };