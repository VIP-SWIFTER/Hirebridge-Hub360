import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Theme } from "@mui/material/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";
import InboxRounded from "@mui/icons-material/InboxRounded";
import WhatsApp from "@mui/icons-material/WhatsApp";
import EmailRounded from "@mui/icons-material/EmailRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import SaveRounded from "@mui/icons-material/SaveRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { AdminError, Row, Summary, adminExportCsv, adminExportXlsx, adminList, adminSummary, adminUpdate } from "../api";
import { FORM_CONFIGS, FORM_KEYS, FormKey, STATUSES, Status } from "../formConfig";
import { mailtoLink, telLink, waLink, waNumber } from "../contact";
import { C } from "../brand";
import ThemeToggle from "../components/ThemeToggle";
import { AdminBackground, CountUp, accentBorder, accentGlow, glass, isDark, shine, slideLine } from "./AdminFx";

const KEY_STORE = "hb_admin_key";
const readKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORE) ?? "";
  } catch {
    return "";
  }
};
const saveKey = (k: string) => {
  try {
    if (k) sessionStorage.setItem(KEY_STORE, k);
    else sessionStorage.removeItem(KEY_STORE);
  } catch {
    /* storage unavailable: the key just won't be remembered */
  }
};

const STATUS_COLOR: Record<Status, "primary" | "info" | "warning" | "success"> = {
  new: "primary",
  contacted: "info",
  "in-progress": "warning",
  closed: "success",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

function fmtValue(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function loginErrorMessage(e: unknown): string {
  if (e instanceof AdminError && e.status === 401) return "That admin key is not correct.";
  if (e instanceof Error) return e.message;
  return "Login failed.";
}

function welcomeText(summary: Summary | null, totalNew: number): string {
  if (!summary) return "Loading your dashboard...";
  if (totalNew === 0) return "You are all caught up. No new submissions right now.";
  return `You have ${totalNew} new submission${totalNew === 1 ? "" : "s"} waiting for a reply.`;
}

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";

const outlineBtn = (t: Theme) => ({
  borderColor: isDark(t) ? "rgba(255,255,255,.22)" : "rgba(15,23,42,.22)",
  transition: "transform .2s ease, border-color .2s ease, background-color .2s ease",
  "&:hover": { transform: "translateY(-2px)", borderColor: t.palette.primary.main, backgroundColor: isDark(t) ? "rgba(255,200,30,.08)" : "rgba(255,200,30,.14)" },
});

const ease = [0.22, 1, 0.36, 1] as const;

const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" };

// ---------------------------------------------------------------- one submission
function RowEditor({ type, row, adminKey, onSaved }: Readonly<{ type: FormKey; row: Row; adminKey: string; onSaved: (r: Row) => void }>) {
  const [status, setStatus] = useState<Status>(row.status);
  const [note, setNote] = useState(row.note ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const noun = FORM_CONFIGS[type].noun;
  const dirty = status !== row.status || note !== (row.note ?? "");

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const updated = await adminUpdate(adminKey, type, row._id, { status, note });
      onSaved(updated);
      setMsg({ ok: true, text: "Saved" });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Could not save" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${C.line}` }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "220px 1fr" }, gap: 2 }}>
        <TextField select size="small" label="Status" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField size="small" label="Internal note (only you see this)" value={note} onChange={(e) => setNote(e.target.value)} inputProps={{ maxLength: 1000 }} multiline minRows={1} maxRows={4} />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.25, mt: 2 }}>
        <Button variant="contained" size="small" sx={shine} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveRounded />} disabled={!dirty || saving} onClick={save}>
          Save
        </Button>
        {msg && (
          <Typography component="output" sx={{ fontSize: "0.88rem", fontWeight: 600, color: msg.ok ? "success.main" : "error.main" }}>
            {msg.text}
          </Typography>
        )}
        <Box sx={{ flex: 1 }} />
        {row.phone && (
          <>
            <Button size="small" variant="outlined" color="inherit" startIcon={<WhatsApp />} href={waLink(`Hi ${row.name}, this is Hirebridge Hub360° about your ${noun} (Ref: ${row.ref}).`, waNumber(row.phone))} target="_blank" rel="noreferrer" sx={outlineBtn}>
              WhatsApp
            </Button>
            <Button size="small" variant="outlined" color="inherit" startIcon={<PhoneRounded />} href={telLink(row.phone)} sx={outlineBtn}>
              Call
            </Button>
          </>
        )}
        <Button size="small" variant="outlined" color="inherit" startIcon={<EmailRounded />} href={mailtoLink(`Regarding your ${noun} - ${row.ref}`, `Hi ${row.name},\n\n`, row.email)} sx={outlineBtn}>
          Email
        </Button>
      </Box>
    </Box>
  );
}

