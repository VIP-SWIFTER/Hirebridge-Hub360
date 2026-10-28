import { Router } from "express";
import rateLimit from "express-rate-limit";
import { FormDef, FormRecord, getForm, makeRef } from "../forms";
import { validate, Clean } from "../utils/validate";
import { notify } from "../utils/mailer";
import { appendPlacementRow } from "../utils/excel";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: () => Number(process.env.SUBMIT_RATE_LIMIT) || 12, // read lazily so tests can raise it
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many submissions. Please try again in a few minutes." },
});

async function createWithRef(form: FormDef, data: Clean) {
  // The ref is random; retry in the (very unlikely) case of a collision.
  for (let attempt = 0; ; attempt++) {
    try {
      return await form.model.create({ ...data, ref: makeRef(form.prefix) } as unknown as FormRecord);
    } catch (err) {
      const code = (err as { code?: number }).code;
      if (code === 11000 && attempt < 3) continue;
      throw err;
    }
  }
}

// Public: POST /api/forms/:type   (enquiry | marketing | job | register)
router.post("/:type", submitLimiter, async (req, res) => {
  const form = getForm(req.params.type);
  if (!form) return res.status(404).json({ ok: false, error: "Unknown form." });

  const body: Record<string, unknown> =
    req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  if (typeof body.website === "string" && body.website.length > 0) {
    return res.status(201).json({ ok: true, ref: makeRef(form.prefix), message: "Thanks! We received your details." });
  }

  const { errors, clean } = validate(form.spec, body);
  if (form.after) form.after(clean, errors);
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  try {
    const doc = await createWithRef(form, clean);
    // Email alerts are best-effort and must never block or fail the request.
    const plain = (typeof doc.toObject === "function" ? doc.toObject() : doc) as FormRecord;
    notify(form, plain).catch((e: Error) => console.error("Email notification failed:", e.message));
    // Placement registrations are also saved to a separate Excel sheet (best-effort).
    if (req.params.type === "placement") {
      appendPlacementRow(form, plain).catch((e: Error) => console.error("Excel save failed:", e.message));
    }
    res.status(201).json({ ok: true, ref: doc.ref, message: "Thank you! Your details have been saved." });
  } catch (err) {
    console.error(`Saving ${form.label} failed:`, err);
    res.status(500).json({ ok: false, error: "Something went wrong. Please call or WhatsApp us instead." });
  }
});

export default router;
