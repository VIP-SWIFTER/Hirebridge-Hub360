import { FormEvent, ReactNode, useState } from "react";
import { motion } from "framer-motion";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import SendRounded from "@mui/icons-material/SendRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ContentCopyRounded from "@mui/icons-material/ContentCopyRounded";
import WhatsApp from "@mui/icons-material/WhatsApp";
import EmailRounded from "@mui/icons-material/EmailRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import DoneRounded from "@mui/icons-material/DoneRounded";
import { submitForm } from "../api";
import { BRAND, mailtoLink, waLink } from "../contact";
import { Errors, FieldDef, FormConfig, Values, initialValues, summarize, validateForm } from "../formConfig";
import { C } from "../brand";

const CONTACT_ICONS: Record<string, ReactNode> = {
  WhatsApp: <WhatsApp fontSize="small" />,
  Email: <EmailRounded fontSize="small" />,
  "Phone call": <PhoneRounded fontSize="small" />,
};

const VIA_TEXT: Record<string, string> = {
  WhatsApp: "Our team will reach you on WhatsApp soon.",
  Email: "Our team will reply to you by email soon.",
  "Phone call": "Our team will call you soon.",
};

interface Props {
  config: FormConfig;
  /** Values to pre-fill (e.g. from the Brand Studio). */
  preset?: Partial<Values>;
}

interface Done {
  ref: string;
  values: Values;
}

