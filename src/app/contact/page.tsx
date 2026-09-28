import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Start Your Renovation",
  description:
    "Tell us about your home and your plans. Visit the Arden & Stone studio in Belgravia, call us, or send an enquiry — a real person replies within one working day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
