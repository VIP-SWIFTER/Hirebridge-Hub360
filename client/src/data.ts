import type { SvgIconComponent } from "@mui/icons-material";
import BrushRounded from "@mui/icons-material/BrushRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import VerifiedUserRounded from "@mui/icons-material/VerifiedUserRounded";
import CampaignRounded from "@mui/icons-material/CampaignRounded";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import CreditCardRounded from "@mui/icons-material/CreditCardRounded";
import WorkspacePremiumRounded from "@mui/icons-material/WorkspacePremiumRounded";
import TravelExploreRounded from "@mui/icons-material/TravelExploreRounded";
import StyleRounded from "@mui/icons-material/StyleRounded";
import ShareRounded from "@mui/icons-material/ShareRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import type { FormKey } from "./formConfig";

export { BRAND } from "./contact";

export interface NavLink {
  label: string;
  href: string;
  /** If set, the link opens this form instead of just scrolling. */
  form?: FormKey;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Showcase", href: "#showcase" },
  { label: "Journey", href: "#end-to-end" },
  { label: "Studio", href: "#studio" },
  { label: "Placement", href: "#/placement-registration", form: "placement" },
  { label: "Register", href: "#/free-registration", form: "register" },
];

export interface Service {
  icon: SvgIconComponent;
  title: string;
  desc: string;
}

// Titles must match SERVICE_TITLES in formConfig.ts (they feed the enquiry topic list).
export const SERVICES: Service[] = [
  {
    icon: BrushRounded,
    title: "Custom Logo Design",
    desc: "A distinctive mark crafted around your story, sharp at every size from a visiting card to a shopfront.",
  },
  {
    icon: VisibilityRounded,
    title: "Eye-Catching Designs",
    desc: "Bold, scroll-stopping visuals that grab attention and make people remember your name.",
  },
  {
    icon: VerifiedUserRounded,
    title: "Professional Brand Identity",
    desc: "Colors, typography and style rules that keep every touchpoint consistent and credible.",
  },
  {
    icon: CampaignRounded,
    title: "Promotional Designs",
    desc: "Posters, flyers and social creatives built to announce offers and bring in enquiries.",
  },
  {
    icon: Inventory2Rounded,
    title: "Merchandise Research",
    desc: "Smart ideas for mugs, bags, diaries and gifts your customers will actually keep and use.",
  },
  {
    icon: CreditCardRounded,
    title: "Door Stickers & Visiting Cards",
    desc: "Print-ready cards and stickers that turn every handshake into a strong first impression.",
  },
  {
    icon: WorkspacePremiumRounded,
    title: "Trademark-Ready Design Concepts",
    desc: "Original, unique concepts designed with registration in mind, so your identity is truly yours.",
  },
];

export interface EndToEndStep {
  icon: SvgIconComponent;
  title: string;
  desc: string;
}

export const END_TO_END: EndToEndStep[] = [
  {
    icon: TravelExploreRounded,
    title: "Discover & Strategy",
    desc: "We learn your business, your audience and your goals, so every design decision has a reason.",
  },
  {
    icon: BrushRounded,
    title: "Logo & Brand Identity",
    desc: "A custom logo, color palette, typography and brand rules, with trademark-ready concepts.",
  },
  {
    icon: CreditCardRounded,
    title: "Cards, Stickers & Stationery",
    desc: "Visiting cards, door stickers and business collateral delivered as print-ready files.",
  },
  {
    icon: ShareRounded,
    title: "Promotions & Social Creatives",
    desc: "Posters, flyers and social media designs that announce your offers with a consistent look.",
  },
  {
    icon: StyleRounded,
    title: "Merchandise",
    desc: "Merchandise research and mockups for mugs, bags, diaries and gifts with your brand on them.",
  },
  {
    icon: GroupsRounded,
    title: "Hiring & Job Placement",
    desc: "Need people for your growing business, or looking for your next job? Our placement desk helps.",
  },
];

export const MARQUEE_ITEMS = [
  "Logo & Brand Design",
  "Custom Logos",
  "Brand Identity",
  "Promotional Designs",
  "Visiting Cards",
  "Door Stickers",
  "Merchandise Ideas",
  "Trademark-Ready Concepts",
];

export const PROCESS = [
  { title: "Discover", desc: "We learn about your business, audience and what makes you different." },
  { title: "Concept", desc: "You receive fresh logo and identity directions tailored to your brand." },
  { title: "Refine", desc: "We polish your favorite direction with your feedback until it feels right." },
  { title: "Deliver", desc: "Final files, ready for print, web, social media and merchandise." },
];

export const STATS = [
  { to: 7, suffix: "", label: "Core creative services" },
  { to: 100, suffix: "%", label: "Custom-made concepts" },
  { to: 360, suffix: "°", label: "Brand support, end to end" },
  { to: 1, suffix: "", label: "Team for design to delivery" },
];

export const PALETTES = [
  { name: "Sunburst", primary: "#FFC81E", ink: "#111111" },
  { name: "Crimson", primary: "#E4202D", ink: "#FFFFFF" },
  { name: "Ocean", primary: "#2F6BFF", ink: "#FFFFFF" },
  { name: "Emerald", primary: "#12B981", ink: "#06281D" },
  { name: "Violet", primary: "#8B5CF6", ink: "#FFFFFF" },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "What do I need to get started?",
    a: "Just tell us about your business, what you do and the style you like. If you already have a logo, colors or reference designs, share them too and we will build on them.",
  },
  {
    q: "Do you provide end-to-end service?",
    a: "Yes. From strategy and logo design to cards, stickers, promotional creatives and merchandise ideas, one team handles every step. Choose the Complete End-to-End Package in the Marketing & Branding form.",
  },
  {
    q: "Which services can I choose?",
    a: "Custom logo design, brand identity, promotional designs, visiting cards and door stickers, merchandise research and trademark-ready design concepts. Pick a single service or a complete package.",
  },
  {
    q: "Will my design be original?",
    a: "Yes. Concepts are created for your business and your story, not copied from ready-made templates.",
  },
  {
    q: "How do job placement and free registration work?",
    a: "Fill in the Job Placement or Free Registration form with your details. Our team saves your profile and contacts you when there is a suitable opportunity or service for you.",
  },
  {
    q: "What happens after I submit a form?",
    a: "You instantly get a reference number. Our team then follows up by WhatsApp, email or phone, whichever you chose. You can also message the manager directly from the success screen.",
  },
  {
    q: "How do I get a quote?",
    a: "Use the Talk to Manager or Marketing & Branding form, call +91 78456 20360 or message us on WhatsApp. We will get back to you with the next steps.",
  },
];
