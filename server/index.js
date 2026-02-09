import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import modelRoutes from "./routes/model-routes.js";

// Always load the env file that lives next to this server entrypoint.
// This makes `node server/index.js` (from repo root) and `node index.js` (from /server) behave the same.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(express.json({ limit: "10mb" }));

// Minimal CORS (so the Vite dev server can call this API)
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.CORS_ORIGIN || "*"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/models", modelRoutes);

connectDB();

const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
  console.log(`server is listening to requests on port ${PORT}...`);
});
