import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { v1 } from "./v1";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Analog Photo Logger API",
          version: "1.0.0",
          description:
            "API for managing film rolls, cameras, and photo metadata",
        },
        tags: [
          { name: "Auth", description: "User authentication" },
          { name: "Cameras", description: "Hardware management" },
          { name: "Rolls", description: "Film roll sessions" },
          { name: "Frames", description: "Individual photo logs" },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    }),
  )
  .group("/api", (app) => app.use(v1))
  .listen(3000);

console.log(`1000 пъти: http://localhost:3000/swagger`);
