import { site } from "./site";
import { type Biz, type DayHours } from "./biz-core";

export type { Biz } from "./biz-core";

/** The fictional studio as a Biz: what the concept site shows (previews swap in a real one). */
export const defaultBiz: Biz = {
  lang: "en",
  name: site.legalName,
  shortName: site.name,
  tagline: null,
  area: site.address.locality,
  phone: site.phoneHref.replace(/^tel:/, ""),
  phoneDisplay: site.phone,
  address: {
    street: site.address.street,
    city: site.address.locality,
    region: site.address.region,
    postal: site.address.postalCode,
    full: `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`,
  },
  timezone: site.timeZone,
  hours: site.hours.map((h, day): DayHours => ({ day, open: h?.[0] ?? null, close: h?.[1] ?? null })),
  hoursSummary: "Mon – Fri 8 am – 6 pm · Sat 9 am – 1 pm",
  rating: { ...site.rating },
  preview: false,
};
