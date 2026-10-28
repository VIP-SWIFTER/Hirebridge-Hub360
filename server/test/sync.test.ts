// Guards against the client and server drifting apart: the form UI (client/src/formConfig.ts)
// must offer exactly the choices, fields and required rules the API (server/src/forms.ts) accepts.
import test from "node:test";
import assert from "node:assert/strict";
import * as server from "../src/utils/options";
import { FORMS, FormKey } from "../src/forms";
import * as client from "../../client/src/formConfig";

const LISTS = [
  "SERVICE_TITLES",
  "ENQUIRY_TOPICS",
  "CONTACT_VIA",
  "MARKETING_SERVICES",
  "BUDGETS",
  "TIMELINES",
  "EXISTING_BRAND",
  "QUALIFICATIONS",
  "EXPERIENCE",
  "JOB_TYPES",
  "REGISTER_AS",
  "INTERESTS",
  "HEARD_FROM",
  "GENDERS",
  "CURRENT_STATUS",
  "PASSING_YEARS",
  "EXPECTED_SALARY",
  "NOTICE_PERIODS",
  "STATUSES",
] as const;

test("option lists are identical on client and server", () => {
  for (const name of LISTS) {
    assert.deepEqual([...client[name]], [...server[name]], `${name} differs`);
  }
});

test("every client field exists on the server with the same options and required flag", () => {
  for (const key of Object.keys(FORMS) as FormKey[]) {
    const spec = FORMS[key].spec;
    const fields = client.FORM_CONFIGS[key].fields;

    // Every field in the UI must be accepted by the API...
    for (const f of fields) {
      const s = spec[f.name];
      assert.ok(s, `${key}.${f.name} is shown in the form but missing on the server`);
      assert.equal(Boolean(s.required), Boolean(f.required), `${key}.${f.name} required flag differs`);
      if ("options" in f && (s.type === "enum" || s.type === "multi")) {
        assert.deepEqual([...f.options], [...s.options], `${key}.${f.name} options differ`);
      }
    }
    // ...and every field the API stores must be collected by the UI.
    for (const name of Object.keys(spec)) {
      assert.ok(fields.some((f) => f.name === name), `${key}.${name} is stored but never collected`);
    }
  }
});

test("client validation accepts a complete form and rejects an empty one", () => {
  for (const key of client.FORM_KEYS) {
    assert.ok(Object.keys(client.validateForm(key, client.initialValues(key))).length > 0, `${key}: empty form should fail`);
  }
  const ok = client.initialValues("enquiry", {
    name: "Vipin",
    email: "v@example.com",
    phone: "7845620360",
    topic: "Custom Logo Design",
    message: "Need a logo for my shop.",
  });
  assert.deepEqual(client.validateForm("enquiry", ok), {});
  // WhatsApp (the default) needs a phone number
  assert.ok(client.validateForm("enquiry", { ...ok, phone: "" }).phone);
});
