import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user-routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/v1/user", userRoutes);

connectDB();

const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
  console.log(`server is listening to requests on port ${PORT}...`);
});