function RowItem({ type, row, adminKey, onSaved, index }: Readonly<{ type: FormKey; row: Row; adminKey: string; onSaved: (r: Row) => void; index: number }>) {
  const fields = FORM_CONFIGS[type].fields.filter((f) => f.kind !== "consent" || row[f.name] !== undefined);
  const tone = STATUS_COLOR[row.status] ?? "primary";
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: Math.min(index, 10) * 0.045 }}>
      <Accordion
        disableGutters
        elevation={0}
        square={false}
        slotProps={{ transition: { unmountOnExit: true } }}
        sx={(t) => ({
          ...glass(t),
          position: "relative",
          borderRadius: "16px !important",
          "&::before": { display: "none" },
          overflow: "hidden",
          transition: "transform .22s ease, box-shadow .22s ease, border-color .22s ease",
          "&:hover": { transform: "translateY(-2px)", borderColor: accentBorder(t) },
          "&.Mui-expanded": { borderColor: accentBorder(t), boxShadow: accentGlow(t), transform: "none" },
          // coloured stripe on the left shows the status at a glance
          "&::after": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: t.palette[tone].main },
        })}
      >
        <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={{ px: 2.5, pl: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, flexWrap: "wrap", width: "100%", pr: 1 }}>
            <Box
              aria-hidden
              sx={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 800, fontSize: "0.9rem", color: "#111", background: "linear-gradient(135deg,#FFE27A,#FFC81E 55%,#FF8A3D)", boxShadow: "0 4px 14px -4px rgba(255,160,0,.6)" }}
            >
              {initials(row.name)}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.25 }}>{row.name}</Typography>
              <Typography sx={{ ...mono, fontSize: "0.78rem", color: "primary.dark" }}>{row.ref}</Typography>
            </Box>
            <Chip size="small" label={row.status} color={tone} variant={row.status === "new" ? "filled" : "outlined"} sx={{ fontWeight: 700, minWidth: 84, ml: { sm: 1 } }} />
            <Typography sx={{ ml: { sm: "auto" }, fontSize: "0.85rem", color: "text.secondary" }}>{fmtDate(row.createdAt)}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 3, pb: 3 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
            {fields.map((f) => {
              const value = fmtValue(row[f.name]);
              const wide = f.kind === "textarea" || f.kind === "chips";
              return (
                <Box key={f.name} sx={{ gridColumn: wide ? { sm: "1 / -1" } : "auto", minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary" }}>
                    {f.kind === "consent" ? "Consent given" : f.label.replace(/ \(.*\)$/, "")}
                  </Typography>
                  <Typography sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap", color: value ? "text.primary" : "text.disabled" }}>{value || "—"}</Typography>
                </Box>
              );
            })}
          </Box>
          <RowEditor type={type} row={row} adminKey={adminKey} onSaved={onSaved} />
        </AccordionDetails>
      </Accordion>
    </motion.div>
  );
}

