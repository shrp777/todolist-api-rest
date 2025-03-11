import { createFactory } from "hono/factory";

import Task from "../../models/Task";
import db from "../../database";

const factory = createFactory();

export default factory.createHandlers((c) => {
  const tasks = db.query("SELECT * FROM tasks").as(Task).all();
  return c.json(
    { result: "success", code: 200, message: "Tasks found", tasks: tasks },
    200
  );
});
