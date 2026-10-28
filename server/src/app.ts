import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import formsRoutes from "./routes/forms";
import adminRoutes from "./routes/admin";

export const app = express();

// Behind a proxy (Render, Railway, Nginx...) set TRUST_PROXY=1 so rate limits use the real client IP.
if (process.env.TRUST_PROXY) app.set("trust proxy", Number(process.env.TRUST_PROXY) || 1);

app.use(helmet());
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",") }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.use("/api/forms", formsRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => res.status(404).json({ ok: false, error: "Not found" }));

// Malformed JSON and other unexpected errors -> clean JSON instead of a stack trace.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: { type?: string }, _req: Request, res: Response, _next: NextFunction) => {
  if (err?.type === "entity.parse.failed") return res.status(400).json({ ok: false, error: "Invalid JSON." });
  if (err?.type === "entity.too.large") return res.status(413).json({ ok: false, error: "Request too large." });
  console.error(err);
  res.status(500).json({ ok: false, error: "Server error." });
});
