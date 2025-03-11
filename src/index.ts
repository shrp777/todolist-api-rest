import { Hono } from "hono";
import { cors } from "hono/cors";
import tasks from "./routes/tasksRoutes";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

//middlewares
app.use("/*", cors()); //autorise les requêtes de toute provenance externe
app.use(prettyJSON());
app.use(logger());
app.use(secureHeaders());

app.route("/tasks", tasks);

//retourne une erreur 405 (Method not allowed) pour toutes les routes non gérées
app.all("*", async (c) => {
  throw new HTTPException(405, { message: "Method not allowed" });
});

//retourne une réponse au format JSON pour toutes les erreurs 404
app.notFound((c) => {
  return c.json(
    { result: "fail", code: 404, message: "This page does not exist" },
    404
  );
});

//centralise la gestion des erreurs et retourne une réponse au format JSON pour toutes les erreurs
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        result: "fail",
        code: err.status || 500,
        message: err.message || "Internal Error"
      },
      err.status || 500
    );
  } else {
    return c.json(
      { result: "fail", code: 500, message: "Internal Error" },
      500
    );
  }
});

const port = process.env.PORT;
console.log(`Server running at http://localhost:${port}`);
export default app;
