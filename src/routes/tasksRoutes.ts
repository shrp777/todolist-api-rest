import { Hono } from "hono";
import getAllTasks from "../handlers/tasks/getAllTasks";
import getOneTask from "../handlers/tasks/getOneTask";
import postTask from "../handlers/tasks/postTask";
import putTask from "../handlers/tasks/putTask";
import patchTask from "../handlers/tasks/patchTask";
import deleteTask from "../handlers/tasks/deleteTask";

const route = new Hono();

route.get("/", ...getAllTasks);

route.get("/:id", ...getOneTask);

route.post("/", ...postTask);

route.put("/:id", ...putTask);

route.patch("/:id", ...patchTask);

route.delete("/:id", ...deleteTask);

export default route;
