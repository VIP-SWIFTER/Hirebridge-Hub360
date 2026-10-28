// Small, dependency-free validator driven by a field "spec".
// Only fields listed in the spec are ever read from the request body, and every
// value is coerced to the expected type, so unexpected input (objects, arrays,
// Mongo operators like {"$ne": ""}) can never reach the database.

export type Field =
  | { type: "text" | "longtext"; label: string; required?: boolean; min?: number; max?: number }
  | { type: "email" | "phone" | "url"; label: string; required?: boolean }
  | { type: "enum" | "multi"; label: string; options: readonly string[]; required?: boolean }
  | { type: "consent"; label: string; required?: boolean };

export type Spec = Record<string, Field>;
export type Value = string | boolean | string[];
export type Clean = Record<string, Value>;
export type Errors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-\s\d]{7,20}$/;
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(CONTROL_RE, "").trim().slice(0, max);
}

export function validate(spec: Spec, body: Record<string, unknown>): { errors: Errors; clean: Clean } {
  const errors: Errors = {};
  const out: Clean = {};

  for (const [key, f] of Object.entries(spec)) {
    const raw = body[key];

    switch (f.type) {
      case "text":
      case "longtext": {
        const v = clean(raw, f.max ?? (f.type === "longtext" ? 1500 : 120));
        if (!v) {
          if (f.required) errors[key] = `${f.label} is required.`;
        } else if (f.min && v.length < f.min) {
          errors[key] = `${f.label} should be at least ${f.min} characters.`;
        }
        out[key] = v;
        break;
      }
      case "email": {
        const v = clean(raw, 120).toLowerCase();
        if (!v) {
          if (f.required) errors[key] = "Email is required.";
        } else if (!EMAIL_RE.test(v)) {
          errors[key] = "Please enter a valid email.";
        }
        out[key] = v;
        break;
      }
      case "phone": {
        const v = clean(raw, 20);
        const digits = v.replace(/\D/g, "");
        if (!v) {
          if (f.required) errors[key] = "Phone number is required.";
        } else if (!PHONE_RE.test(v) || digits.length < 7 || digits.length > 15) {
          errors[key] = "Please enter a valid phone number.";
        }
        out[key] = v;
        break;
      }
      case "url": {
        const v = clean(raw, 300);
        if (v) {
          try {
            const u = new URL(v);
            if (!["http:", "https:"].includes(u.protocol)) throw new Error("bad protocol");
          } catch {
            errors[key] = "Please enter a full link starting with https://";
          }
        } else if (f.required) {
          errors[key] = `${f.label} is required.`;
        }
        out[key] = v;
        break;
      }
      case "enum": {
        const v = clean(raw, 80);
        if (!v) {
          if (f.required) errors[key] = `Please choose ${f.label.toLowerCase()}.`;
        } else if (!f.options.includes(v)) {
          errors[key] = `Please choose a valid ${f.label.toLowerCase()}.`;
        }
        out[key] = v;
        break;
      }
      case "multi": {
        const arr = Array.isArray(raw)
          ? raw.filter((x): x is string => typeof x === "string" && f.options.includes(x))
          : [];
        const uniq = [...new Set(arr)];
        if (f.required && uniq.length === 0) errors[key] = `Please select at least one ${f.label.toLowerCase()}.`;
        out[key] = uniq;
        break;
      }
      case "consent": {
        const ok = raw === true || raw === "true";
        if (f.required && !ok) errors[key] = "Please tick this box so we can contact you.";
        out[key] = ok;
        break;
      }
    }
  }

  return { errors, clean: out };
}
