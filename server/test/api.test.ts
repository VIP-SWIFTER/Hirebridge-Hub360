// API tests. MongoDB is replaced by in-memory stubs, so no database is needed.
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";

process.env.ADMIN_KEY = "test-key-123";
process.env.SUBMIT_RATE_LIMIT = "1000";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
const xlsxFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "hb-")), "placement.xlsx");
process.env.PLACEMENT_XLSX_PATH = xlsxFile;

import { app } from "../src/app";
import { FORMS, FormKey } from "../src/forms";

type Row = Record<string, unknown>;
const store: Record<FormKey, Row[]> = { enquiry: [], marketing: [], placement: [], register: [] };
let nextId = 1;
const oid = () => (nextId++).toString(16).padStart(24, "0");

// Replace the Mongoose model methods the routes use.
for (const key of Object.keys(FORMS) as FormKey[]) {
  const m = FORMS[key].model as unknown as Record<string, unknown>;
  m.create = async (d: Row) => {
    const row = { ...d, _id: oid(), status: "new", note: "", createdAt: new Date() };
    store[key].push(row);
    return { ...row, toObject: () => row };
  };
  m.countDocuments = async (f: Row = {}) => store[key].filter((r) => !f.status || r.status === f.status).length;
  m.find = () => {
    const chain = { sort: () => chain, limit: () => chain, lean: async () => [...store[key]] };
    return chain;
  };
  m.findByIdAndUpdate = (id: string, upd: { $set: Row }) => ({
    lean: async () => {
      const row = store[key].find((r) => r._id === id);
      if (!row) return null;
      Object.assign(row, upd.$set);
      return row;
    },
  });
}

let server: Server;
let base = "";
before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
after(() => server.close());

