/* Central content store — copy, imagery and structured data for every page.
   All imagery is served from Unsplash (free to use) as placeholders. */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  heroMain: u("photo-1600585154340-be6161a56a0c", 2400),
  heroAbout: u("photo-1600607687939-ce8a6c25118c", 2400),
  heroServices: u("photo-1618221195710-dd6b41faaea6", 2400),
  heroContact: u("photo-1600210492486-724fe5c67fb0", 2400),
  introEditorial: u("photo-1616486338812-3dadae4b4ace"),
  introDetail: u("photo-1586023492125-27b2c045efd7", 900),
  craft: u("photo-1503387762-592deb58ef4e"),
  atelier: u("photo-1600607687920-4e2a09cf159d"),
  cta: u("photo-1600585152220-90363fe7e115", 2400),
  storyOne: u("photo-1600566753086-00f18fb6b3ea"),
  storyTwo: u("photo-1600121848594-d8644e57abab", 900),
};

/** Hero slideshow — images verified against Unsplash, one per discipline. */
export const HERO_SLIDES = [
  { image: u("photo-1600585154340-be6161a56a0c", 2400), label: "Whole homes" },
  { image: u("photo-1600607687920-4e2a09cf159d", 2400), label: "Light & volume" },
  { image: u("photo-1600121848594-d8644e57abab", 2400), label: "Bespoke joinery" },
  { image: u("photo-1618221195710-dd6b41faaea6", 2400), label: "Calm interiors" },
];

export interface Service {
  slug: string;
  title: string;
  short: string;
  description: string;
  details: string;
  image: string;
  features: string[];
}

export const SERVICES: Service[] = [
  {
    slug: "full-home-renovation",
    title: "Full-Home Renovation",
    short: "Complete transformations, from structure to styling.",
    description:
      "A single, accountable team carries your home from first sketch to final styling. We reconfigure layouts, open sightlines and rebuild every surface so the finished house feels inevitable — as if it had always been this way.",
    details:
      "Structural work, mechanical and electrical systems, joinery, finishes and furnishing are sequenced under one contract and one point of contact. You receive a fixed programme, a transparent cost plan and a dedicated site lead who walks the project daily.",
    image: u("photo-1600585154340-be6161a56a0c"),
    features: [
      "Architectural design & planning applications",
      "Structural alterations & steelwork",
      "Full mechanical, electrical & plumbing",
      "Bespoke joinery throughout",
      "Turn-key styling & handover",
    ],
  },
  {
    slug: "kitchens",
    title: "Kitchens",
    short: "The heart of the home, engineered to the millimetre.",
    description:
      "We treat the kitchen as furniture, not fit-out. Cabinetry is drawn by hand, built in our workshop and installed by the same makers — stone, timber and brass composed around the way you actually cook and gather.",
    details:
      "Every kitchen begins with a movement study: how you shop, prep, cook and host. From there we develop elevations, select slabs in person at the stone yard, and prototype critical details before a single panel is cut.",
    image: u("photo-1556909114-f6e7ad7d3136"),
    features: [
      "Handmade bespoke cabinetry",
      "Natural stone worktops, book-matched",
      "Integrated appliance engineering",
      "Lighting design & scene control",
      "Workshop prototyping of key details",
    ],
  },
  {
    slug: "bathrooms",
    title: "Bathrooms & Spas",
    short: "Quiet, tactile rooms for the start and end of the day.",
    description:
      "Bathrooms reward precision like no other room. We build them as small sanctuaries — honed stone, warm timber, brushed metals and light that flatters at 7am and calms at midnight.",
    details:
      "Tanking, underfloor heating, concealed cisterns and shadow-gap details are resolved on our drawing boards before site work begins, so the finished room reads as one continuous, seamless gesture.",
    image: u("photo-1584622650111-993a426fbf0a"),
    features: [
      "Full waterproofing & underfloor heating",
      "Book-matched stone & microcement",
      "Bespoke vanities & brassware",
      "Steam rooms & wellness suites",
      "Layered, dimmable lighting schemes",
    ],
  },
  {
    slug: "extensions",
    title: "Extensions & Lofts",
    short: "New volume, added light, seamless with the old.",
    description:
      "Rear extensions, side returns and loft conversions that add space without ever feeling added-on. We obsess over the junction between old and new — thresholds, rooflines and materials that let the house breathe as one.",
    details:
      "Our in-house design team manages planning permissions, party-wall agreements and building control, while our site teams keep the existing home protected and livable for as long as possible during the works.",
    image: u("photo-1600047509807-ba8f99d2cdde"),
    features: [
      "Planning & party-wall management",
      "Glazed structural openings",
      "Loft & mansard conversions",
      "Thermal upgrades to existing fabric",
      "Landscape integration",
    ],
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    short: "Materials, light and furniture in one composed voice.",
    description:
      "Our interiors studio develops the palette alongside the architecture — never after it. Plaster, timber, stone and textile are sampled together under the light of your actual rooms.",
    details:
      "We produce full FF&E schedules, commission pieces from our network of makers, and art-direct the final installation down to the last book and stem. The result is a home that photographs beautifully and lives even better.",
    image: u("photo-1522708323590-d24dbb6b0267"),
    features: [
      "Whole-home material palettes",
      "FF&E sourcing & procurement",
      "Commissioned furniture & art",
      "Window treatments & textiles",
      "Final styling & installation",
    ],
  },
  {
    slug: "heritage-restoration",
    title: "Heritage Restoration",
    short: "Listed and period homes, restored with scholarship.",
    description:
      "Georgian, Victorian and Edwardian houses ask for a different kind of care. We restore cornicing, sash windows, panelling and stonework using traditional methods — then thread modern comfort invisibly through the fabric.",
    details:
      "Our conservation-accredited craftsmen work with lime plasters, traditional joinery and salvaged materials. Listed-building consent, heritage statements and conservation officers are handled entirely by our team.",
    image: u("photo-1507089947368-19c1da9775ae"),
    features: [
      "Listed building consent management",
      "Lime plaster & cornice restoration",
      "Sash window rebuilding",
      "Discreet services integration",
      "Salvage sourcing & matching",
    ],
  },
];

