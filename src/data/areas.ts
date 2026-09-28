import type { ImageKey } from "@/lib/images";

export type Area = {
  slug: string;
  name: string;
  short: string;
  lede: string;
  body: string[];
  neighborhoods: string[];
  zips: string[];
  homes: string;
  hero: { key: ImageKey; alt: string };
  /** Position on the stylised DFW map (0–100). */
  map: { x: number; y: number };
  drive: string;
};

export const AREAS: Area[] = [
  {
    slug: "park-cities",
    name: "Highland Park & University Park",
    short: "Park Cities",
    lede: "Renovations and restorations in the Park Cities, where the review boards are strict and the houses are worth it.",
    body: [
      "The Park Cities hold some of the finest 1920s and 1930s houses in Texas: Georgians, Tudors, Spanish Eclectic and Colonial Revivals set on tree-lined streets. They also have some of the most demanding permitting in the state.",
      "We have worked with the Town of Highland Park and the City of University Park for over fifteen years. We know what the design review boards look for, which inspectors want to see what, and how to phase a job around school runs and neighbours.",
    ],
    neighborhoods: ["Highland Park", "University Park", "Volk Estates", "Old Highland Park", "Caruth Hills"],
    zips: ["75205", "75225"],
    homes: "1920s Georgians, Tudors and Spanish Eclectic homes; new traditional builds",
    hero: { key: "exterior/colonial-stone", alt: "Stone Georgian house with black shutters and a front garden" },
    map: { x: 58, y: 44 },
    drive: "12 minutes from the studio",
  },
  {
    slug: "preston-hollow",
    name: "Preston Hollow",
    short: "Preston Hollow",
    lede: "Large-lot renovations, modern rebuilds and outdoor living in Preston Hollow and Bluffview.",
    body: [
      "Preston Hollow's acre lots and mature trees reward houses that open to the garden. Many of our projects here reorganize 1980s and 1990s homes around the views they were built to ignore.",
      "We handle tree-protection plans, drainage on the creek lots and the logistics of working on long private drives.",
    ],
    neighborhoods: ["Preston Hollow", "Bluffview", "Old Preston Hollow", "Northaven Park"],
    zips: ["75220", "75229", "75230"],
    homes: "Acre-lot traditionals, 1990s estates and new modern builds",
    hero: { key: "hero/dusk-pool", alt: "Modern home with a pool terrace lit at dusk" },
    map: { x: 55, y: 34 },
    drive: "15 minutes from the studio",
  },
  {
    slug: "lakewood",
    name: "Lakewood & East Dallas",
    short: "Lakewood",
    lede: "Kitchens, baths and restorations across Lakewood, the M Streets, Swiss Avenue and Kessler Park.",
    body: [
      "East Dallas is full of characterful 1920s–1950s houses: Tudors in the M Streets, Prairie houses on Swiss Avenue, mid-century ranches around White Rock Lake. Most need new systems without losing their soul.",
      "Many sit in conservation districts. We prepare Landmark Commission submittals and restore original windows, millwork and plaster instead of replacing them.",
    ],
    neighborhoods: ["Lakewood", "M Streets", "Swiss Avenue", "Kessler Park", "Lakewood Heights", "Forest Hills"],
    zips: ["75214", "75206", "75208", "75218"],
    homes: "1920s–1950s Tudors, Prairie houses and ranches",
    hero: { key: "area/lake", alt: "Calm lake surrounded by trees in East Dallas" },
    map: { x: 66, y: 48 },
    drive: "14 minutes from the studio",
  },
  {
    slug: "southlake",
    name: "Southlake & Westlake",
    short: "Southlake",
    lede: "Outdoor living, additions and whole-home updates in Southlake, Westlake and Colleyville.",
    body: [
      "Southlake's larger lots and newer homes are perfect for loggias, pool houses and summer kitchens. We design outdoor rooms for real Texas summers: deep shade, air movement and materials that can take the heat.",
      "Inside, we update 2000s-era homes with better light, calmer finishes and kitchens that work for big families.",
    ],
    neighborhoods: ["Southlake", "Westlake", "Colleyville", "Trophy Club", "Keller"],
    zips: ["76092", "76262", "76034"],
    homes: "2000s estates, custom builds and acre-lot family homes",
    hero: { key: "exterior/modern-pool", alt: "Modern house with a pool terrace and lounge chairs" },
    map: { x: 32, y: 26 },
    drive: "30 minutes from the studio",
  },
  {
    slug: "fort-worth",
    name: "Fort Worth",
    short: "Fort Worth",
    lede: "Interiors, kitchens and restorations in Westover Hills, Rivercrest and Tanglewood.",
    body: [
      "Fort Worth's established neighbourhoods have grand houses with good bones and dated interiors. We run Fort Worth projects from the Dallas studio with a dedicated site lead living in Tarrant County.",
      "Our interiors team frequently works here alongside local architects and builders.",
    ],
    neighborhoods: ["Westover Hills", "Rivercrest", "Tanglewood", "Monticello", "Mistletoe Heights"],
    zips: ["76107", "76109", "76110"],
    homes: "Estate homes, 1930s Tudors and mid-century ranches",
    hero: { key: "area/fort-worth", alt: "Fort Worth skyline on a clear day" },
    map: { x: 16, y: 56 },
    drive: "40 minutes from the studio",
  },
];

export const areaBySlug = (slug: string) => AREAS.find((a) => a.slug === slug);
