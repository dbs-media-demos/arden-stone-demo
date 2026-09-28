import type { ImageKey } from "@/lib/images";

export const STATS = [
  { value: 250, suffix: "+", label: "Homes renovated" },
  { value: 18, suffix: "", label: "Years in Dallas" },
  { value: 42, suffix: "", label: "Designers & craftspeople" },
  { value: 98, suffix: "%", label: "Work by referral" },
];

export const TRUST = [
  "NARI Member",
  "NKBA Member",
  "EPA Lead-Safe Certified Firm",
  "$2M general liability · fully insured",
  "10-year workmanship warranty",
  "Houzz Best of Service 2025",
];

export type Review = {
  name: string;
  area: string;
  project: string;
  rating: number;
  date: string;
  text: string;
};

export const REVIEWS: Review[] = [
  { name: "Priya R.", area: "University Park", project: "Kitchen", rating: 5, date: "2 weeks ago", text: "Eighteen months after handover the drawers still close like day one. Daniel's site team left the house cleaner every evening than we kept it ourselves. The weekly videos were the best part of my Friday." },
  { name: "Catherine M.", area: "Preston Hollow", project: "Whole-home renovation", rating: 5, date: "1 month ago", text: "Fourteen months, one programme, zero surprises on cost. We had an open-book budget from day one and the final number was within 2% of it. The house is unrecognisable in the best way." },
  { name: "David S.", area: "M Streets", project: "Tudor restoration", rating: 5, date: "2 months ago", text: "They rebuilt 34 leaded-glass panels by hand and put back arches a 1970s remodel had removed. The conservation district used our house as an example. Genuine craftspeople." },
  { name: "Hannah K.", area: "Kessler Park", project: "Primary bath", rating: 5, date: "3 months ago", text: "Our 1930s bathroom was falling apart. Ten weeks later it feels like a spa and the radiant floor is the best thing we've ever bought. Sofia talked us out of two mistakes." },
  { name: "Marcus F.", area: "Lakewood", project: "Kitchen & dining", rating: 5, date: "3 months ago", text: "As an architect I'm a nightmare client. Their tolerances embarrassed mine. The walnut island is joined better than most furniture." },
  { name: "Rosa A.", area: "Southlake", project: "Outdoor kitchen & loggia", rating: 5, date: "4 months ago", text: "We finally use the backyard in July. The misting and fans actually work, and the concrete bar is gorgeous. Crew was polite, on time, and protected our new pool like it was theirs." },
  { name: "Margaret H.", area: "Highland Park", project: "Georgian restoration", rating: 5, date: "5 months ago", text: "The Town's review board complimented the addition at the first hearing. The new kitchen wing looks like it was built in 1928." },
  { name: "James T.", area: "Bluffview", project: "Primary suite", rating: 5, date: "6 months ago", text: "Every travertine slab was laid out in their yard and numbered before it came to the house. The veins line up across the shower bench. Obsessive in the best way." },
  { name: "Ellen W.", area: "Westover Hills", project: "Interiors", rating: 5, date: "6 months ago", text: "Isabelle made an enormous house feel warm. We use every room now. Worth the drive from Dallas many times over." },
  { name: "Brian O.", area: "University Park", project: "Two baths", rating: 4, date: "8 months ago", text: "Excellent work and communication. Tile delivery slipped a week, which they flagged early and made up on the schedule. Would hire again without hesitation." },
  { name: "Nadia L.", area: "Lakewood Heights", project: "Kitchen", rating: 5, date: "9 months ago", text: "Their estimator range was spot on and the final cost came in right in the middle. The kitchenette they set up kept us sane with two toddlers." },
  { name: "Tom & Grace P.", area: "Preston Hollow", project: "Addition", rating: 5, date: "11 months ago", text: "A new primary wing that matches our 1960s brick so well the neighbours asked when we'd painted. Foundation engineering was explained clearly and nothing moved." },
];

export const FAQS: { q: string; a: string }[] = [
  { q: "How far in advance should we contact you?", a: "Ideally four to six months before you hope to start on site. Design and permitting take time to do properly, and our build calendar books roughly two seasons ahead." },
  { q: "What does a typical project cost?", a: "Kitchens usually run $120k–$350k, primary baths $55k–$180k and whole-home renovations from $450k. Every project gets an open-book cost plan before you commit. Try the estimator for a quick range." },
  { q: "Which areas do you serve?", a: "Highland Park, University Park, Preston Hollow, Lakewood and East Dallas, Southlake and Westlake, and Fort Worth's Westover Hills and Rivercrest. We take a few projects elsewhere in DFW each year." },
  { q: "Is the first consultation free?", a: "Yes. The first visit to your home is free and takes about ninety minutes. If you go ahead, the design phase is billed as a fixed fee that is credited against the build." },
  { q: "Do you handle permits and HOA approvals?", a: "Always. We prepare drawings and engineering and manage City of Dallas, Highland Park, University Park and HOA reviews, including Landmark Commission and conservation-district submittals." },
  { q: "Can you work with our architect or designer?", a: "Absolutely. Around a third of our projects are collaborations. We are happy to build to another studio's drawings or bring our interiors team alongside your architect." },
  { q: "Are you licensed and insured?", a: "We carry $2M general liability and full workers' compensation, are an EPA Lead-Safe Certified Firm, and hold City of Dallas and Fort Worth contractor registrations. Certificates are provided before any contract." },
  { q: "What warranty do you offer?", a: "Ten years on our workmanship and joinery, plus manufacturers' warranties on products. We come back at three and twelve months to adjust doors, drawers and anything that has settled." },
  { q: "How do payments work?", a: "A design fee up front, then build payments tied to completed milestones, never ahead of the work. You see every invoice from every trade." },
  { q: "Will we have one point of contact?", a: "Yes: a project lead from first drawing to handover, plus a site lead on the job every working day. You get a written report and a short site film every Friday." },
];

