import { createFactory } from "hono/factory";

import { v4 as uuidv4 } from "uuid";
import db from "../../database";

const port = process.env["PORT"];
const host = process.env["HOST"];

const factory = createFactory();

export default factory.createHandlers(async (c) => {
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
});
