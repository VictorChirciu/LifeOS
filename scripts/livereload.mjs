import livereload from "livereload";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const lrServer = livereload.createServer({
  exts: ["ejs", "css", "js"],
  delay: 500,
  port: 35729,
  protocol: 7,
});

lrServer.watch([
  path.join(__dirname, "../src/views"),
  path.join(__dirname, "../src/public"),
]);

console.log("🔄 LiveReload watching on port 35729");
