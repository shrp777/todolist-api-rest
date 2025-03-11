import { createFactory } from "hono/factory";

import db from "../../database";

const factory = createFactory();

export default factory.createHandlers((c) => {
  const id = c.req.param("id");
  const statement = db.prepare("DELETE FROM tasks WHERE id = ?");
  const result = statement.run(id!);

  if (result.changes === 0)
    return c.json(
      { result: "fail", code: 404, message: "Task not found" },
      404
    );

  return c.json(
    { result: "success", code: 200, message: "Task deleted successfully" },
    200
  );
});
