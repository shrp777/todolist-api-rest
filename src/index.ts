import { Hono } from "hono";
import { Database } from "bun:sqlite";
import { v4 as uuidv4 } from "uuid";
import { cors } from "hono/cors";
import tasks from "./routes/tasks";

const app = new Hono();

app.use("*", cors());

app.route("/tasks", tasks);

const port = 3000;
console.log(`🚀 Server running at http://localhost:${port}`);
export default app;
