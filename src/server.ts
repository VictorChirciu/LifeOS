import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { connectDatabase } from "./config/database.js";
import { fileURLToPath } from "url";
import { attachUser } from "./routes/middleware/user.js";
import routes from "./routes/index.js";
import session from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        scriptSrcAttr: ["'unsafe-inline'"],
        scriptSrcElem: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        styleSrcElem: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "cdn.jsdelivr.net"],
      },
    },
  }),
);
await connectDatabase();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoUrl = process.env.MONGO_URI ?? "";
const store = MongoStore.create({ mongoUrl });

app.use(
  session({
    secret: process.env.SESSION_SECRET || "lifeos-secret",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use(attachUser);

const connectLivereload = (await import("connect-livereload")).default;

if (process.env.NODE_ENV !== "production") {
  app.use(connectLivereload({ port: 35729 }));
  console.log("🔄 LiveReload middleware enabled");
}

app.use(routes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});
