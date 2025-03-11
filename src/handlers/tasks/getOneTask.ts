import { createFactory } from "hono/factory";

import Task from "../../models/Task";
import db from "../../database";

const factory = createFactory();

export default factory.createHandlers((c) => {
  const id = c.req.param("id");
  const task = db.query("SELECT * FROM tasks WHERE id = ?").as(Task).get(id!);
  if (!task)
    return c.json(
      { result: "fail", code: 404, message: "Task not found" },
      404
    );
  return c.json(
    { result: "success", code: 200, message: "Task found", task: task },
    200
  );
});