export default function DynamicForm({ config, preset }: Props) {
  const [values, setValues] = useState<Values>(() => initialValues(config.key, preset));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [honey, setHoney] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const [copied, setCopied] = useState(false);

  const fieldId = (name: string) => `${config.key}-${name}`;

  const set = (name: string, value: Values[string]) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const toggleChip = (name: string, option: string) => {
    const cur = Array.isArray(values[name]) ? (values[name] as string[]) : [];
    set(name, cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option]);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const er = validateForm(config.key, values);
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) {
      document.getElementById(fieldId(first))?.focus();
      return;
    }

    setStatus("sending");
    setNotice("");
    const res = await submitForm(config.key, values, honey);
    if (res.ok && res.ref) {
      setDone({ ref: res.ref, values });
      setStatus("idle");
      return;
    }
    if (res.errors) setErrors(res.errors);
    setStatus("error");
    setNotice(
      res.network
        ? `Could not reach the server. Please call or WhatsApp us on ${BRAND.phoneDisplay}.`
        : res.error ?? "Please check the highlighted fields and try again."
    );
  };

  const reset = () => {
    setDone(null);
    setValues(initialValues(config.key));
    setErrors({});
    setNotice("");
    setStatus("idle");
    setCopied(false);
  };

  // ------------------------------------------------------------ success screen
  if (done) {
    const name = String(done.values.name ?? "").trim().split(" ")[0] || "there";
    const via = typeof done.values.contactVia === "string" ? done.values.contactVia : "";
    const details = summarize(config.key, done.values);
    const wa = waLink(`Hi Hirebridge Hub360°, I just submitted a ${config.noun} (Ref: ${done.ref}).\n\n${details}`);
    const mail = mailtoLink(
      `${config.noun} - ${done.ref}`,
      `Hi Hirebridge Hub360° team,\n\nI just submitted a ${config.noun} (Ref: ${done.ref}).\n\n${details}\n\nThanks,\n${String(done.values.name ?? "")}`
    );
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(done.ref);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        /* clipboard not available: the reference is visible on screen anyway */
      }
    };

    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <Box sx={{ textAlign: "center", py: { xs: 1, md: 3 } }} role="status">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}>
            <CheckCircleRounded sx={{ fontSize: 76, color: "#5de0b0" }} />
          </motion.div>
          <Typography variant="h4" sx={{ mt: 1, mb: 1, fontSize: { xs: "1.6rem", md: "2rem" } }}>
            Thank you, {name}!
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 460, mx: "auto" }}>
            Your {config.noun.toLowerCase()} is saved. Please keep this reference number:
          </Typography>

          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, my: 2.5, pl: 2.5, pr: 1, py: 0.75, borderRadius: "14px", border: "1px dashed rgba(255,200,30,.55)", bgcolor: "rgba(255,200,30,.08)" }}>
            <Typography sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "0.06em", color: "primary.dark" }}>
              {done.ref}
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy"}>
              <IconButton size="small" onClick={copy} aria-label="Copy reference number">
                {copied ? <DoneRounded fontSize="small" /> : <ContentCopyRounded fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>

          <Typography color="text.secondary" sx={{ maxWidth: 460, mx: "auto", mb: 3 }}>
            {VIA_TEXT[via] ?? "Our team will contact you soon."} Want a faster reply? Message the manager right now:
          </Typography>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, justifyContent: "center" }}>
            <Button variant="contained" href={wa} target="_blank" rel="noreferrer" startIcon={<WhatsApp />} sx={{ bgcolor: "#FFC81E", color: "#111", "&:hover": { bgcolor: "#FFE27A" } }}>
              Continue on WhatsApp
            </Button>
            <Button variant="outlined" color="inherit" href={mail} startIcon={<EmailRounded />} sx={{ borderColor: C.line }}>
              Send by email
            </Button>
          </Box>

          <Button onClick={reset} startIcon={<ReplayRounded />} sx={{ mt: 3, color: "text.secondary" }}>
            Submit another response
          </Button>
        </Box>
      </motion.div>
    );
  }

  // ------------------------------------------------------------ fields
  const renderField = (f: FieldDef) => {
    const id = fieldId(f.name);
    const err = errors[f.name];
    const half = "half" in f && f.half;
    const cell = { gridColumn: half ? { xs: "1 / -1", sm: "auto" } : "1 / -1" };

    switch (f.kind) {
      case "text":
        return (
          <Box key={f.name} sx={cell}>
            <TextField
              id={id}
              fullWidth
              label={f.label}
              type={f.inputType ?? "text"}
              required={f.required}
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              value={values[f.name] as string}
              onChange={(e) => set(f.name, e.target.value)}
              error={Boolean(err)}
              helperText={err || " "}
              inputProps={{ maxLength: f.max ?? 120, ...(f.inputType === "tel" ? { inputMode: "tel" } : {}) }}
            />
          </Box>
        );
      case "textarea": {
        const len = (values[f.name] as string).length;
        return (
          <Box key={f.name} sx={cell}>
            <TextField
              id={id}
              fullWidth
              multiline
              minRows={f.rows ?? 3}
              label={f.label}
              required={f.required}
              placeholder={f.placeholder}
              value={values[f.name] as string}
              onChange={(e) => set(f.name, e.target.value)}
              error={Boolean(err)}
              helperText={err || `${len}/${f.max}`}
              inputProps={{ maxLength: f.max }}
            />
          </Box>
        );
      }
      case "select":
        return (
          <Box key={f.name} sx={cell}>
            <TextField
              id={id}
              select
              fullWidth
              label={f.label}
              required={f.required}
              value={values[f.name] as string}
              onChange={(e) => set(f.name, e.target.value)}
              error={Boolean(err)}
              helperText={err || " "}
            >
              {f.options.map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        );
      case "radio":
        return (
          <Box key={f.name} sx={{ ...cell, mb: 2.5 }}>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 1 }}>
              {f.label}
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              id={id}
              value={values[f.name] as string}
              onChange={(_, v: string | null) => v && set(f.name, v)}
              aria-label={f.label}
              sx={{ "& .MuiToggleButton-root": { gap: 1, py: 1.25, textTransform: "none", fontWeight: 700, borderColor: C.line, "&.Mui-selected": { bgcolor: "rgba(255,200,30,.16)", color: "primary.dark", borderColor: "primary.main" } } }}
            >
              {f.options.map((o) => (
                <ToggleButton key={o} value={o}>
                  {CONTACT_ICONS[o]}
                  {o}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        );
      case "chips": {
        const sel = Array.isArray(values[f.name]) ? (values[f.name] as string[]) : [];
        return (
          <Box key={f.name} sx={{ ...cell, mb: 2.5 }} id={id} tabIndex={-1}>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: err ? "error.main" : "text.secondary", mb: 1.25 }}>
              {f.label}
              {f.required ? " *" : ""}
              {f.hint ? <Box component="span" sx={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}> · {f.hint}</Box> : null}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {f.options.map((o) => {
                const on = sel.includes(o);
                return (
                  <Chip
                    key={o}
                    label={o}
                    clickable
                    onClick={() => toggleChip(f.name, o)}
                    color={on ? "primary" : "default"}
                    variant={on ? "filled" : "outlined"}
                    icon={on ? <DoneRounded /> : undefined}
                    aria-pressed={on}
                    sx={{ fontWeight: 700, borderColor: on ? "primary.main" : C.line }}
                  />
                );
              })}
            </Box>
            {err && <FormHelperText error>{err}</FormHelperText>}
          </Box>
        );
      }
      case "consent":
        return (
          <Box key={f.name} sx={{ ...cell, mb: 1.5 }}>
            <FormControlLabel
              control={<Checkbox id={id} checked={values[f.name] === true} onChange={(e) => set(f.name, e.target.checked)} />}
              label={<Typography sx={{ fontSize: "0.92rem" }}>{f.label}</Typography>}
            />
            {err && <FormHelperText error sx={{ ml: 1.75 }}>{err}</FormHelperText>}
          </Box>
        );
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} noValidate aria-label={config.title} sx={{ position: "relative" }}>
      <Collapse in={Boolean(notice)}>
        <Alert severity="error" variant="outlined" sx={{ mb: 2.5, borderRadius: "14px", fontWeight: 600 }}>
          {notice}
        </Alert>
      </Collapse>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, columnGap: 2.25 }}>
        {config.fields.map(renderField)}
      </Box>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={status === "sending"}
        endIcon={status === "sending" ? <CircularProgress size={18} color="inherit" /> : <SendRounded />}
        sx={{ width: { xs: "100%", sm: "auto" }, boxShadow: "0 10px 30px -10px rgba(255,200,30,.6)" }}
      >
        {status === "sending" ? "Saving..." : config.submitLabel}
      </Button>
    </Box>
  );
}
