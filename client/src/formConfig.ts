// Everything the four forms need on the client: option lists, field layout, validation.
// This file has NO React/MUI imports on purpose, so the server tests can load it and check
// that the option lists below match server/src/utils/options.ts.

export type FormKey = "enquiry" | "marketing" | "placement" | "register";
export type Value = string | boolean | string[];
export type Values = Record<string, Value>;
export type Errors = Record<string, string>;

export const SERVICE_TITLES = [
  "Custom Logo Design",
  "Eye-Catching Designs",
  "Professional Brand Identity",
  "Promotional Designs",
  "Merchandise Research",
  "Door Stickers & Visiting Cards",
  "Trademark-Ready Design Concepts",
] as const;

export const ENQUIRY_TOPICS = [
  ...SERVICE_TITLES,
  "Marketing & Branding",
  "Job Placement",
  "Pricing / Quote",
  "Other",
] as const;

export const CONTACT_VIA = ["WhatsApp", "Email", "Phone call"] as const;

export const MARKETING_SERVICES = [
  "Logo & Brand Identity",
  "Promotional Designs",
  "Social Media Creatives",
  "Visiting Cards & Door Stickers",
  "Merchandise Ideas",
  "Trademark-Ready Concepts",
  "Complete End-to-End Package",
] as const;

export const BUDGETS = ["Under ₹5,000", "₹5,000 – ₹15,000", "₹15,000 – ₹50,000", "₹50,000+", "Not sure yet"] as const;
export const TIMELINES = ["As soon as possible", "Within 2 weeks", "Within a month", "Flexible"] as const;
export const EXISTING_BRAND = ["No, starting fresh", "Yes, I have a logo / brand", "I need a revamp"] as const;

export const QUALIFICATIONS = ["10th / 12th", "Diploma", "Bachelor's degree", "Master's degree", "Other"] as const;
export const EXPERIENCE = ["Fresher", "Less than 1 year", "1–3 years", "3–5 years", "5+ years"] as const;
export const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Freelance / Contract"] as const;

export const REGISTER_AS = [
  "Business owner / Client",
  "Job seeker",
  "Freelancer / Designer",
  "Student / Fresher",
] as const;
export const INTERESTS = ["Branding & Design", "Marketing", "Job Placement", "Merchandise", "Not sure yet"] as const;
export const HEARD_FROM = [
  "Instagram / Facebook",
  "WhatsApp",
  "Friend / Referral",
  "Google search",
  "Flyer / Poster",
  "Other",
] as const;

// ---- Placement registration ----
export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"] as const;
export const CURRENT_STATUS = ["Student", "Fresher (not working)", "Working professional", "Between jobs"] as const;
export const PASSING_YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019 or earlier"] as const;
export const EXPECTED_SALARY = [
  "Under ₹15,000 / month",
  "₹15,000 – ₹25,000 / month",
  "₹25,000 – ₹40,000 / month",
  "₹40,000+ / month",
  "Negotiable",
] as const;
export const NOTICE_PERIODS = ["Immediately", "Within 15 days", "Within 30 days", "60+ days"] as const;

export const STATUSES = ["new", "contacted", "in-progress", "closed"] as const;
export type Status = (typeof STATUSES)[number];

// ---------------------------------------------------------------- field layout
interface Base {
  name: string;
  label: string;
  required?: boolean;
}
export type FieldDef =
  | (Base & {
      kind: "text";
      inputType?: "text" | "email" | "tel" | "url";
      autoComplete?: string;
      min?: number;
      max?: number;
      half?: boolean;
      placeholder?: string;
    })
  | (Base & { kind: "textarea"; min?: number; max: number; rows?: number; placeholder?: string })
  | (Base & { kind: "select"; options: readonly string[]; half?: boolean })
  | (Base & { kind: "radio"; options: readonly string[] })
  | (Base & { kind: "chips"; options: readonly string[]; hint?: string })
  | (Base & { kind: "consent" });

export interface FormConfig {
  key: FormKey;
  tab: string;
  title: string;
  intro: string;
  submitLabel: string;
  /** Human name used in messages, e.g. "Job Placement Application". */
  noun: string;
  fields: FieldDef[];
}

