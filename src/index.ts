import { Hono } from "hono";
import { cors } from "hono/cors";
import tasks from "./routes/tasks";

const app = new Hono();

app.use("*", cors());

app.route("/tasks", tasks);

const port = process.env.PORT;
console.log(`🚀 Server running at http://localhost:${port}`);
export default app;
