import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About — The Studio Behind 250 Renovated Homes",
  description:
    "Founded in 2007 as a joinery workshop, Arden & Stone is now a 42-strong studio of architects, makers and craftsmen. Meet the team and the values behind our work.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
