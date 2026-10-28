// Thin typed wrapper around the backend API.
import type { Errors, FormKey, Status, Values } from "./formConfig";

const API = import.meta.env.VITE_API_URL ?? "";

export interface SubmitResult {
  ok: boolean;
  ref?: string;
  message?: string;
  error?: string;
  errors?: Errors;
  /** True when the server could not be reached at all. */
  network?: boolean;
}

export async function submitForm(key: FormKey, values: Values, honeypot: string): Promise<SubmitResult> {
  try {
    const res = await fetch(`${API}/api/forms/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, website: honeypot }),
    });
    const data = (await res.json().catch(() => ({}))) as SubmitResult;
    return { ...data, ok: res.ok && data.ok === true };
  } catch {
    return { ok: false, network: true };
  }
}

// ---------------------------------------------------------------- admin
export interface Row {
  _id: string;
  ref: string;
  status: Status;
  note: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  [key: string]: unknown;
}
export type Summary = Record<FormKey, { label: string; total: number; new: number }>;

export class AdminError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function adminFetch(adminKey: string, path: string, init: RequestInit = {}): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${API}/api/admin${path}`, {
      ...init,
      headers: { "x-admin-key": adminKey, "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
  } catch {
    throw new AdminError(0, "Could not reach the server.");
  }
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    throw new AdminError(res.status, j.error ?? `Request failed (${res.status})`);
  }
  return res;
}

export async function adminSummary(adminKey: string): Promise<Summary> {
  const res = await adminFetch(adminKey, "/summary");
  return ((await res.json()) as { summary: Summary }).summary;
}

export async function adminList(adminKey: string, type: FormKey, status: string, q: string): Promise<Row[]> {
  const qs = new URLSearchParams();
  if (status) qs.set("status", status);
  if (q.trim()) qs.set("q", q.trim());
  const res = await adminFetch(adminKey, `/${type}?${qs.toString()}`);
  return ((await res.json()) as { items: Row[] }).items;
}

export async function adminUpdate(
  adminKey: string,
  type: FormKey,
  id: string,
  patch: { status?: Status; note?: string }
): Promise<Row> {
  const res = await adminFetch(adminKey, `/${type}/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  return ((await res.json()) as { item: Row }).item;
}

export async function adminExportCsv(adminKey: string, type: FormKey): Promise<void> {
  const res = await adminFetch(adminKey, `/${type}/export`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hirebridge-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function adminExportXlsx(adminKey: string, type: FormKey): Promise<void> {
  const res = await adminFetch(adminKey, `/${type}/export.xlsx`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hirebridge-${type}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
