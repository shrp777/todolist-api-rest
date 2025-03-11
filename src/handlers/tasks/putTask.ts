import { createFactory } from "hono/factory";

import Task from "../../models/Task";
import db from "../../database";

const port = process.env["PORT"];
const host = process.env["HOST"];

const factory = createFactory();

export default factory.createHandlers(async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const existing = db
    .query("SELECT * FROM tasks WHERE id = ?")
    .as(Task)
    .get(id!);

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
        code: 201,
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
      .get(id!);

    return c.json(
      {
        result: "success",
        code: 200,
        message: "Task updated successfully",
        task: updatedTask
      },
      200
    );
  }
});
