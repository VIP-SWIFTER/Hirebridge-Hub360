import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
console.log("ADMIN_KEY loaded:", Boolean(process.env.ADMIN_KEY));
import mongoose from "mongoose";
import { app } from "./app";

const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hirebridge_hub360";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err: Error) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

