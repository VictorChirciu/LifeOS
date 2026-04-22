export function initUserMenu(): void {
  const btn = document.getElementById("userMenuBtn");
  const menu = document.getElementById("userMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    menu.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    menu.classList.add("hidden");
  });
}