// ---------------------------------------------------------------- page
function Shell({ children, onLogout }: Readonly<{ children: ReactNode; onLogout?: () => void }>) {
  return (
    <Box sx={{ minHeight: "100vh", position: "relative", pb: 8 }}>
      <AdminBackground />
      <Box
        component={motion.header}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        sx={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", bgcolor: "var(--hb-nav-bg)", borderBottom: `1px solid ${C.line}`, mb: 4 }}
      >
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.5 }}>
          <Box component="img" src="/emblem.png" alt="" sx={{ width: 38, height: 38, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(255,200,30,.45))", animation: "hbFloat 4s ease-in-out infinite" }} />
          <Typography variant="h6" component="h1" sx={{ lineHeight: 1.1 }}>
            Hirebridge <Box component="b" sx={{ color: "primary.dark" }}>Hub360°</Box>
            <Typography component="span" sx={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary", fontFamily: "inherit", fontWeight: 600 }}>
              Admin dashboard
            </Typography>
          </Typography>
          <Chip
            size="small"
            label="Live"
            icon={<Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#2ecc71", ml: "8px !important", boxShadow: "0 0 0 0 rgba(46,204,113,.6)", animation: "hbBeacon 1.8s ease-in-out infinite" }} />}
            sx={{ display: { xs: "none", sm: "inline-flex" }, ml: 1, fontWeight: 700, bgcolor: "transparent", border: `1px solid ${C.line}` }}
          />
          <Box sx={{ flex: 1 }} />
          <ThemeToggle />
          <Button size="small" color="inherit" href="#home" startIcon={<ArrowBackRounded />} sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}>
            Website
          </Button>
          {onLogout && (
            <Button size="small" color="inherit" onClick={onLogout} startIcon={<LogoutRounded />} sx={{ color: "text.secondary", "&:hover": { color: "secondary.main" } }}>
              Log out
            </Button>
          )}
        </Container>
        <Box sx={{ height: 2, background: "linear-gradient(90deg, transparent, #FFC81E, #E4202D, #FFC81E, transparent)", backgroundSize: "200% 100%", animation: `${slideLine} 5s linear infinite`, opacity: 0.85 }} />
      </Box>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {children}
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------- login screen
interface LoginProps {
  input: string;
  onInput: (v: string) => void;
  showKey: boolean;
  onToggleKey: () => void;
  busy: boolean;
  loginError: string;
  onSubmit: (e: FormEvent) => void;
}

function LoginScreen({ input, onInput, showKey, onToggleKey, busy, loginError, onSubmit }: Readonly<LoginProps>) {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2, position: "relative" }}>
      <AdminBackground />
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
        <ThemeToggle />
      </Box>
      <motion.div initial={{ opacity: 0, y: 28, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.65, ease }} style={{ position: "relative", zIndex: 1, width: "min(100%, 420px)" }}>
        {/* rotating gradient ring around the card */}
        <Box sx={(t) => ({ position: "relative", borderRadius: "26px", p: "1.5px", overflow: "hidden", boxShadow: isDark(t) ? "0 30px 80px -30px rgba(255,200,30,.28)" : "0 30px 70px -30px rgba(15,23,42,.35)" })}>
          <Box aria-hidden sx={{ position: "absolute", inset: "-60%", background: "conic-gradient(from 0deg, transparent 0 55%, #FFC81E, #E4202D, transparent 95%)", animation: "hbSpin 5s linear infinite" }} />
          <Paper
            component="form"
            onSubmit={onSubmit}
            sx={(t) => ({ position: "relative", p: { xs: 3, sm: 4 }, borderRadius: "25px", backgroundImage: "none", bgcolor: isDark(t) ? "#0d0d0f" : "#FFFFFF", textAlign: "center" })}
          >
            <Box sx={{ position: "relative", width: 92, height: 92, mx: "auto", mb: 2 }}>
              <Box aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px dashed rgba(255,200,30,.7)", animation: "hbSpin 14s linear infinite" }} />
              <Box component="img" src="/emblem.png" alt="" sx={{ position: "absolute", inset: 14, width: 64, height: 64, objectFit: "contain", filter: "drop-shadow(0 0 14px rgba(255,200,30,.55))", animation: "hbFloat 4s ease-in-out infinite" }} />
            </Box>
            <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
              Admin dashboard
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, fontSize: "0.95rem" }}>
              Enter your admin key to view enquiries, applications and registrations.
            </Typography>
            {loginError && (
              <motion.div key={loginError} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: [-12, 9, -7, 4, 0] }} transition={{ duration: 0.45 }}>
                <Alert severity="error" variant="outlined" sx={{ mb: 2, textAlign: "left", borderRadius: "12px" }}>
                  {loginError}
                </Alert>
              </motion.div>
            )}
            <TextField
              fullWidth
              autoFocus
              type={showKey ? "text" : "password"}
              label="Admin key"
              value={input}
              onChange={(e) => onInput(e.target.value)}
              autoComplete="current-password"
              InputProps={{
                startAdornment: (<InputAdornment position="start"><LockRounded fontSize="small" /></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={showKey ? "Hide admin key" : "Show admin key"}>
                      <IconButton
                        edge="end"
                        size="small"
                        aria-label={showKey ? "Hide admin key" : "Show admin key"}
                        aria-pressed={showKey}
                        onClick={onToggleKey}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showKey ? <VisibilityOffRounded fontSize="small" /> : <VisibilityRounded fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5, "& .MuiOutlinedInput-root.Mui-focused": { boxShadow: "0 0 0 4px rgba(255,200,30,.2)" } }}
            />
            <Button type="submit" fullWidth variant="contained" size="large" sx={shine} disabled={busy || !input.trim()} startIcon={busy ? <CircularProgress size={18} color="inherit" /> : undefined}>
              {busy ? "Checking..." : "Unlock"}
            </Button>
            <Button href="#home" color="inherit" size="small" sx={{ mt: 2, color: "text.secondary" }}>
              Back to website
            </Button>
          </Paper>
        </Box>
      </motion.div>
    </Box>

  );
}

