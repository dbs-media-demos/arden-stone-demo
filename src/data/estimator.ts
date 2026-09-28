/** Cost model behind /estimate. Rates are Dallas 2026 design-build numbers for a fictional studio. */

export type RoomType = {
  id: string;
  label: string;
  /** $ per sq ft at the "Considered" finish level. */
  rate: number;
  min: number;
  max: number;
  step: number;
  default: number;
  /** Base on-site weeks, plus weeks per 100 sq ft. */
  weeks: [number, number];
  note: string;
};

export const ROOMS: RoomType[] = [
  { id: "kitchen", label: "Kitchen", rate: 560, min: 120, max: 600, step: 10, default: 260, weeks: [9, 1.6], note: "Cabinetry, stone, appliances, lighting, flooring and finishes." },
  { id: "primary-bath", label: "Primary bath", rate: 520, min: 60, max: 300, step: 5, default: 140, weeks: [6, 2.2], note: "Full tear-out, waterproofing, heated floors, stone and fittings." },
  { id: "bath", label: "Secondary bath", rate: 430, min: 35, max: 140, step: 5, default: 70, weeks: [5, 2.5], note: "Guest, kids' or powder bath, fully rebuilt." },
  { id: "whole-home", label: "Whole home", rate: 165, min: 1500, max: 12000, step: 100, default: 4200, weeks: [20, 0.45], note: "Layout changes, MEP, joinery, finishes and interiors." },
  { id: "addition", label: "Addition", rate: 480, min: 200, max: 2500, step: 25, default: 600, weeks: [14, 1.4], note: "Foundation, structure, envelope and finished interior." },
  { id: "outdoor", label: "Outdoor living", rate: 240, min: 200, max: 2500, step: 25, default: 700, weeks: [8, 0.9], note: "Loggia or pergola, outdoor kitchen, paving and lighting." },
];

export const FINISHES = [
  { id: "considered", label: "Considered", factor: 1, text: "Quality stock materials, custom where it counts." },
  { id: "refined", label: "Refined", factor: 1.38, text: "Natural stone, workshop joinery, premium appliances." },
  { id: "bespoke", label: "Bespoke", factor: 1.85, text: "Book-matched slabs, commissioned pieces, no compromises." },
] as const;

export const EXTRAS = [
  { id: "structural", label: "Moving walls or structure", factor: 0.12 },
  { id: "historic", label: "Historic or conservation-district home", factor: 0.15 },
  { id: "plumbing", label: "Relocating plumbing or gas", factor: 0.08 },
] as const;

export function estimate(roomId: string, size: number, finishId: string, extras: string[]) {
  const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];
  const finish = FINISHES.find((f) => f.id === finishId) ?? FINISHES[0];
  const extra = EXTRAS.filter((e) => extras.includes(e.id)).reduce((sum, e) => sum + e.factor, 0);
  const mid = room.rate * size * finish.factor * (1 + extra);
  const round = (n: number) => Math.round(n / 5000) * 5000;
  const weeks = Math.round(room.weeks[0] + (size / 100) * room.weeks[1] * (1 + extra * 0.6));
  return { low: round(mid * 0.88), high: round(mid * 1.16), weeks: [weeks, Math.round(weeks * 1.25)] as const };
}
