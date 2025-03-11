import { Hono } from "hono";
import getHomeHandler from "../handlers/home/getHomeHandler";

const routes = new Hono();

routes.get("/", ...getHomeHandler);

export default routes;
