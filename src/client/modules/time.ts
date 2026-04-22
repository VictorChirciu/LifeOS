function time(): void {
  const now = new Date();

  const Time = now.toLocaleTimeString("ro-MD", {
    timeZone: "Europe/Chisinau",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateString = now.toLocaleDateString("ro-MD", {
    timeZone: "Europe/Chisinau",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const clockElement = document.getElementById("clock");
  const dateElement = document.getElementById("date");

  if (clockElement) {
    clockElement.textContent = Time;
  }
  if (dateElement) {
    dateElement.textContent =
      dateString.charAt(0).toUpperCase() + dateString.slice(1);
  }
}

function updateDayProgress(): void {
  const bar = document.getElementById("dayProgress") as HTMLElement | null;
  const text = document.getElementById("dayProgressText") as HTMLElement | null;

  if (!bar || !text) return;

  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
  );
  const totalSeconds = 24 * 60 * 60;
  const elapsed = (now.getTime() - start.getTime()) / 1000;
  const percent = Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));

  bar.style.width = `${percent}%`;
  text.style.fontWeight = "600";
  text.textContent = `${Math.round(percent)}% din zi a trecut`;
}

function startCountdown(eventTime: string): void {
  const el = document.getElementById("countdown");
  const bar = document.getElementById("progress-bar"); 
  if (!el || !bar) return;

  function update() {
    const now = new Date();
    const [h, m] = eventTime.split(":").map(Number);
    const target = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      h,
      m,
    );

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );

    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      el!.textContent = "A început!";
      bar!.style.width = "100%"; 
      return;
    }

    const totalDuration = target.getTime() - startOfDay.getTime();
    const elapsed = now.getTime() - startOfDay.getTime();
    const percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    bar!.style.width = `${percent}%`;

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    el!.textContent =
      hours > 0
        ? `${hours}h ${minutes}m ${seconds}s`
        : `${minutes}m ${seconds}s`;
  }

  update();
  setInterval(update, 1000);
}

export { time, updateDayProgress, startCountdown };
