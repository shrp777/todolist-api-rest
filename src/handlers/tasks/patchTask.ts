import { createFactory } from "hono/factory";

import Task from "../../models/Task";
import db from "../../database";

const factory = createFactory();

export default factory.createHandlers(async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const existing = db
    .query("SELECT * FROM tasks WHERE id = ?")
    .as(Task)
    .get(id!);

  if (!existing) {
    return c.json(
      { result: "fail", code: 404, message: "Task not found" },
      404
    );
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
      { result: "success", code: 200, message: "Task updated successfully" },
      200
    );
  }
});