const NAME = (label = "Your name"): FieldDef => ({
  kind: "text", name: "name", label, required: true, min: 2, max: 80, half: true, autoComplete: "name",
});
const EMAIL: FieldDef = {
  kind: "text", name: "email", label: "Email", required: true, inputType: "email", half: true, autoComplete: "email",
};
const PHONE = (required = false): FieldDef => ({
  kind: "text", name: "phone", label: "Phone / WhatsApp",
  required, inputType: "tel", half: true, autoComplete: "tel", max: 20,
});
const CONTACT_VIA_FIELD: FieldDef = {
  kind: "radio", name: "contactVia", label: "How should we reach you?", options: CONTACT_VIA, required: true,
};
const CONSENT_FIELD: FieldDef = {
  kind: "consent", name: "consent", required: true,
  label: "I agree that Hirebridge Hub360° may contact me about this request.",
};

export const FORM_CONFIGS: Record<FormKey, FormConfig> = {
  enquiry: {
    key: "enquiry",
    tab: "Talk to Manager",
    title: "Enquire with our manager",
    intro: "Ask anything about our services. Choose how you want us to reply: WhatsApp, email or a phone call.",
    submitLabel: "Send enquiry",
    noun: "Manager Enquiry",
    fields: [
      NAME(), EMAIL, PHONE(),
      { kind: "select", name: "topic", label: "What is this about?", options: ENQUIRY_TOPICS, required: true, half: true },
      CONTACT_VIA_FIELD,
      { kind: "textarea", name: "message", label: "Your message", required: true, min: 10, max: 1500, rows: 4 },
    ],
  },
  marketing: {
    key: "marketing",
    tab: "Marketing & Branding",
    title: "Marketing & branding enquiry",
    intro: "Tell us about your business and what you need. We will come back with ideas and next steps.",
    submitLabel: "Send project brief",
    noun: "Marketing & Branding Enquiry",
    fields: [
      NAME(), { kind: "text", name: "businessName", label: "Business name", required: true, max: 100, half: true },
      { kind: "text", name: "businessType", label: "Business type (e.g. salon, retail)", required: true, max: 80, half: true },
      EMAIL, PHONE(),
      { kind: "chips", name: "services", label: "What do you need?", options: MARKETING_SERVICES, required: true, hint: "Pick one or more" },
      { kind: "select", name: "budget", label: "Budget", options: BUDGETS, required: true, half: true },
      { kind: "select", name: "timeline", label: "Timeline", options: TIMELINES, required: true, half: true },
      { kind: "select", name: "existingBrand", label: "Do you have a brand already?", options: EXISTING_BRAND, required: true },
      CONTACT_VIA_FIELD,
      { kind: "textarea", name: "message", label: "Anything else we should know? (optional)", max: 1500, rows: 3 },
    ],
  },
  placement: {
    key: "placement",
    tab: "Placement Registration",
    title: "Placement registration",
    intro: "Register for placement assistance. Your details are saved securely and our team will match you with suitable openings.",
    submitLabel: "Register for placement",
    noun: "Placement Registration",
    fields: [
      NAME("Full name"), EMAIL, PHONE(true),
      { kind: "select", name: "gender", label: "Gender (optional)", options: GENDERS, half: true },
      { kind: "text", name: "city", label: "City", required: true, max: 60, half: true },
      { kind: "select", name: "currentStatus", label: "Current status", options: CURRENT_STATUS, required: true, half: true },
      { kind: "select", name: "qualification", label: "Highest qualification", options: QUALIFICATIONS, required: true, half: true },
      { kind: "text", name: "college", label: "College / institution", required: true, max: 120, half: true },
      { kind: "select", name: "passingYear", label: "Year of passing", options: PASSING_YEARS, required: true, half: true },
      { kind: "select", name: "experience", label: "Experience", options: EXPERIENCE, required: true, half: true },
      { kind: "text", name: "preferredRole", label: "Preferred role (e.g. React developer)", required: true, max: 100, half: true },
      { kind: "select", name: "jobType", label: "Job type", options: JOB_TYPES, required: true, half: true },
      { kind: "text", name: "preferredLocation", label: "Preferred job location", required: true, max: 100, half: true },
      { kind: "select", name: "expectedSalary", label: "Expected salary (optional)", options: EXPECTED_SALARY, half: true },
      { kind: "select", name: "noticePeriod", label: "Available to join (optional)", options: NOTICE_PERIODS, half: true },
      { kind: "text", name: "resumeLink", label: "Resume link (Google Drive / LinkedIn, optional)", inputType: "url", half: true, max: 300 },
      { kind: "textarea", name: "skills", label: "Key skills", required: true, max: 600, rows: 2 },
      { kind: "textarea", name: "message", label: "Anything else we should know? (optional)", max: 1000, rows: 3 },
      CONSENT_FIELD,
    ],
  },
  register: {
    key: "register",
    tab: "Free Registration",
    title: "Free registration",
    intro: "Register for free so we can reach you with branding services and opportunities.",
    submitLabel: "Register for free",
    noun: "Free Registration",
    fields: [
      NAME("Full name"), EMAIL, PHONE(true),
      { kind: "text", name: "city", label: "City", required: true, max: 60, half: true },
      { kind: "select", name: "registerAs", label: "I am a", options: REGISTER_AS, required: true, half: true },
      { kind: "select", name: "howHeard", label: "How did you hear about us? (optional)", options: HEARD_FROM, half: true },
      { kind: "chips", name: "interests", label: "What are you interested in? (optional)", options: INTERESTS },
      CONSENT_FIELD,
    ],
  },
};

