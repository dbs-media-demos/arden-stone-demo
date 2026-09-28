import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Arden & Stone — Home Renovation Studio | Design, Build & Interiors",
  description:
    "A full-service home renovation studio in London. Kitchens, bathrooms, extensions and whole-home transformations — designed, built and styled by one accountable team.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeClient />;
}
