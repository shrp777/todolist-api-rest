import { createFactory } from "hono/factory";

const factory = createFactory();

export default factory.createHandlers(async (c) =>
  c.json({ result: "success", code: 200, message: "Parking REST API" }, 200)
);
