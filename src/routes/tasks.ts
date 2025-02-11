import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import Task from "../models/Task";
import db from "../database";

const route = new Hono();

route.get("/", (c) => {
  const tasks = db.query("SELECT * FROM tasks").as(Task).all();
  return c.json(tasks);
});

route.get("/:id", (c) => {
  const id = c.req.param("id");
  const task = db.query("SELECT * FROM tasks WHERE id = ?").as(Task).get(id);
  if (!task) return c.json({ error: "Task not found" }, 404);
  return c.json(task);
});

route.post("/", async (c) => {
  const body = await c.req.json();
  const id = uuidv4();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO tasks (id, content, status, createdAt, completedAt, deadline)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, body.content, "todo", now, null, body.deadline || null);

  return c.json({
    id,
    content: body.content,
    status: "todo",
    createdAt: now,
    deadline: body.deadline || null
  });
});

route.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const existing = db
    .query("SELECT * FROM tasks WHERE id = ?")
    .as(Task)
    .get(id);

  if (!existing) return c.json({ error: "Task not found" }, 404);

  const stmt = db.prepare(`
    UPDATE tasks SET content = ?, status = ?, completedAt = ?, deadline = ? WHERE id = ?
  `);

  stmt.run(
    body.content || existing.content,
    body.status || existing.status,
    body.completedAt || existing.completedAt,
    body.deadline || existing.deadline,
    id
  );

  return c.json({ message: "Task updated successfully" });
});

route.delete("/:id", (c) => {
  const id = c.req.param("id");
  const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
  const result = stmt.run(id);

  if (result.changes === 0) return c.json({ error: "Task not found" }, 404);

  return c.json({ message: "Task deleted successfully" });
});

export default route;
