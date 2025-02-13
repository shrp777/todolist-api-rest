import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import Task from "../models/Task";
import db from "../database";

const route = new Hono();

const port = process.env["PORT"];
const host = process.env["HOST"];

route.get("/", (c) => {
  const tasks = db.query("SELECT * FROM tasks").as(Task).all();
  return c.json({ result: "success", tasks: tasks }, 200);
});

route.get("/:id", (c) => {
  const id = c.req.param("id");
  const task = db.query("SELECT * FROM tasks WHERE id = ?").as(Task).get(id);
  if (!task) return c.json({ error: "Task not found" }, 404);
  return c.json({ result: "success", task: task }, 200);
});

route.post("/", async (c) => {
  const body = await c.req.json();
  const id = uuidv4();
  const now = new Date().toISOString();

  const statement = db.prepare(`
    INSERT INTO tasks (id, content, status, createdAt, completedAt, deadline)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  statement.run(id, body.content, "todo", now, null, body.deadline || null);

  c.header("Location", `${host}:${port}/tasks/${id}`);

  return c.json(
    {
      result: "success",
      task: {
        id,
        content: body.content,
        status: "todo",
        createdAt: now,
        deadline: body.deadline || null
      }
    },
    201
  );
});

route.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const existing = db
    .query("SELECT * FROM tasks WHERE id = ?")
    .as(Task)
    .get(id);

  if (!existing) {
    const body = await c.req.json();
    const now = new Date().toISOString();

    const createStatement = db.prepare(`
    INSERT INTO tasks (id, content, status, createdAt, completedAt, deadline)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    createStatement.run(
      id,
      body.content,
      "todo",
      now,
      null,
      body.deadline || null
    );

    c.header("Location", `${host}:${port}/tasks/${id}`);

    return c.json(
      {
        result: "success",
        message: "Task created successfully",
        task: {
          id,
          content: body.content,
          status: "todo",
          createdAt: now,
          deadline: body.deadline || null
        }
      },
      201
    );
  } else {
    const updateStatement = db.prepare(`
    UPDATE tasks SET content = ?, status = ?, completedAt = ?, deadline = ? WHERE id = ?
  `);

    let completedAt = null;
    const now = new Date().toISOString();

    if (body.status === "done") {
      completedAt = existing.completedAt || now;
    } else {
      completedAt = null;
    }

    updateStatement.run(
      body.content || existing.content,
      body.status || existing.status,
      completedAt,
      body.deadline || existing.deadline,
      id
    );

    const updatedTask = db
      .query("SELECT * FROM tasks WHERE id = ?")
      .as(Task)
      .get(id);

    return c.json(
      {
        result: "success",
        message: "Task updated successfully",
        task: updatedTask
      },
      200
    );
  }
});

route.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const existing = db
    .query("SELECT * FROM tasks WHERE id = ?")
    .as(Task)
    .get(id);

  if (!existing) {
    return c.json({ result: "error", message: "Task not found" }, 404);
  } else {
    const updateStatement = db.prepare(`
    UPDATE tasks SET content = ?, status = ?, completedAt = ?, deadline = ? WHERE id = ?
  `);

    let completedAt = body.completedAt ?? null;

    if (body.status) {
      if (body.status === "done") {
        completedAt = new Date().toISOString();
      } else {
        completedAt = null;
      }
    }

    updateStatement.run(
      body.content || existing.content,
      body.status || existing.status,
      completedAt || existing.completedAt,
      body.deadline || existing.deadline,
      id
    );

    return c.json(
      { result: "success", message: "Task updated successfully" },
      200
    );
  }
});

route.delete("/:id", (c) => {
  const id = c.req.param("id");
  const statement = db.prepare("DELETE FROM tasks WHERE id = ?");
  const result = statement.run(id);

  if (result.changes === 0)
    return c.json({ result: "error", message: "Task not found" }, 404);

  return c.json(
    { result: "success", message: "Task deleted successfully" },
    200
  );
});

export default route;
