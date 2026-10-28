// Defines the four forms once: fields, validation rules and MongoDB models.
import crypto from "crypto";
import mongoose, { Model, SchemaDefinition } from "mongoose";
import * as o from "./utils/options";
import type { Clean, Errors, Field, Spec } from "./utils/validate";

export type FormKey = "enquiry" | "marketing" | "placement" | "register";

/** Shape of a saved document (all four forms share name/email/phone + admin fields). */
export interface FormRecord {
  ref: string;
  status: o.Status;
  note: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

export interface FormDef {
  label: string;
  prefix: string;
  modelName: string;
  spec: Spec;
  after?: (clean: Clean, errors: Errors) => void;
  model: Model<FormRecord>;
}

interface TextOpts {
  required?: boolean;
  min?: number;
  max?: number;
}
const text = (label: string, extra: TextOpts = {}): Field => ({ type: "text", label, ...extra });
const longtext = (label: string, extra: TextOpts = {}): Field => ({ type: "longtext", label, ...extra });
const choice = (label: string, options: readonly string[], required = false): Field => ({
  type: "enum",
  label,
  options,
  required,
});

const EMAIL: Field = { type: "email", label: "Email", required: true };
const CONSENT: Field = { type: "consent", label: "Consent", required: true };

// WhatsApp / phone follow-up needs a number.
const needsPhoneForCall = (clean: Clean, errors: Errors) => {
  if (["WhatsApp", "Phone call"].includes(String(clean.contactVia)) && !clean.phone && !errors.phone) {
    errors.phone = "Please add your phone number for WhatsApp / call follow-up.";
  }
};

type FormDefInput = Omit<FormDef, "model">;

const defs: Record<FormKey, FormDefInput> = {
  // 1) Quick enquiry: talk to a manager by WhatsApp / email / call
  enquiry: {
    label: "Manager Enquiry",
    prefix: "ENQ",
    modelName: "Enquiry",
    spec: {
      name: text("Name", { required: true, min: 2, max: 80 }),
      email: EMAIL,
      phone: { type: "phone", label: "Phone" },
      contactVia: choice("Preferred contact method", o.CONTACT_VIA, true),
      topic: choice("Topic", o.ENQUIRY_TOPICS, true),
      message: longtext("Message", { required: true, min: 10 }),
    },
    after: needsPhoneForCall,
  },

  // 2) Marketing & branding enquiry (project brief)
  marketing: {
    label: "Marketing & Branding Enquiry",
    prefix: "MKT",
    modelName: "MarketingInquiry",
    spec: {
      name: text("Your name", { required: true, min: 2, max: 80 }),
      businessName: text("Business name", { required: true, max: 100 }),
      businessType: text("Business type", { required: true, max: 80 }),
      email: EMAIL,
      phone: { type: "phone", label: "Phone" },
      services: { type: "multi", label: "Service", options: o.MARKETING_SERVICES, required: true },
      budget: choice("Budget", o.BUDGETS, true),
      timeline: choice("Timeline", o.TIMELINES, true),
      existingBrand: choice("Brand status", o.EXISTING_BRAND, true),
      contactVia: choice("Preferred contact method", o.CONTACT_VIA, true),
      message: longtext("Project details"),
    },
    after: needsPhoneForCall,
  },

  // 3) Placement registration (detailed candidate profile; also exported to an Excel sheet)
  placement: {
    label: "Placement Registration",
    prefix: "PLC",
    modelName: "PlacementRegistration",
    spec: {
      name: text("Full name", { required: true, min: 2, max: 80 }),
      email: EMAIL,
      phone: { type: "phone", label: "Phone", required: true },
      gender: choice("Gender", o.GENDERS),
      city: text("City", { required: true, max: 60 }),
      currentStatus: choice("Current status", o.CURRENT_STATUS, true),
      qualification: choice("Qualification", o.QUALIFICATIONS, true),
      college: text("College / institution", { required: true, max: 120 }),
      passingYear: choice("Year of passing", o.PASSING_YEARS, true),
      experience: choice("Experience", o.EXPERIENCE, true),
      skills: longtext("Key skills", { required: true, max: 600 }),
      preferredRole: text("Preferred role", { required: true, max: 100 }),
      jobType: choice("Job type", o.JOB_TYPES, true),
      preferredLocation: text("Preferred job location", { required: true, max: 100 }),
      expectedSalary: choice("Expected salary", o.EXPECTED_SALARY),
      noticePeriod: choice("Available to join", o.NOTICE_PERIODS),
      resumeLink: { type: "url", label: "Resume link" },
      message: longtext("Anything else", { max: 1000 }),
      consent: CONSENT,
    },
  },

  // 4) Free registration
  register: {
    label: "Free Registration",
    prefix: "REG",
    modelName: "Registration",
    spec: {
      name: text("Full name", { required: true, min: 2, max: 80 }),
      email: EMAIL,
      phone: { type: "phone", label: "Phone", required: true },
      city: text("City", { required: true, max: 60 }),
      registerAs: choice("Registration type", o.REGISTER_AS, true),
      interests: { type: "multi", label: "Interest", options: o.INTERESTS },
      howHeard: choice("Source", o.HEARD_FROM),
      consent: CONSENT,
    },
  },
};

// ---- Build a Mongoose model from each spec ----
function buildModel(modelName: string, spec: Spec): Model<FormRecord> {
  const def: SchemaDefinition = {};
  for (const [key, f] of Object.entries(spec)) {
    if (f.type === "multi") def[key] = { type: [String], default: [] };
    else if (f.type === "consent") def[key] = { type: Boolean, default: false };
    else def[key] = { type: String, trim: true, default: "" };
  }
  def.ref = { type: String, required: true, unique: true, index: true };
  def.status = { type: String, enum: o.STATUSES, default: "new", index: true };
  def.note = { type: String, default: "", maxlength: 1000 };

  const existing = mongoose.models[modelName] as Model<FormRecord> | undefined;
  return existing ?? mongoose.model<FormRecord>(modelName, new mongoose.Schema(def, { timestamps: true }));
}

export const FORMS = {} as Record<FormKey, FormDef>;
for (const key of Object.keys(defs) as FormKey[]) {
  FORMS[key] = { ...defs[key], model: buildModel(defs[key].modelName, defs[key].spec) };
}

// Reference IDs look like HB-ENQ-7K3QX2 (no confusing 0/O/1/I characters).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export function makeRef(prefix: string): string {
  let s = "";
  for (const b of crypto.randomBytes(6)) s += ALPHABET[b % ALPHABET.length];
  return `HB-${prefix}-${s}`;
}

export function getForm(type: string): FormDef | null {
  return Object.prototype.hasOwnProperty.call(FORMS, type) ? FORMS[type as FormKey] : null;
}
