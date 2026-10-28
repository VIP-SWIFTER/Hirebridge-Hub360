// Placement registrations are saved in MongoDB AND appended to a separate Excel file
// (default: server/data/placement-registrations.xlsx, override with PLACEMENT_XLSX_PATH).
// The Excel write is best-effort: if it fails, the registration is still safely in MongoDB.
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import type { FormDef, FormRecord } from "../forms";

const SHEET = "Placement Registrations";

export const placementXlsxPath = (): string =>
  path.resolve(process.env.PLACEMENT_XLSX_PATH || path.join(process.cwd(), "data", "placement-registrations.xlsx"));

const cell = (v: unknown): string | number => {
  if (Array.isArray(v)) return v.join("; ");
  if (v instanceof Date) return v.toISOString().replace("T", " ").slice(0, 19);
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (v == null) return "";
  return String(v);
};

function columns(form: FormDef) {
  return [
    { header: "Reference", key: "ref", width: 18 },
    { header: "Registered on", key: "createdAt", width: 20 },
    { header: "Status", key: "status", width: 13 },
    ...Object.entries(form.spec).map(([key, f]) => ({
      header: f.label,
      key,
      width: f.type === "longtext" ? 40 : f.type === "email" || f.type === "url" ? 32 : 22,
    })),
    { header: "Admin note", key: "note", width: 30 },
  ];
}

function styleSheet(ws: ExcelJS.Worksheet) {
  const head = ws.getRow(1);
  head.height = 24;
  head.eachCell((c) => {
    c.font = { bold: true, color: { argb: "FF111111" } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC81E" } }; // brand yellow
    c.alignment = { vertical: "middle", wrapText: true };
    c.border = { bottom: { style: "medium", color: { argb: "FFE4202D" } } }; // brand red
  });
  ws.views = [{ state: "frozen", ySplit: 1 }];
}

function rowValues(form: FormDef, doc: FormRecord) {
  const row: Record<string, string | number> = {};
  for (const c of columns(form)) row[c.key] = cell((doc as Record<string, unknown>)[c.key]);
  return row;
}

// Serialise writes so two simultaneous registrations never corrupt the file.
let queue: Promise<unknown> = Promise.resolve();

/** Appends one registration to the Excel file on disk (creates it, with headers, if needed). */
export function appendPlacementRow(form: FormDef, doc: FormRecord): Promise<void> {
  const job = queue.then(async () => {
    const file = placementXlsxPath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const wb = new ExcelJS.Workbook();
    if (fs.existsSync(file)) await wb.xlsx.readFile(file);
    let ws = wb.getWorksheet(SHEET);
    const fresh = !ws;
    if (!ws) ws = wb.addWorksheet(SHEET);
    ws.columns = columns(form);
    if (fresh) styleSheet(ws);
    ws.addRow(rowValues(form, doc));
    // Write to a temp file then rename, so a crash mid-write cannot leave a broken workbook.
    const tmp = `${file}.tmp`;
    await wb.xlsx.writeFile(tmp);
    fs.renameSync(tmp, file);
  });
  queue = job.catch(() => undefined);
  return job;
}

/** Builds a fresh workbook from every saved submission of a form (used by the admin Excel download). */
export async function buildWorkbook(form: FormDef, docs: FormRecord[]): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Hirebridge Hub360°";
  const ws = wb.addWorksheet(form.label.replace(/[\\/?*[\]:]/g, " ").slice(0, 31));
  ws.columns = columns(form);
  styleSheet(ws);
  for (const d of docs) ws.addRow(rowValues(form, d));
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: ws.columnCount } };
  return wb;
}
