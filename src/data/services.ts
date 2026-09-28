import type { ImageKey } from "@/lib/images";

export type Service = {
  slug: string;
  title: string;
  /** Short label for nav, chips and schema. */
  short: string;
  sheet: string;
  lede: string;
  body: string[];
  includes: string[];
  price: string;
  duration: string;
  hero: { key: ImageKey; alt: string };
  gallery: { key: ImageKey; alt: string }[];
  faqs: { q: string; a: string }[];
  projects: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "whole-home-renovation",
    title: "Whole-Home Renovation",
    short: "Whole homes",
    sheet: "A-100",
    lede: "One accountable team carries your house from first sketch to final styling, so the finished home feels as if it had always been this way.",
    body: [
      "We reconfigure layouts, open sightlines and rebuild every surface under one contract. Structural work, mechanical, electrical and plumbing, joinery, finishes and furnishing are sequenced by the same studio, so nothing gets lost between the drawing and the build.",
      "You get a fixed programme, an open-book cost plan and a dedicated site lead who walks the job every day and sends a written report and a short film every Friday.",
    ],
    includes: [
      "Architectural design, 3D walkthroughs and permit drawings",
      "Structural alterations, steel and foundation work",
      "Full MEP: HVAC, electrical, plumbing, smart-home pre-wire",
      "Bespoke joinery from our own Design District workshop",
      "Interior design, procurement and styled handover",
    ],
    price: "From $450k",
    duration: "8 – 14 months",
    hero: { key: "hero/arched-living", alt: "Renovated living room with an arched doorway and a camel sofa" },
    gallery: [
      { key: "living/soft-minimal", alt: "Soft minimal living space with cream seating and warm lighting" },
      { key: "interior/stair-plaster", alt: "Limestone stair rising between smooth plaster walls" },
      { key: "hero/modern-dusk-2", alt: "Modern Preston Hollow home lit at dusk" },
    ],
    faqs: [
      { q: "Can we live in the house during a whole-home renovation?", a: "Usually not for the heavy phases. We plan a 6–9 month move-out window and can recommend furnished rentals nearby. Smaller phased projects can often keep one wing livable." },
      { q: "Who manages the permits?", a: "We do. Our design team prepares permit and engineering drawings and handles the City of Dallas, Highland Park and University Park review processes, including HOA and conservation approvals." },
    ],
    projects: ["preston-hollow-modern", "the-lakeside-georgian"],
  },
  {
    slug: "kitchens",
    title: "Kitchens",
    short: "Kitchens",
    sheet: "A-210",
    lede: "We treat the kitchen as furniture, not fit-out. Cabinetry is drawn by hand, built in our workshop and installed by the people who made it.",
    body: [
      "Every kitchen starts with a movement study: how you shop, prep, cook and host. From there we develop elevations, choose slabs with you at the stone yard, and prototype the critical details before a single panel is cut.",
      "Appliances are engineered in, not squeezed in. Lighting is designed in scenes, and every drawer is set up for what it will actually hold.",
    ],
    includes: [
      "Layout and movement study, elevations and 3D renders",
      "Workshop-built cabinetry in rift oak, walnut or lacquer",
      "Natural stone and quartzite, book-matched and templated in person",
      "Integrated appliance engineering (Sub-Zero, Wolf, Miele, Gaggenau)",
      "Layered lighting with scene control",
    ],
    price: "$120k – $350k",
    duration: "12 – 20 weeks on site",
    hero: { key: "kitchen/warm-white", alt: "White kitchen with a stone island, bronze stools and a cedar ceiling" },
    gallery: [
      { key: "kitchen/walnut-island", alt: "Kitchen with a walnut island, globe pendants and a marble counter" },
      { key: "kitchen/waterfall", alt: "Waterfall-edge quartzite island in a bright kitchen" },
      { key: "kitchen/rattan", alt: "Warm white kitchen with rattan chairs and open oak shelving" },
    ],
    faqs: [
      { q: "How long will we be without a kitchen?", a: "Typically 10–14 weeks. We set up a temporary kitchenette with a sink, fridge and induction plate so daily life keeps going." },
      { q: "Do you work with our own appliances or cabinet maker?", a: "Yes. We are happy to integrate existing appliances or a third-party cabinet line, though most clients choose our own workshop for the fit and warranty." },
    ],
    projects: ["the-linen-kitchen", "the-walnut-kitchen"],
  },
  {
    slug: "bathrooms",
    title: "Primary Baths & Spas",
    short: "Baths",
    sheet: "A-230",
    lede: "Quiet, tactile rooms for the start and end of the day: honed stone, warm timber, brushed metals and light that flatters at 7 am and calms at midnight.",
    body: [
      "Bathrooms reward precision like no other room. Waterproofing, heated floors, concealed cisterns and shadow-gap details are all resolved on the drawing board before we touch the site, so the finished room reads as one continuous gesture.",
      "We build steam showers, wet rooms, soaking-tub alcoves and dressing suites that connect the bath to the bedroom.",
    ],
    includes: [
      "Full tear-out, re-plumb and Schlüter waterproofing systems",
      "Radiant floor heating and towel warmers",
      "Travertine, marble, zellige and microcement finishes",
      "Custom vanities and unlacquered-brass or bronze fittings",
      "Steam showers, curbless wet rooms and dressing suites",
    ],
    price: "$55k – $180k",
    duration: "8 – 12 weeks on site",
    hero: { key: "bath/travertine-suite", alt: "Travertine primary bath with a walnut vanity and walk-in shower" },
    gallery: [
      { key: "bath/sunlit-tub", alt: "Freestanding tub in a sunlit stone bathroom" },
      { key: "bath/classic-gold", alt: "Classic primary bath with a gilded mirror and clawfoot tub" },
      { key: "bath/travertine-bench", alt: "Travertine shower bench with a lit niche" },
    ],
    faqs: [
      { q: "Can you make a bathroom curbless for aging in place?", a: "Yes. We recess the subfloor to create curbless showers, add blocking for future grab bars and specify slip-resistant finishes without making the room look clinical." },
      { q: "What does a primary bath typically cost?", a: "Most of our primary baths land between $75k and $140k, depending on size, stone and whether plumbing moves. The estimator gives you a quick range." },
    ],
    projects: ["the-garden-spa-bath", "the-travertine-suite"],
  },
  {
    slug: "additions-outdoor-living",
    title: "Additions & Outdoor Living",
    short: "Additions",
    sheet: "A-300",
    lede: "New volume and new rooms outside: loggias, pool houses and summer kitchens that never feel added-on.",
    body: [
      "We obsess over the junction between old and new: rooflines, thresholds and materials that let the house breathe as one. Additions are engineered for North Texas soil, with pier-and-beam or post-tensioned foundations as the site demands.",
      "Outdoors, we design for the Dallas summer. Deep shade, ceiling fans, misting, outdoor kitchens and fireplaces for the three good months of winter.",
    ],
    includes: [
      "Room additions, second stories and primary-suite wings",
      "Covered loggias, pergolas and screened porches",
      "Outdoor kitchens with grills, pizza ovens and bar seating",
      "Pool houses, cabanas and outdoor showers",
      "Drainage, foundations and landscape integration",
    ],
    price: "From $180k",
    duration: "5 – 9 months",
    hero: { key: "outdoor/loggia-kitchen", alt: "Covered outdoor kitchen with a concrete bar under a woven pergola" },
    gallery: [
      { key: "outdoor/brick-patio", alt: "Cedar-beamed covered patio on a brick Dallas home" },
      { key: "exterior/pergola-pool", alt: "Pergola lounge beside a lap pool" },
      { key: "outdoor/fire-pavilion", alt: "Outdoor pavilion with a fireplace and Adirondack chairs" },
    ],
    faqs: [
      { q: "Do additions need HOA or city approval?", a: "Almost always. We prepare the drawings, engineering and submittals and attend reviews with you, including the Highland Park and University Park design boards." },
      { q: "Can you match our existing brick and roof?", a: "Yes. We source reclaimed or matching brick, blend mortar colors on site and mock up samples before we lay the first course." },
    ],
    projects: ["the-loggia-house", "preston-hollow-modern"],
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    short: "Interiors",
    sheet: "I-400",
    lede: "Our interiors studio develops the palette alongside the architecture, never after it. Plaster, timber, stone and textile are sampled together in the light of your actual rooms.",
    body: [
      "We produce full furniture, fixture and equipment schedules, commission pieces from our network of Texas makers, and style the final installation down to the last book and stem.",
      "The result is a home that photographs beautifully and lives even better, with pieces chosen to age well rather than date quickly.",
    ],
    includes: [
      "Whole-home material and color palettes",
      "Furniture, lighting and art procurement",
      "Custom upholstery, rugs and window treatments",
      "Commissioned pieces from local makers",
      "Install day and full styling",
    ],
    price: "Design fees from $35k",
    duration: "Runs alongside the build",
    hero: { key: "living/traditional", alt: "Sunlit sitting room with a curved bouclé sofa and a white fireplace" },
    gallery: [
      { key: "material/oak-slats", alt: "Curving white-oak slat wall" },
      { key: "interior/arched-bed", alt: "Bedroom with an arched plaster headboard wall" },
      { key: "living/calm-sofa", alt: "Symmetrical living room with twin sofas and a linear fireplace" },
    ],
    faqs: [
      { q: "Can we hire you for interiors only?", a: "Yes. About a fifth of our interiors work is for homes we did not build, usually new construction that needs warmth and character." },
      { q: "Do you reuse our existing furniture?", a: "Gladly. We catalogue what you love on day one and design around it, then reupholster or refinish pieces where it helps." },
    ],
    projects: ["westover-hills-residence", "preston-hollow-modern"],
  },
  {
    slug: "historic-restoration",
    title: "Historic Restoration",
    short: "Historic",
    sheet: "H-500",
    lede: "1920s Park Cities Georgians, Swiss Avenue Prairie houses and M Streets Tudors deserve a different kind of care.",
    body: [
      "We restore plaster, millwork, leaded glass and original wood windows with traditional methods, then thread modern comfort invisibly through the fabric: new HVAC, wiring and insulation that no one will ever see.",
      "Our team prepares Landmark Commission and conservation-district submittals and works with preservation officers from the first survey onward.",
    ],
    includes: [
      "Historic surveys, measured drawings and conservation plans",
      "Landmark Commission and conservation-district approvals",
      "Wood window, plaster and millwork restoration",
      "Discreet HVAC, electrical and insulation upgrades",
      "Salvage sourcing and period-correct matching",
    ],
    price: "From $250k",
    duration: "Scoped per home",
    hero: { key: "exterior/tudor", alt: "Restored Tudor-style home with half-timbering and a stone chimney" },
    gallery: [
      { key: "exterior/colonial-stone", alt: "Stone Georgian colonial house with black shutters" },
      { key: "living/arched-beams", alt: "Living room with arched steel windows and timber beams" },
      { key: "craft/chisel-close", alt: "Craftsman carving timber with a chisel" },
    ],
    faqs: [
      { q: "Our home is in a conservation district. Can we still add a kitchen addition?", a: "Usually yes, with the right design. We shape additions to read as secondary to the historic house and prepare the drawings the commission expects." },
      { q: "Can original windows really be saved?", a: "In most cases. We restore sashes, replace rot with epoxy or dutchman repairs, and add discreet weather-stripping and storm panels." },
    ],
    projects: ["the-m-streets-tudor", "the-lakeside-georgian"],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
