import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDb } from "./db.js";
import { router } from "./routes.js";

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/api", router);

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(error.errors)[0]?.message || "Invalid data." });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  res.status(500).json({ message: "Something went wrong on the server." });
});

connectDb()
  .then(() => {
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
