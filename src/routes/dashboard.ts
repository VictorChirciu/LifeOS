import { Router } from "express";
import axios from "axios";
import type { Request, Response } from "express";
import { requireAuth } from "./middleware/auth.js";
import Event from "../models/event.js";

const router = Router();

const EVENTS_COUNT = 3;
const CACHE_TTL_WEATHER = 1000 * 60 * 10;
const CACHE_TTL_DAY = 1000 * 60 * 60;

const cache = new Map<string, { data: any; time: number }>();

async function getCached<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < ttl) {
    return cached.data;
  }
  const data = await fetcher();
  cache.set(key, { data, time: Date.now() });
  return data;
}

async function translateToRomanian(text: string): Promise<string> {
  try {
    const encoded = encodeURIComponent(text);
    const response = await axios.get(
      `https://lingva.ml/api/v1/en/ro/${encoded}`,
    );
    return response.data.translation;
  } catch {
    return text;
  }
}

async function fetchHistoricalEvents(month: number, day: number) {
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
  const response = await axios.get(url, {
    headers: { "User-Agent": "LifeOS/1.0 (student project)" },
  });

  const events = response.data.events
    .sort(() => Math.random() - 0.5)
    .slice(0, EVENTS_COUNT);

  return Promise.all(
    events.map(async (event: any) => ({
      year: event.year,
      text: await translateToRomanian(event.text),
    })),
  );
}

async function fetchWeather() {
  const response = await axios.get(
    "https://api.open-meteo.com/v1/forecast?latitude=46.9167&longitude=28.9333&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,precipitation,cloudcover,apparent_temperature&timezone=Europe/Chisinau",
  );
  const c = response.data.current;
  return {
    temp: c.temperature_2m,
    feels: c.apparent_temperature,
    wind: c.windspeed_10m,
    humidity: c.relativehumidity_2m,
    precipitation: c.precipitation,
    cloudcover: c.cloudcover,
    code: c.weathercode,
  };
}

async function wordOfTheDay() {
  const apiKey = process.env.WORDNIK_API_KEY;
  if (!apiKey) return null;
  const response = await axios.get(
    `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${apiKey}`,
  );
  return response.data.word;
}

router.get("/dashboard", requireAuth, async (req: Request, res: Response) => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  let events: { year: number; text: string }[] = [];
  let weather = null;
  let word = null;
  const now = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const todayEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
  );

  const todayEvents = await Event.find({
    owner: (req.session as any).user,
    date: { $gte: todayStart, $lte: todayEnd },
  }).sort({ time: 1 });

  const nextEvent = todayEvents.find((ev) => {
    if (!ev.time) return false;
    const [h, m] = ev.time.split(":").map(Number);
    const eventTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      h,
      m,
    );
    return eventTime > now;
  });
  try {
    [events, weather, word] = await Promise.all([
      getCached(`events-${month}-${day}`, CACHE_TTL_DAY, () =>
        fetchHistoricalEvents(month, day),
      ),
      getCached("weather", CACHE_TTL_WEATHER, fetchWeather),
      getCached("word", CACHE_TTL_DAY, wordOfTheDay),
    ]);
  } catch (error) {
    console.error("Eroare la încărcarea datelor:", error);
  }

  res.render("dashboard", {
    username: (req.session as any).user,
    events,
    day,
    month: today.toLocaleString("ro-RO", { month: "long" }),
    activePage: "dashboard",
    word,
    weather,
    nextEvent: nextEvent || null,
  });
});

export default router;