// ---------------------------------------------------------------- stat cards
function StatCards({ summary, type, onPick }: Readonly<{ summary: Summary | null; type: FormKey; onPick: (k: FormKey) => void }>) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 3.5 }}>
      {FORM_KEYS.map((k, i) => {
        const s = summary?.[k];
        const on = k === type;
        return (
          <motion.div key={k} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.5, ease, delay: 0.12 + i * 0.08 }}>
            <Card sx={(t) => ({ ...glass(t), position: "relative", overflow: "hidden", borderRadius: "18px", borderColor: on ? accentBorder(t) : undefined, boxShadow: on ? accentGlow(t) : glass(t).boxShadow, transition: "border-color .25s ease, box-shadow .25s ease" })}>
              <CardActionArea onClick={() => onPick(k)} sx={{ p: 2.25 }} aria-pressed={on}>
                <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: on ? "primary.dark" : "text.secondary" }}>
                  {FORM_CONFIGS[k].tab}
                </Typography>
                <Typography sx={{ fontSize: "2.3rem", fontWeight: 800, lineHeight: 1.15, fontVariantNumeric: "tabular-nums" }}>{s ? <CountUp value={s.total} /> : "–"}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.9, minHeight: 22 }}>
                  {s && s.new > 0 && <Box aria-hidden sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "secondary.main", animation: "hbBeacon 1.6s ease-in-out infinite" }} />}
                  <Typography sx={{ fontSize: "0.85rem", color: s && s.new > 0 ? "secondary.main" : "text.secondary", fontWeight: 700 }}>{s ? `${s.new} new` : " "}</Typography>
                </Box>
              </CardActionArea>
              {on && <Box component={motion.div} layoutId="adminStatBar" transition={{ type: "spring", stiffness: 380, damping: 32 }} sx={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: "linear-gradient(90deg,#FFC81E,#E4202D)" }} />}
            </Card>
          </motion.div>
        );
      })}
    </Box>
  );
}

// ---------------------------------------------------------------- results
interface ResultListProps {
  loading: boolean;
  items: Row[];
  type: FormKey;
  filtered: boolean;
  adminKey: string;
  onSaved: (r: Row) => void;
}

