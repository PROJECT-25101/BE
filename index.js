import cors from "cors";
import express from "express";
import morgan from "morgan";
import { NODE_ENV, PORT } from "./src/common/configs/environment.js";
import errorHandler from "./src/common/middlewares/error.middleware.js";
import jsonValidator from "./src/common/middlewares/json-valid.middleware.js";
import notFoundHandler from "./src/common/middlewares/not-found.middleware.js";
import routes from "./src/routes.js";
import { checkVersion } from "./src/common/configs/node-version.js";
import connectDB from "./src/common/configs/database.js";
import { normalizeQueryParams } from "./src/common/middlewares/normalQuery.middleware.js";
import http from "http";
import { initSocket } from "./src/socket/index.js";

checkVersion();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(normalizeQueryParams);
app.get("/", (_, res) => res.json("hello world"));
app.use("/api", routes);
app.use(jsonValidator);
app.use(notFoundHandler);
app.use(errorHandler);

let server;

connectDB()
  .then(() => {
    console.log("✓ Connected to MongoDB");
    server = http.createServer(app);
    initSocket(server);
    server.listen(PORT, () => {
      console.log("API Server Started");
      if (NODE_ENV === "development") {
        console.log(`• API: http://localhost:${PORT}/api`);
      }
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
    process.exit(1);
  });

process.on("unhandledRejection", (error) => {
  console.error("💥 Unhandled Rejection:", error);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