const post = async (type: string, body: unknown) => {
  const res = await fetch(`${base}/api/forms/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return { status: res.status, json: (await res.json()) as Record<string, any> };
};
const admin = (path: string, init: RequestInit = {}, key = "test-key-123") =>
  fetch(`${base}/api/admin${path}`, { ...init, headers: { "x-admin-key": key, "Content-Type": "application/json", ...(init.headers || {}) } });

const goodEnquiry = {
  name: "Vipin",
  email: "Vipin@Example.com",
  phone: "7845620360",
  contactVia: "WhatsApp",
  topic: "Custom Logo Design",
  message: "I need a logo for my shop please.",
};

test("enquiry: valid submission is saved with a reference id", async () => {
  const r = await post("enquiry", goodEnquiry);
  assert.equal(r.status, 201);
  assert.match(r.json.ref, /^HB-ENQ-[2-9A-HJKMNP-Z]{6}$/);
  assert.equal(store.enquiry.length, 1);
  assert.equal(store.enquiry[0].email, "vipin@example.com"); // lower-cased
});

test("enquiry: invalid data returns field errors and saves nothing", async () => {
  const before = store.enquiry.length;
  const r = await post("enquiry", { name: "A", email: "x", contactVia: "Pigeon", topic: "", message: "hi" });
  assert.equal(r.status, 400);
  for (const k of ["name", "email", "contactVia", "topic", "message"]) assert.ok(r.json.errors[k], `missing error for ${k}`);
  assert.equal(store.enquiry.length, before);
});

test("enquiry: WhatsApp / call follow-up requires a phone number", async () => {
  const r = await post("enquiry", { ...goodEnquiry, phone: "" });
  assert.equal(r.status, 400);
  assert.ok(r.json.errors.phone);
  const ok = await post("enquiry", { ...goodEnquiry, phone: "", contactVia: "Email" });
  assert.equal(ok.status, 201);
});

test("honeypot: bots get a fake success and nothing is stored", async () => {
  const before = store.enquiry.length;
  const r = await post("enquiry", { ...goodEnquiry, website: "http://spam.example" });
  assert.equal(r.status, 201);
  assert.equal(store.enquiry.length, before);
});

test("security: Mongo operators / non-strings are rejected as empty", async () => {
  const r = await post("enquiry", { ...goodEnquiry, name: { $ne: "" }, email: ["a@b.com"] });
  assert.equal(r.status, 400);
  assert.ok(r.json.errors.name);
  assert.ok(r.json.errors.email);
});

test("marketing: multi-select services are validated and unknown values dropped", async () => {
  const body = {
    name: "Ravi",
    businessName: "Ravi Traders",
    businessType: "Retail",
    email: "ravi@example.com",
    phone: "9876543210",
    services: ["Logo & Brand Identity", "Hack the planet", "Logo & Brand Identity"],
    budget: "₹5,000 – ₹15,000",
    timeline: "Within a month",
    existingBrand: "No, starting fresh",
    contactVia: "Email",
    message: "",
  };
  const r = await post("marketing", body);
  assert.equal(r.status, 201);
  assert.deepEqual(store.marketing[0].services, ["Logo & Brand Identity"]);
  const bad = await post("marketing", { ...body, services: ["nope"] });
  assert.equal(bad.status, 400);
  assert.ok(bad.json.errors.services);
});

test("placement: saved to the database and appended to a separate Excel sheet", async () => {
  const ExcelJS = (await import("exceljs")).default;
  const body = {
    name: "Meena",
    email: "meena@example.com",
    phone: "9000000003",
    gender: "Female",
    city: "Coimbatore",
    currentStatus: "Fresher (not working)",
    qualification: "Bachelor's degree",
    college: "PSG College",
    passingYear: "2025",
    experience: "Fresher",
    skills: "React, Node, MongoDB",
    preferredRole: "Full-stack developer",
    jobType: "Full-time",
    preferredLocation: "Chennai",
    consent: true,
  };
  assert.equal((await post("placement", { ...body, consent: false })).status, 400);
  assert.equal((await post("placement", { ...body, college: "" })).status, 400);
  const a = await post("placement", body);
  const b = await post("placement", { ...body, name: "=HYPERLINK(\"x\")" });
  assert.equal(a.status, 201);
  assert.equal(b.status, 201);
  assert.match(a.json.ref, /^HB-PLC-[2-9A-HJKMNP-Z]{6}$/);
  assert.equal(store.placement.length, 2);

  // Excel append is fire-and-forget; wait for both rows to land.
  for (let i = 0; i < 50; i++) {
    if (fs.existsSync(xlsxFile)) {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(xlsxFile).catch(() => undefined);
      if ((wb.getWorksheet("Placement Registrations")?.rowCount ?? 0) >= 3) break;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxFile);
  const ws = wb.getWorksheet("Placement Registrations")!;
  assert.equal(ws.rowCount, 3); // header + 2 registrations
  assert.equal(ws.getRow(1).getCell(1).value, "Reference");
  assert.equal(ws.getRow(2).getCell(1).value, a.json.ref);

  // Admin can download a fresh workbook built from the database.
  const dl = await admin("/placement/export.xlsx");
  assert.equal(dl.status, 200);
  assert.match(String(dl.headers.get("content-type")), /spreadsheetml/);
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.load(Buffer.from(await dl.arrayBuffer()) as unknown as ArrayBuffer);
  assert.equal(wb2.worksheets[0].rowCount, 3);
  assert.equal((await admin("/placement/export.xlsx", {}, "wrong")).status, 401);

  // Every form can be downloaded as Excel; the removed "job" form is gone.
  const en = await admin("/enquiry/export.xlsx");
  assert.equal(en.status, 200);
  const wb3 = new ExcelJS.Workbook();
  await wb3.xlsx.load(Buffer.from(await en.arrayBuffer()) as unknown as ArrayBuffer);
  assert.ok(wb3.worksheets[0].rowCount >= 2);
  assert.equal((await admin("/job/export.xlsx")).status, 404);
  assert.equal((await post("job", {})).status, 404);
});

test("register: free registration is saved", async () => {
  const r = await post("register", {
    name: "Arun",
    email: "arun@example.com",
    phone: "+91 90000 00002",
    city: "Tiruppur",
    registerAs: "Job seeker",
    interests: ["Job Placement"],
    howHeard: "WhatsApp",
    consent: true,
  });
  assert.equal(r.status, 201);
  assert.match(r.json.ref, /^HB-REG-/);
  assert.equal(store.register.length, 1);
});

test("unknown form and malformed JSON are handled cleanly", async () => {
  assert.equal((await post("hack", goodEnquiry)).status, 404);
  const r = await post("enquiry", "{not json");
  assert.equal(r.status, 400);
  assert.equal(r.json.error, "Invalid JSON.");
});

test("admin: requires the key", async () => {
  assert.equal((await admin("/summary", {}, "wrong")).status, 401);
  assert.equal((await admin("/summary", {}, "")).status, 401);
  const ok = await admin("/summary");
  assert.equal(ok.status, 200);
  const j = (await ok.json()) as { summary: Record<string, { total: number; new: number }> };
  assert.equal(j.summary.enquiry.total, 2);
  assert.equal(j.summary.marketing.total, 1);
});

test("admin: list, update status/note, reject bad values", async () => {
  const list = (await (await admin("/enquiry")).json()) as { items: Row[] };
  assert.equal(list.items.length, 2);
  const id = String(list.items[0]._id);

  const upd = await admin(`/enquiry/${id}`, { method: "PATCH", body: JSON.stringify({ status: "contacted", note: "Called back" }) });
  assert.equal(upd.status, 200);
  assert.equal(store.enquiry[0].status, "contacted");
  assert.equal(store.enquiry[0].note, "Called back");

  assert.equal((await admin(`/enquiry/${id}`, { method: "PATCH", body: JSON.stringify({ status: "deleted" }) })).status, 400);
  assert.equal((await admin(`/enquiry/not-an-id`, { method: "PATCH", body: JSON.stringify({ status: "new" }) })).status, 400);
  assert.equal((await admin(`/nothing`)).status, 404);
});

test("admin: CSV export escapes quotes and blocks formula injection", async () => {
  store.enquiry.push({ _id: oid(), ref: "HB-ENQ-TEST22", name: '=HYPERLINK("http://evil")', email: "e@x.com", message: 'say "hi"', status: "new", createdAt: new Date() });
  const res = await admin("/enquiry/export");
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") || "", /text\/csv/);
  const csv = await res.text();
  assert.ok(csv.includes(`"'=HYPERLINK(""http://evil"")"`), "formula should be neutralised");
  assert.ok(csv.includes(`"say ""hi"""`), "quotes should be doubled");
});