function ResultList({ loading, items, type, filtered, adminKey, onSaved }: Readonly<ResultListProps>) {
  if (loading && items.length === 0) {
    return (
      <Box sx={{ display: "grid", gap: 1.5 }}>
        {[0, 1, 2, 3].map((n) => (
          <Skeleton key={n} variant="rounded" height={74} animation="wave" sx={{ borderRadius: "16px" }} />
        ))}
      </Box>
    );
  }
  if (items.length === 0) {
    return (
      <Box sx={(t) => ({ ...glass(t), textAlign: "center", py: 8, borderRadius: "20px", color: "text.secondary" })}>
        <InboxRounded sx={{ fontSize: 60, opacity: 0.7, animation: "hbFloat 3.5s ease-in-out infinite" }} />
        <Typography sx={{ mt: 1 }}>No {FORM_CONFIGS[type].tab.toLowerCase()} submissions {filtered ? "match your filters" : "yet"}.</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ display: "grid", gap: 1.5, opacity: loading ? 0.7 : 1, transition: "opacity .2s ease" }}>
      {items.map((r, i) => (
        <RowItem key={r._id} index={i} type={type} row={r} adminKey={adminKey} onSaved={onSaved} />
      ))}
    </Box>
  );
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [input, setInput] = useState(readKey);
  const [authed, setAuthed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showKey, setShowKey] = useState(false); // show / hide the admin key while typing

  const [summary, setSummary] = useState<Summary | null>(null);
  const [type, setType] = useState<FormKey>("enquiry");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0); // bump to force a reload

  // Keep the admin page out of search engines and give it its own title.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Admin | Hirebridge Hub360°";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      meta.remove();
    };
  }, []);

  const logout = useCallback(() => {
    saveKey("");
    setAuthed(false);
    setAdminKey("");
    setInput("");
    setSummary(null);
    setItems([]);
  }, []);

  const login = useCallback(async (key: string) => {
    setBusy(true);
    setLoginError("");
    try {
      const s = await adminSummary(key);
      saveKey(key);
      setAdminKey(key);
      setSummary(s);
      setAuthed(true);
    } catch (e) {
      saveKey("");
      setLoginError(loginErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }, []);

  // Auto-login if a key was kept for this browser tab.
  useEffect(() => {
    const k = readKey();
    if (k) login(k).catch(() => undefined);
  }, [login]);

  // Load the list whenever tab / filters change (search is debounced).
  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const rows = await adminList(adminKey, type, status, q);
        if (!cancelled) {
          setItems(rows);
          setError("");
        }
      } catch (e) {
        if (cancelled) return;
        if (e instanceof AdminError && e.status === 401) logout();
        else setError(e instanceof Error ? e.message : "Could not load data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [authed, adminKey, type, status, q, tick, logout]);

  const onSaved = (row: Row) => {
    setItems((list) => list.map((r) => (r._id === row._id ? { ...r, ...row } : r)));
    adminSummary(adminKey).then(setSummary).catch(() => undefined);
  };

  const exportXlsx = async () => {
    try {
      await adminExportXlsx(adminKey, type);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Excel export failed.");
    }
  };

  const exportCsv = async () => {
    try {
      await adminExportCsv(adminKey, type);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    }
  };

  // ------------------------------------------------------------ login screen
  if (!authed) {
    return (
      <LoginScreen
        input={input}
        onInput={setInput}
        showKey={showKey}
        onToggleKey={() => setShowKey((v) => !v)}
        busy={busy}
        loginError={loginError}
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) login(input.trim()).catch(() => undefined);
        }}
      />
    );
  }

  // ------------------------------------------------------------ dashboard
  const totalNew = summary ? FORM_KEYS.reduce((n, k) => n + (summary[k]?.new ?? 0), 0) : 0;

  return (
    <Shell onLogout={logout}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.1 }}>
        <Typography variant="h4" component="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, mb: 0.5 }}>
          Welcome back <Box component="span" sx={{ display: "inline-block", transformOrigin: "70% 70%", animation: "hbWave 3.2s ease-in-out 1" }}>👋</Box>
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          {welcomeText(summary, totalNew)}
        </Typography>
      </motion.div>

      <StatCards summary={summary} type={type} onPick={setType} />

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.45 }}>
        <Box sx={(t) => ({ ...glass(t), display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center", p: 1.5, borderRadius: "18px", mb: 2.5 })}>
          <TextField
            size="small"
            placeholder="Search name, email, phone or reference"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{ flex: "1 1 260px", "& .MuiOutlinedInput-root.Mui-focused": { boxShadow: "0 0 0 4px rgba(255,200,30,.2)" }, "& .MuiOutlinedInput-root": { transition: "box-shadow .2s ease" } }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment>) }}
          />
          <TextField select size="small" label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="">All</MenuItem>
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <Tooltip title="Refresh">
            <IconButton
              onClick={() => { setTick((n) => n + 1); adminSummary(adminKey).then(setSummary).catch(() => undefined); }}
              aria-label="Refresh"
              sx={{ border: `1px solid ${C.line}`, "& svg": { transition: "transform .5s ease" }, "&:hover svg": { transform: "rotate(180deg)" }, "&:hover": { borderColor: "primary.main" } }}
            >
              <RefreshRounded />
            </IconButton>
          </Tooltip>
          <Button variant="contained" sx={shine} startIcon={<DownloadRounded />} onClick={exportXlsx}>
            Download Excel (.xlsx)
          </Button>
          <Button variant="outlined" color="inherit" sx={outlineBtn} startIcon={<DownloadRounded />} onClick={exportCsv}>
            Export CSV
          </Button>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" variant="outlined" sx={{ mb: 2, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      {loading && items.length > 0 && <LinearProgress sx={{ mb: 1.5, borderRadius: 2, height: 3 }} />}

      <ResultList
        loading={loading}
        items={items}
        type={type}
        filtered={Boolean(q || status)}
        adminKey={adminKey}
        onSaved={onSaved}
      />
    </Shell>
  );
}