export const FORM_KEYS = Object.keys(FORM_CONFIGS) as FormKey[];

export function initialValues(key: FormKey, preset: Partial<Values> = {}): Values {
  const v: Values = {};
  for (const f of FORM_CONFIGS[key].fields) {
    if (f.kind === "chips") v[f.name] = [];
    else if (f.kind === "consent") v[f.name] = false;
    else if (f.kind === "radio") v[f.name] = f.options[0];
    else v[f.name] = "";
  }
  for (const [k, val] of Object.entries(preset)) if (val !== undefined) v[k] = val;
  return v;
}

// ---------------------------------------------------------------- validation (mirrors the server)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-\s\d]{7,20}$/;

export function validateForm(key: FormKey, values: Values): Errors {
  const errors: Errors = {};
  for (const f of FORM_CONFIGS[key].fields) {
    const raw = values[f.name];
    const str = typeof raw === "string" ? raw.trim() : "";

    switch (f.kind) {
      case "text":
      case "textarea": {
        const isPhone = f.kind === "text" && f.inputType === "tel";
        if (!str) {
          if (f.required) errors[f.name] = `${f.label.replace(/ \(.*\)$/, "")} is required.`;
        } else if (f.kind === "text" && f.inputType === "email" && !EMAIL_RE.test(str)) {
          errors[f.name] = "Please enter a valid email.";
        } else if (isPhone && (!PHONE_RE.test(str) || str.replace(/\D/g, "").length < 7)) {
          errors[f.name] = "Please enter a valid phone number.";
        } else if (f.kind === "text" && f.inputType === "url" && !/^https?:\/\/\S+\.\S+/i.test(str)) {
          errors[f.name] = "Please enter a full link starting with https://";
        } else if (f.min && str.length < f.min) {
          errors[f.name] = `Please enter at least ${f.min} characters.`;
        }
        break;
      }
      case "select":
      case "radio":
        if (!str && f.required) errors[f.name] = "Please choose an option.";
        break;
      case "chips":
        if (f.required && !(Array.isArray(raw) && raw.length)) errors[f.name] = "Please select at least one.";
        break;
      case "consent":
        if (f.required && raw !== true) errors[f.name] = "Please tick this box so we can contact you.";
        break;
    }
  }

  const via = values.contactVia;
  if ((via === "WhatsApp" || via === "Phone call") && !String(values.phone ?? "").trim() && !errors.phone) {
    errors.phone = "Please add your phone number for WhatsApp / call follow-up.";
  }
  return errors;
}

/** One-line-per-field summary used in the WhatsApp / email follow-up messages. */
export function summarize(key: FormKey, values: Values): string {
  const lines: string[] = [];
  for (const f of FORM_CONFIGS[key].fields) {
    if (f.kind === "consent") continue;
    const v = values[f.name];
    const text = Array.isArray(v) ? v.join(", ") : typeof v === "string" ? v.trim() : "";
    if (text) lines.push(`${f.label.replace(/ \(.*\)$/, "")}: ${text}`);
  }
  return lines.join("\n");
}
