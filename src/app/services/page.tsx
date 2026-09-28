import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services — Kitchens, Bathrooms, Extensions & Full-Home Renovation",
  description:
    "Six disciplines, one standard: full-home renovation, bespoke kitchens, bathrooms & spas, extensions & lofts, interior design and heritage restoration — all under one roof.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