export interface Project {
  slug: string;
  title: string;
  location: string;
  category: string;
  year: string;
  image: string;
  description: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "the-lancaster-house",
    title: "The Lancaster House",
    location: "Notting Hill",
    category: "Full-Home Renovation",
    year: "2025",
    image: u("photo-1600585154340-be6161a56a0c"),
    description:
      "A five-storey Victorian townhouse rebuilt around a sculptural oak stair, with a double-height kitchen opening to a courtyard garden.",
  },
  {
    slug: "warehouse-w1",
    title: "Warehouse W1",
    location: "Fitzrovia",
    category: "Apartment",
    year: "2025",
    image: u("photo-1522708323590-d24dbb6b0267"),
    description:
      "Raw concrete meets warm walnut in this converted print-works loft — 240 m² of open living framed by original steel windows.",
  },
  {
    slug: "the-orchard-wing",
    title: "The Orchard Wing",
    location: "Richmond",
    category: "Extension",
    year: "2024",
    image: u("photo-1600047509807-ba8f99d2cdde"),
    description:
      "A glazed garden wing in brick and bronze, dissolving the boundary between an Edwardian villa and its century-old orchard.",
  },
  {
    slug: "marble-arch-penthouse",
    title: "Marble Arch Penthouse",
    location: "Mayfair",
    category: "Interior Design",
    year: "2024",
    image: u("photo-1618221195710-dd6b41faaea6"),
    description:
      "A serene penthouse in travertine and bouclé, with joinery that conceals a cinema, a bar and forty linear metres of wardrobes.",
  },
  {
    slug: "the-clay-kitchen",
    title: "The Clay Kitchen",
    location: "Hampstead",
    category: "Kitchen",
    year: "2024",
    image: u("photo-1556909114-f6e7ad7d3136"),
    description:
      "Hand-thrown clay tiles, reeded oak and a monolithic island cut from a single block of Ceppo di Gré stone.",
  },
  {
    slug: "georgian-revival",
    title: "Georgian Revival",
    location: "Islington",
    category: "Heritage",
    year: "2023",
    image: u("photo-1507089947368-19c1da9775ae"),
    description:
      "A Grade II listed terrace returned to its 1820s proportions — lime plaster, restored shutters and underfloor heating no one will ever see.",
  },
];

