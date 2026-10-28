import crypto from "crypto";
import { NextFunction, Request, Response, Router } from "express";
import mongoose, { FilterQuery } from "mongoose";
import rateLimit from "express-rate-limit";
import { FORMS, FormKey, FormRecord, getForm } from "../forms";
import { STATUSES, Status } from "../utils/options";
import { wrap } from "../utils/asyncHandler";
import { buildWorkbook } from "../utils/excel";

const router = Router();

// Slow down key guessing: only FAILED requests count towards the limit.
const failLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many failed attempts. Try again later." },
});

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const key = process.env.ADMIN_KEY || "";
  const got = req.get("x-admin-key") || "";
  if (!key || !safeEqual(got, key)) return res.status(401).json({ ok: false, error: "Unauthorized" });
  next();
}

router.use(failLimiter, adminAuth);

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isStatus = (s: unknown): s is Status => typeof s === "string" && (STATUSES as readonly string[]).includes(s);

// GET /api/admin/summary -> counts per form
router.get(
  "/summary",
  wrap(async (_req, res) => {
    const summary: Record<string, { label: string; total: number; new: number }> = {};
    for (const key of Object.keys(FORMS) as FormKey[]) {
      const form = FORMS[key];
      const [total, fresh] = await Promise.all([
        form.model.countDocuments(),
        form.model.countDocuments({ status: "new" }),
      ]);
      summary[key] = { label: form.label, total, new: fresh };
    }
    res.json({ ok: true, summary });
  })
);

// GET /api/admin/:type/export -> CSV download (declared before /:type so it matches first)
function csvCell(v: unknown): string {
  let s = Array.isArray(v) ? v.join("; ") : v instanceof Date ? v.toISOString() : v == null ? "" : String(v);
  // Stop spreadsheet formula injection (=, +, -, @ at the start of a cell).
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

// GET /api/admin/:type/export.xlsx -> Excel sheet of every submission of that form
router.get(
  "/:type/export.xlsx",
  wrap(async (req, res) => {
    const form = getForm(req.params.type);
    if (!form) return res.status(404).json({ ok: false, error: "Unknown form." });
    const items = (await form.model.find().sort({ createdAt: -1 }).lean()) as unknown as FormRecord[];
    const wb = await buildWorkbook(form, items);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="hirebridge-${req.params.type}.xlsx"`);
    await wb.xlsx.write(res);
    res.end();
  })
);

router.get(
  "/:type/export",
  wrap(async (req, res) => {
    const form = getForm(req.params.type);
    if (!form) return res.status(404).json({ ok: false, error: "Unknown form." });

    const cols = ["ref", "createdAt", "status", ...Object.keys(form.spec), "note"];
    const items = await form.model.find().sort({ createdAt: -1 }).lean();
    const lines = [cols.map(csvCell).join(",")];
    for (const it of items) lines.push(cols.map((c) => csvCell((it as Record<string, unknown>)[c])).join(","));

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="hirebridge-${req.params.type}.csv"`);
    res.send("﻿" + lines.join("\r\n")); // BOM so Excel reads UTF-8 (₹, Tamil) correctly
  })
);

// GET /api/admin/:type?status=new&q=text
router.get(
  "/:type",
  wrap(async (req, res) => {
    const form = getForm(req.params.type);
    if (!form) return res.status(404).json({ ok: false, error: "Unknown form." });

    const filter: FilterQuery<FormRecord> = {};
    if (isStatus(req.query.status)) filter.status = req.query.status;
    if (typeof req.query.q === "string" && req.query.q.trim()) {
      const rx = new RegExp(escapeRegex(req.query.q.trim().slice(0, 60)), "i");
      filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { ref: rx }];
    }

    const items = await form.model.find(filter).sort({ createdAt: -1 }).limit(300).lean();
    res.json({ ok: true, items });
  })
);

// PATCH /api/admin/:type/:id  { status?, note? }
router.patch(
  "/:type/:id",
  wrap(async (req, res) => {
    const form = getForm(req.params.type);
    if (!form) return res.status(404).json({ ok: false, error: "Unknown form." });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ ok: false, error: "Bad id." });

    const set: { status?: Status; note?: string } = {};
    if (req.body && req.body.status !== undefined) {
      if (!isStatus(req.body.status)) return res.status(400).json({ ok: false, error: "Bad status." });
      set.status = req.body.status;
    }
    if (req.body && typeof req.body.note === "string") set.note = req.body.note.trim().slice(0, 1000);
    if (!Object.keys(set).length) return res.status(400).json({ ok: false, error: "Nothing to update." });

    const doc = await form.model.findByIdAndUpdate(req.params.id, { $set: set }, { new: true }).lean();
    if (!doc) return res.status(404).json({ ok: false, error: "Not found." });
    res.json({ ok: true, item: doc });
  })
);

export default router;
