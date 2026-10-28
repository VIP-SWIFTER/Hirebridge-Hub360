// Single source of truth for every dropdown / choice list the forms accept.
// IMPORTANT: client/src/formConfig.ts must contain the same lists
// (the test in test/sync.test.ts fails if they ever drift apart).

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
