// One page per form. Each page has its own URL hash: /#/talk-to-manager, /#/placement-registration, ...
import type { ReactElement } from "react";
import SupportAgentRounded from "@mui/icons-material/SupportAgentRounded";
import CampaignRounded from "@mui/icons-material/CampaignRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import HowToRegRounded from "@mui/icons-material/HowToRegRounded";
import type { FormKey } from "./formConfig";

export interface FormPageInfo {
  slug: string;
  path: string;
  icon: ReactElement;
  /** Three short "what happens next" lines shown beside the form. */
  next: [string, string, string];
}

export const FORM_PAGES: Record<FormKey, FormPageInfo> = {
  enquiry: {
    slug: "talk-to-manager",
    path: "#/talk-to-manager",
    icon: <SupportAgentRounded />,
    next: ["You send your question", "The manager replies on WhatsApp, email or call", "We agree the next step together"],
  },
  marketing: {
    slug: "marketing-branding",
    path: "#/marketing-branding",
    icon: <CampaignRounded />,
    next: ["You share your project brief", "We reply with ideas and a clear quote", "Design starts once you approve"],
  },
  placement: {
    slug: "placement-registration",
    path: "#/placement-registration",
    icon: <SchoolRounded />,
    next: ["Your profile is saved securely", "Our team matches it with openings", "We contact you about interviews"],
  },
  register: {
    slug: "free-registration",
    path: "#/free-registration",
    icon: <HowToRegRounded />,
    next: ["You register in under a minute", "We keep you updated on services and openings", "Reach us any time with your reference number"],
  },
};

export type Route = { kind: "home" } | { kind: "admin" } | { kind: "form"; form: FormKey };

export function parseRoute(hash: string): Route {
  if (hash.startsWith("#/admin")) return { kind: "admin" };
  for (const [key, p] of Object.entries(FORM_PAGES)) {
    if (hash === p.path) return { kind: "form", form: key as FormKey };
  }
  return { kind: "home" };
}
