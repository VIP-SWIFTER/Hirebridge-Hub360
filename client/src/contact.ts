// Business contact details and helpers that build WhatsApp / email / call links.
export const BRAND = {
  name: "Hirebridge Hub360°",
  tagline: "Bridging Hires, Building Brands",
  email: "hirebridgehub360@gmail.com",
  phone: "7845620360",
  phoneDisplay: "+91 78456 20360",
  whatsapp: "917845620360",
} as const;

/** Turns "78456 20360" / "+91 78456 20360" into a wa.me number (adds India's 91 for 10-digit numbers). */
export function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

/** WhatsApp link. With no number it opens a chat with the business. */
export function waLink(text: string, number: string = BRAND.whatsapp): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function mailtoLink(subject: string, body: string, to: string = BRAND.email): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const telLink = (phone: string = BRAND.phone): string => `tel:+${waNumber(phone)}`;