export type Member = { name: string; role: string; bio: string; image: { key: ImageKey; alt: string } };

export const TEAM: Member[] = [
  { name: "Thomas Arden", role: "Founder & Creative Director", bio: "Trained as a cabinetmaker before studying architecture at UT Austin. Thomas founded the studio in 2007 on one belief: the people who design a home should also build it.", image: { key: "team/thomas", alt: "Portrait of Thomas Arden" } },
  { name: "Isabelle Stone", role: "Co-Founder & Head of Interiors", bio: "Formerly with a Milan design house, Isabelle leads the interiors studio: materials, light and furniture composed in one voice.", image: { key: "team/isabelle", alt: "Portrait of Isabelle Stone" } },
  { name: "Daniel Okafor", role: "Director of Construction", bio: "Twenty years running complex residential sites across DFW. Daniel's programmes are known for finishing on the day they said they would.", image: { key: "team/daniel", alt: "Portrait of Daniel Okafor" } },
  { name: "Sofia Lindqvist", role: "Head of Design & Historic", bio: "An architect with a preservation specialism, Sofia leads the drawing studio and our Landmark Commission and conservation-district work.", image: { key: "team/sofia", alt: "Portrait of Sofia Lindqvist" } },
];

export const VALUES = [
  { title: "One accountable studio", text: "Design, build and interiors under one roof: one contract, one programme, one team that answers for everything." },
  { title: "Craft before speed", text: "We take on fewer projects than we are offered, so every one gets our workshop's full attention." },
  { title: "Honest numbers", text: "Open-book cost plans from day one. Clients see every invoice, which is why 98% of our work comes by referral." },
  { title: "Built to outlive us", text: "Materials chosen to age, not just to photograph. We still service homes we finished a decade ago." },
];

export const HISTORY = [
  { year: "2007", text: "Thomas Arden opens a two-person joinery workshop in a Deep Ellum warehouse." },
  { year: "2011", text: "Isabelle Stone joins; the interiors studio is born and the first whole-home commission completes in Lakewood." },
  { year: "2015", text: "The studio moves to the Design District and grows to twenty craftspeople." },
  { year: "2019", text: "The historic division restores its first Swiss Avenue landmark." },
  { year: "2023", text: "A second workshop bay opens for stone templating and dry-laying slabs." },
  { year: "2025", text: "250th home handed over. The build calendar is booked two seasons ahead." },
];

export type Stage = {
  n: string;
  title: string;
  weeks: string;
  text: string;
  points: string[];
  image: { key: ImageKey; alt: string };
};

export const STAGES: Stage[] = [
  {
    n: "01",
    title: "Consultation",
    weeks: "Week 0 – 2",
    text: "A long conversation in your home. We map how you live, measure every room and talk honestly about budget before anyone draws a line.",
    points: ["90-minute home visit, free", "Measured survey and photo record", "Budget range and feasibility note"],
    image: { key: "process/drafting", alt: "Architect drafting a plan with a scale rule" },
  },
  {
    n: "02",
    title: "Design & 3D",
    weeks: "Week 2 – 10",
    text: "Concept, materials and cost develop together. You walk through the rooms in 3D and hold the real samples in your hands.",
    points: ["Plans, elevations and 3D walkthroughs", "Material boards with physical samples", "Open-book cost plan"],
    image: { key: "process/sketch-warm-white", alt: "Pencil line drawing of the future kitchen" },
  },
  {
    n: "03",
    title: "Permits & pricing",
    weeks: "Week 10 – 16",
    text: "Engineering, permit drawings and HOA or Landmark submittals, while our trades price every line of the drawings.",
    points: ["Structural and MEP engineering", "City, HOA and conservation approvals", "Fixed programme and final price"],
    image: { key: "process/blueprint", alt: "Historic blueprint drawing of a building" },
  },
  {
    n: "04",
    title: "Build",
    weeks: "Week 16 – 40",
    text: "Our workshop builds the joinery while the site team prepares the house. One site lead, a written report and a site film every Friday.",
    points: ["Daily site lead, weekly report and film", "Workshop-built cabinetry and millwork", "Protected, clean site every evening"],
    image: { key: "process/framing-interior", alt: "House interior during framing with exposed timber studs" },
  },
  {
    n: "05",
    title: "Handover",
    weeks: "Week 40 +",
    text: "We hand over a finished, styled, photographed home, then come back at three and twelve months to make sure it is ageing as intended.",
    points: ["Snag-free handover and styling", "Home manual and warranty pack", "3- and 12-month care visits"],
    image: { key: "kitchen/warm-white", alt: "The finished kitchen with a stone island and cedar ceiling" },
  },
];

export const MATERIALS: { key: ImageKey; name: string }[] = [
  { key: "material/oak", name: "Rift white oak" },
  { key: "material/marble", name: "Calacatta marble" },
  { key: "material/limestone", name: "Leuders limestone" },
  { key: "material/brass-switch", name: "Knurled brass" },
  { key: "material/walnut-slats", name: "Walnut slats" },
  { key: "material/terrazzo", name: "Stone terrazzo" },
  { key: "material/oak-slats", name: "Fluted oak" },
  { key: "material/candle-stone", name: "Travertine" },
];
