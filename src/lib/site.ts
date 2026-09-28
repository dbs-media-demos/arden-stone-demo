/** Arden & Stone: a fictional Dallas design-build studio (a DBS Media concept site). */

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://arden-stone-demo.vercel.app").replace(/\/$/, "");

/** Demo sites are noindexed unless NEXT_PUBLIC_NOINDEX is explicitly "false". */
export const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";

export const site = {
  name: "Arden & Stone",
  legalName: "Arden & Stone Design-Build, LLC",
  tagline: "Design-build renovation studio",
  description:
    "Arden & Stone is a Dallas design-build renovation studio. Whole-home renovations, kitchens, primary baths, additions and historic restorations across Highland Park, University Park, Preston Hollow and the wider DFW area, designed and built by one team.",
  founded: 2007,
  phone: "(214) 555-0162",
  phoneHref: "tel:+12145550162",
  email: "studio@ardenandstone.com",
  address: {
    street: "2217 Tinsmith Row",
    locality: "Dallas",
    region: "TX",
    postalCode: "75207",
    country: "US",
    district: "Dallas Design District",
  },
  geo: { lat: 32.7968, lng: -96.8237 },
  timeZone: "America/Chicago",
  /** 24h local opening hours; index 0 = Sunday. */
  hours: [null, ["08:00", "18:00"], ["08:00", "18:00"], ["08:00", "18:00"], ["08:00", "18:00"], ["08:00", "18:00"], ["09:00", "13:00"]] as (
    | [string, string]
    | null
  )[],
  hoursLabel: [
    { days: "Monday – Friday", time: "8:00 am – 6:00 pm" },
    { days: "Saturday", time: "9:00 am – 1:00 pm · site visits" },
    { days: "Sunday", time: "Closed" },
  ],
  rating: { value: 4.9, count: 127 },
  priceRange: "$$$$",
  social: {
    instagram: "https://instagram.com/",
    pinterest: "https://pinterest.com/",
    houzz: "https://houzz.com/",
  },
  dbs: "https://dbs-media.com",
} as const;

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/estimate", label: "Estimate" },
  { href: "/about", label: "Studio" },
  { href: "/contact", label: "Contact" },
] as const;
