import type { ImageKey } from "@/lib/images";

export const CATEGORIES = [
  { id: "whole-home", label: "Whole homes" },
  { id: "kitchen", label: "Kitchens" },
  { id: "bath", label: "Baths" },
  { id: "outdoor", label: "Outdoor" },
  { id: "historic", label: "Historic" },
  { id: "interiors", label: "Interiors" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

type Img = { key: ImageKey; alt: string };

export type Project = {
  slug: string;
  title: string;
  area: string;
  areaSlug: string;
  categories: CategoryId[];
  year: number;
  duration: string;
  size: string;
  budget: string;
  summary: string;
  brief: string;
  approach: string;
  result: string;
  hero: Img;
  gallery: Img[];
  beforeAfter?: { before: Img; after: Img; caption: string };
  materials: string[];
  quote?: { text: string; name: string };
};

export const PROJECTS: Project[] = [
  {
    slug: "preston-hollow-modern",
    title: "Preston Hollow Modern",
    area: "Preston Hollow",
    areaSlug: "preston-hollow",
    categories: ["whole-home", "interiors"],
    year: 2025,
    duration: "14 months",
    size: "8,400 sq ft",
    budget: "$2.4M",
    summary: "A 1990s traditional stripped to its frame and rebuilt as a warm, light-filled modern house around a live oak.",
    brief: "The owners loved their one-acre, oak-shaded lot and hated the house: dark rooms, a maze of hallways and a kitchen that faced away from the garden.",
    approach: "We kept the foundation and 60% of the frame, then opened the back of the house with a 42-foot run of steel-framed glass. A rift-oak ceiling runs from the entry through the kitchen and out over the loggia, pulling your eye to the tree.",
    result: "Four fewer walls, twice the daylight and a house that finally faces its garden. Completed on the day the programme said it would be.",
    hero: { key: "hero/modern-dusk-2", alt: "Preston Hollow modern home with floor-to-ceiling glass lit at dusk" },
    gallery: [
      { key: "hero/arched-living", alt: "Living room with an arched doorway and a camel sofa" },
      { key: "living/soft-minimal", alt: "Minimal lounge with cream seating and a sculptural chair" },
      { key: "interior/arched-bed", alt: "Primary bedroom with an arched plaster wall" },
      { key: "bath/travertine-suite", alt: "Travertine primary bath with a walnut vanity" },
      { key: "living/calm-sofa", alt: "Formal living room with twin sofas and a linear fireplace" },
      { key: "material/oak-slats", alt: "Curved white-oak slat wall" },
    ],
    materials: ["Rift white oak", "Venetian plaster", "Travertine", "Blackened steel", "Bronze"],
    quote: { text: "They moved one wall and the whole house exhaled. We sit in the kitchen now just to look at the tree.", name: "Catherine & Luis M." },
  },
  {
    slug: "the-lakeside-georgian",
    title: "The Lakeside Georgian",
    area: "Highland Park",
    areaSlug: "park-cities",
    categories: ["historic", "whole-home"],
    year: 2025,
    duration: "11 months",
    size: "6,200 sq ft",
    budget: "$1.9M",
    summary: "A 1928 Georgian returned to its original proportions, with a new kitchen wing and modern systems no one will ever see.",
    brief: "Decades of well-meant updates had buried the house: dropped ceilings, vinyl windows and a 1980s kitchen addition that blocked the garden.",
    approach: "We rebuilt the original sash windows from a single surviving sample, restored the plaster cornices and replaced the addition with a brick kitchen wing that reads as if it had always been there. The Town of Highland Park approved it at the first review.",
    result: "Original character, 21st-century comfort: zoned HVAC, radiant floors in the baths and a kitchen that opens to the lawn.",
    hero: { key: "exterior/colonial-white", alt: "White Georgian home with dormers and a slate roof in Highland Park" },
    gallery: [
      { key: "living/traditional", alt: "Sunlit sitting room with a curved sofa and white fireplace" },
      { key: "interior/dining-chandelier", alt: "Formal dining room with a crystal chandelier" },
      { key: "bath/classic-gold", alt: "Classic bath with a gilded mirror and clawfoot tub" },
      { key: "kitchen/walnut-island", alt: "Kitchen with a walnut island and globe pendants" },
      { key: "interior/stair-plaster", alt: "Plastered stair hall with limestone treads" },
      { key: "material/brass-handle", alt: "Unlacquered brass lever handle on a painted door" },
    ],
    materials: ["Reclaimed brick", "Lime plaster", "Unlacquered brass", "Carrara marble", "Heart pine"],
    quote: { text: "The review board complimented the addition. I didn't know that was possible.", name: "Margaret H." },
  },
  {
    slug: "the-linen-kitchen",
    title: "The Linen Kitchen",
    area: "University Park",
    areaSlug: "park-cities",
    categories: ["kitchen"],
    year: 2024,
    duration: "16 weeks",
    size: "420 sq ft",
    budget: "$210k",
    summary: "A dark 1984 oak galley reworked into a calm, linen-white kitchen with marble, brass and a proper pantry.",
    brief: "Honey-oak cabinets, a checkerboard floor and a refrigerator that blocked the only window. The family of five cooked in shifts.",
    approach: "We moved the refrigerator into a new full-height wall of joinery, widened the galley by borrowing 30 inches from a hall closet and ran Calacatta up the backsplash to the ceiling.",
    result: "Two cooks, three kids doing homework at the counter and nobody in anybody's way.",
    hero: { key: "kitchen/linen-after", alt: "White shaker galley kitchen with marble counters and black hardware" },
    gallery: [
      { key: "kitchen/white-gold", alt: "White kitchen with brass trim and marble floor" },
      { key: "kitchen/white-gold-2", alt: "Kitchen island with a brass sink and pendant lights" },
      { key: "material/marble", alt: "Close-up of white Calacatta marble" },
      { key: "kitchen/waterfall", alt: "Waterfall-edge island in natural light" },
    ],
    beforeAfter: {
      before: { key: "kitchen/linen-before", alt: "Before: dated 1980s oak galley kitchen with a checkerboard floor" },
      after: { key: "kitchen/linen-after", alt: "After: bright white galley kitchen with marble counters" },
      caption: "Same footprint, plus 30 inches. The refrigerator moved; the window came back.",
    },
    materials: ["Painted maple", "Calacatta marble", "Matte black steel", "White oak"],
    quote: { text: "Eighteen months later the drawers still close like they did on day one. That tells you everything.", name: "Priya R." },
  },
  {
    slug: "the-walnut-kitchen",
    title: "The Walnut Kitchen",
    area: "Lakewood",
    areaSlug: "lakewood",
    categories: ["kitchen", "interiors"],
    year: 2024,
    duration: "14 weeks",
    size: "360 sq ft",
    budget: "$165k",
    summary: "A walnut island, globe pendants and a 12-foot range wall for a family who cooks every single night.",
    brief: "The 1950s ranch had a tiny kitchen and a formal dining room nobody used.",
    approach: "We removed the wall between them, installed a flush beam and built a walnut island that seats six. A pantry and coffee station hide behind pocket doors.",
    result: "The house now has one big room where everything happens, and a pantry that fits a Costco run.",
    hero: { key: "kitchen/walnut-island", alt: "Kitchen with a walnut island, globe pendants and blue cabinetry" },
    gallery: [
      { key: "kitchen/rattan", alt: "Warm white kitchen with rattan chairs" },
      { key: "kitchen/marble-island", alt: "Marble island under a vaulted ceiling" },
      { key: "kitchen/vaulted", alt: "Vaulted kitchen with a waterfall island and pendant lights" },
      { key: "material/oak", alt: "Light oak plank texture" },
    ],
    materials: ["Black walnut", "Honed quartzite", "Zellige tile", "Aged brass"],
  },
  {
    slug: "the-garden-spa-bath",
    title: "The Garden Spa Bath",
    area: "Kessler Park",
    areaSlug: "lakewood",
    categories: ["bath"],
    year: 2024,
    duration: "10 weeks",
    size: "210 sq ft",
    budget: "$96k",
    summary: "A tired 1930s bathroom rebuilt as a quiet spa with a soaking tub under the original window.",
    brief: "Cracked tile, a leaking tub and radiators that clanked all winter.",
    approach: "We kept the window and the room's proportions, re-plumbed everything, added radiant heat under large-format stone and centered a freestanding tub on the view.",
    result: "A bathroom that feels twice its size. The clanking is gone.",
    hero: { key: "bath/spa-after", alt: "Spa bathroom with a freestanding tub centered under a window" },
    gallery: [
      { key: "bath/sunlit-tub", alt: "Sunlit freestanding tub against stone walls" },
      { key: "bath/stone-tub", alt: "Stone tub beside a textured plaster wall" },
      { key: "bath/marble-vanity", alt: "Marble vanity with a brass arched mirror" },
      { key: "bath/wood-tub", alt: "Bathroom with a freestanding tub and warm wood wall" },
    ],
    beforeAfter: {
      before: { key: "bath/spa-before", alt: "Before: dated tiled bathroom with an old tub and radiator" },
      after: { key: "bath/spa-after", alt: "After: bright spa bath with a freestanding tub under the window" },
      caption: "Same window, same walls. Everything else is new.",
    },
    materials: ["Honed limestone", "Microcement", "Brushed nickel", "Teak"],
    quote: { text: "It feels like a hotel we never have to check out of.", name: "Hannah & Jordan K." },
  },
  {
    slug: "the-travertine-suite",
    title: "The Travertine Suite",
    area: "Bluffview",
    areaSlug: "preston-hollow",
    categories: ["bath", "interiors"],
    year: 2025,
    duration: "12 weeks",
    size: "340 sq ft",
    budget: "$148k",
    summary: "A primary suite wrapped floor to ceiling in vein-cut travertine, with a steam shower and a lit bench.",
    brief: "The owners wanted a bathroom that felt like one piece of stone.",
    approach: "Every slab was dry-laid in our yard and numbered before install, so the veins run continuously across walls, bench and floor. Lighting hides in shadow gaps.",
    result: "One continuous room of stone, warm underfoot and silent.",
    hero: { key: "bath/travertine-suite", alt: "Travertine bathroom with a walnut double vanity" },
    gallery: [
      { key: "bath/travertine-bench", alt: "Travertine shower bench with a lit niche" },
      { key: "bath/travertine-shower", alt: "Walk-in travertine shower with black fixtures" },
      { key: "bath/travertine-wall", alt: "Vein-cut travertine wall with hand shower" },
      { key: "bath/travertine-niche", alt: "Travertine shower with rainhead and controls" },
      { key: "material/candle-stone", alt: "Candle and stone dish on a travertine ledge" },
    ],
    materials: ["Vein-cut travertine", "Walnut", "Matte black brass", "Linen"],
  },
  {
    slug: "the-loggia-house",
    title: "The Loggia House",
    area: "Southlake",
    areaSlug: "southlake",
    categories: ["outdoor"],
    year: 2024,
    duration: "7 months",
    size: "1,600 sq ft outdoors",
    budget: "$640k",
    summary: "A covered outdoor kitchen, bar and pool terrace that keeps a Southlake family outside from March to November.",
    brief: "A big lot, a new pool and nowhere to shelter from the 4 pm sun.",
    approach: "We built a woven-reed pergola over a concrete bar and kitchen, with misting, fans and heaters, then ran limestone paving from the family room to the water.",
    result: "The family room doors now stay open half the year.",
    hero: { key: "outdoor/loggia-kitchen", alt: "Covered outdoor kitchen with a concrete bar under a woven pergola" },
    gallery: [
      { key: "outdoor/loggia-bar", alt: "Outdoor bar with woven stools and a mounted TV" },
      { key: "outdoor/loggia-view", alt: "Outdoor cooktop looking out to the pool" },
      { key: "exterior/pergola-pool", alt: "Vine-covered pergola lounge beside a lap pool" },
      { key: "outdoor/fire-pavilion", alt: "Pavilion with a fireplace and Adirondack chairs" },
      { key: "outdoor/pool-lawn", alt: "Pool terrace and lawn beside a modern house" },
    ],
    materials: ["Board-formed concrete", "Leuders limestone", "Woven reed", "Cedar"],
    quote: { text: "We've eaten dinner outside more this year than the previous ten combined.", name: "The Alvarez family" },
  },
  {
    slug: "the-m-streets-tudor",
    title: "The M Streets Tudor",
    area: "M Streets",
    areaSlug: "lakewood",
    categories: ["historic", "interiors"],
    year: 2023,
    duration: "9 months",
    size: "3,100 sq ft",
    budget: "$780k",
    summary: "A 1929 Tudor in Greenland Hills restored inside and out, from the half-timbering to the leaded glass.",
    brief: "Rot in the timbering, knob-and-tube wiring and a 1970s remodel that had removed every arch.",
    approach: "We rebuilt the half-timbering in cypress, restored 34 leaded-glass panels and put the arches back using measured drawings from a neighbour's identical floor plan.",
    result: "The conservation district held it up as a model restoration.",
    hero: { key: "exterior/tudor", alt: "Tudor-style home with half-timbering and a stone chimney" },
    gallery: [
      { key: "living/arched-beams", alt: "Living room with arched windows and timber beams" },
      { key: "interior/dining-flowers", alt: "Dining room with flowers and upholstered chairs" },
      { key: "interior/reading-nook", alt: "Reading corner with an oak chair by a window" },
      { key: "living/terracotta", alt: "Snug room with terracotta walls and a glowing lamp" },
      { key: "craft/chisel-close", alt: "Chisel shaping a timber detail" },
    ],
    materials: ["Cypress", "Leaded glass", "Lime plaster", "Terracotta"],
    quote: { text: "They treated our house like an old friend, not a project.", name: "David & Ellen S." },
  },
  {
    slug: "westover-hills-residence",
    title: "Westover Hills Residence",
    area: "Westover Hills, Fort Worth",
    areaSlug: "fort-worth",
    categories: ["interiors", "whole-home"],
    year: 2024,
    duration: "10 months",
    size: "11,000 sq ft",
    budget: "Undisclosed",
    summary: "A full interior reworking of a Fort Worth estate: quieter colors, warmer light and furniture made for the rooms.",
    brief: "Grand rooms that felt cold and a family that only used the kitchen.",
    approach: "We lowered the lighting, layered plaster and wool, commissioned furniture from Texas makers and turned the formal living room into a library.",
    result: "Every room now has a reason to be used.",
    hero: { key: "hero/grand-dusk", alt: "Estate home lit at dusk with manicured lawn" },
    gallery: [
      { key: "living/white-coffered", alt: "White living room with a coffered ceiling and built-in shelving" },
      { key: "living/panelled", alt: "Panelled salon with a brass chandelier" },
      { key: "interior/warm-bed", alt: "Warm-toned bedroom with soft lighting" },
      { key: "living/dusk-lounge", alt: "Double-height lounge at dusk with city views" },
      { key: "interior/wardrobe", alt: "Walk-in wardrobe with oak shelving" },
    ],
    materials: ["Wool bouclé", "Venetian plaster", "Smoked oak", "Aged brass"],
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
