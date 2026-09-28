import { site } from "./site";

const fmt = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
};

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Open/closed status in the studio's own time zone (Dallas), whatever the visitor's clock says. */
export function studioStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const toMin = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m;
  };

  const today = site.hours[day];
  if (today && minutes >= toMin(today[0]) && minutes < toMin(today[1])) {
    return { open: true, label: `Open now · closes ${fmt(today[1])}` };
  }
  // Find the next opening slot (later today or on a following day).
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    const slot = site.hours[d];
    if (!slot) continue;
    if (i === 0 && minutes >= toMin(slot[0])) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAY[d];
    return { open: false, label: `Closed · opens ${when} ${fmt(slot[0])}` };
  }
  return { open: false, label: "Closed" };
}