export const STATS = [
  { value: 250, suffix: "+", label: "Projects completed" },
  { value: 18, suffix: "", label: "Years of craft" },
  { value: 42, suffix: "", label: "Master craftsmen" },
  { value: 98, suffix: "%", label: "Clients who return" },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Listen",
    description:
      "Every project begins with a long conversation in your home. We map how you live — mornings, evenings, guests, quiet — before we draw a single line.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Concept, materials and cost develop together. You review physical samples, scaled drawings and a transparent budget — no surprises, ever.",
  },
  {
    number: "03",
    title: "Craft",
    description:
      "Our own workshops build the joinery while our site teams prepare the fabric. One project lead, one weekly report, one accountable studio.",
  },
  {
    number: "04",
    title: "Reveal",
    description:
      "We hand over a finished, styled, photographed home — then return at three and twelve months to make sure it is ageing exactly as intended.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "They rebuilt our entire house while we were abroad and the weekly films they sent were better than most documentaries. We returned to a home that exceeded the renders.",
    name: "Eleanor & James Whitfield",
    project: "Full-home renovation, Notting Hill",
  },
  {
    quote:
      "The kitchen is the most beautiful room I have ever owned. Eighteen months later, drawers still close like they did on day one — that tells you everything.",
    name: "Priya Raghavan",
    project: "Kitchen & extension, Hampstead",
  },
  {
    quote:
      "As an architect myself, I am a nightmare client. Arden & Stone were more exacting than I was. Their tolerances embarrassed mine.",
    name: "Marcus Feld",
    project: "Warehouse conversion, Fitzrovia",
  },
  {
    quote:
      "They treated our listed Georgian terrace with genuine scholarship — the conservation officer actually complimented the work. Unheard of.",
    name: "The Ashworth Family",
    project: "Heritage restoration, Islington",
  },
];

export const TEAM = [
  {
    name: "Thomas Arden",
    role: "Founder & Creative Director",
    image: u("photo-1472099645785-5658abf4ff4e", 800),
    bio: "Trained as a cabinetmaker before studying architecture, Thomas founded the studio in 2007 on a single belief: the people who design a home should also build it.",
  },
  {
    name: "Isabelle Stone",
    role: "Co-Founder & Head of Interiors",
    image: u("photo-1580489944761-15a19d654956", 800),
    bio: "Formerly of a Milanese design house, Isabelle leads the interiors studio — materials, light and furniture composed in one voice.",
  },
  {
    name: "Daniel Okafor",
    role: "Director of Construction",
    image: u("photo-1560250097-0b93528c311a", 800),
    bio: "Twenty years running complex central-London sites. Daniel's programmes are famous for finishing on the day they said they would.",
  },
  {
    name: "Sofia Lindqvist",
    role: "Head of Design",
    image: u("photo-1573496359142-b8d87734a5a2", 800),
    bio: "An architect with a conservation specialism, Sofia leads the drawing studio and our planning strategy for listed and period homes.",
  },
];

export const VALUES = [
  {
    title: "One accountable studio",
    description:
      "Design, build and interiors under one roof — one contract, one programme, one team that answers for everything.",
  },
  {
    title: "Craft before speed",
    description:
      "We build fewer projects than we are offered, so every one gets our workshop's full attention. Waiting lists exist for a reason.",
  },
  {
    title: "Honest numbers",
    description:
      "Open-book cost plans from day one. Our clients see every invoice — which is why 98% of our work comes by referral.",
  },
  {
    title: "Built to outlive us",
    description:
      "Materials chosen to age, not just to photograph. We return at three and twelve months, and we still service homes we finished a decade ago.",
  },
];

export const TIMELINE = [
  { year: "2007", event: "Thomas Arden opens a two-man joinery workshop in Bermondsey." },
  { year: "2011", event: "Isabelle Stone joins; the interiors studio is born and the first full-home commission completes." },
  { year: "2015", event: "The studio moves to Belgravia and grows to twenty craftsmen." },
  { year: "2019", event: "Heritage division launches with our first Grade II* listed restoration." },
  { year: "2022", event: "Named among the UK's fifty best design-build studios." },
  { year: "2025", event: "250th project handed over. The waiting list is now nine months — and worth it." },
];

export const FAQS = [
  {
    question: "How far in advance should we contact you?",
    answer:
      "Ideally six to nine months before you hope to start on site. Design and planning take time to do properly, and our build slots book out roughly two seasons ahead.",
  },
  {
    question: "Do you work outside London?",
    answer:
      "Yes — we regularly work across the Home Counties, and take a small number of destination projects further afield each year.",
  },
  {
    question: "What does a typical project cost?",
    answer:
      "Kitchens typically begin around £80k, bathrooms £45k, and whole-home renovations from £350k. Every project receives an open-book cost plan before any commitment.",
  },
  {
    question: "Can you work with our architect?",
    answer:
      "Absolutely. Around a third of our projects are collaborations with external architects and designers — we're happy to build to another studio's vision.",
  },
];
