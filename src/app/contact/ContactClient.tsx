"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import { CONTACT } from "@/lib/site";
import { IMAGES, SERVICES } from "@/data/content";

const inputClasses =
  "w-full border-b border-border bg-transparent py-4 font-body text-base text-ink placeholder:text-muted-foreground/60 transition-colors duration-300 focus:border-bronze focus:outline-none";

const INFO = [
  { icon: MapPin, label: "Studio", lines: [CONTACT.street, `${CONTACT.locality}, ${CONTACT.postalCode}`] },
  { icon: Phone, label: "Phone", lines: [CONTACT.phone], href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
  { icon: Mail, label: "Email", lines: [CONTACT.email], href: `mailto:${CONTACT.email}` },
  { icon: Clock, label: "Hours", lines: [CONTACT.hours, "Site visits by appointment"] },
];

const ContactClient = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Demo site: simulate a short round-trip, then show the success state.
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1400);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your home."
        description="A conversation costs nothing — and the earlier it happens, the better your project will be."
        image={IMAGES.heroContact}
      />

      <section className="py-24 md:py-36">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Info column */}
            <div className="lg:col-span-5">
              <AnimatedSection>
                <p className="eyebrow mb-4">The studio</p>
              </AnimatedSection>
              <TextReveal text="Visit, call, or write." className="headline-md text-ink" />
              <AnimatedSection delay={0.2}>
                <p className="mt-6 max-w-md font-body text-base leading-relaxed text-muted-foreground">
                  The kettle is always on in Belgravia. Bring photographs, floor plans, Pinterest
                  boards, or nothing at all — we&rsquo;ll start from wherever you are.
                </p>
              </AnimatedSection>

              <div className="mt-12 space-y-8">
                {INFO.map((item, i) => (
                  <AnimatedSection key={item.label} delay={0.1 + i * 0.08}>
                    <div className="flex gap-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-bronze">
                        <item.icon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          {item.label}
                        </p>
                        {item.lines.map((line) =>
                          item.href ? (
                            <a
                              key={line}
                              href={item.href}
                              className="mt-1 block font-body text-base text-ink transition-colors hover:text-bronze"
                            >
                              {line}
                            </a>
                          ) : (
                            <p key={line} className="mt-1 font-body text-base text-ink">
                              {line}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Form column */}
            <div className="lg:col-span-7">
              <AnimatedSection delay={0.15} className="relative border border-border bg-muted/40 p-8 md:p-14">
                <AnimatePresence mode="wait">
                  {isSent ? (
                    <motion.div
                      key="success"
                      className="flex min-h-[420px] flex-col items-center justify-center text-center"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <motion.span
                        className="flex h-20 w-20 items-center justify-center rounded-full border border-bronze text-bronze"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                      >
                        <Check className="h-8 w-8" strokeWidth={1.5} />
                      </motion.span>
                      <h3 className="mt-8 font-display text-3xl text-ink">Thank you.</h3>
                      <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-muted-foreground">
                        Your enquiry is with us. A member of the studio — not an autoresponder — will
                        reply within one working day.
                      </p>
                      <button
                        onClick={() => setIsSent(false)}
                        className="link-sweep mt-8 font-body text-[12px] uppercase tracking-[0.25em] text-ink"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="eyebrow mb-8">Start a project</p>
                      <div className="grid gap-8 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            Name *
                          </label>
                          <input id="name" name="name" required placeholder="Your full name" className={inputClasses} />
                        </div>
                        <div>
                          <label htmlFor="email" className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            Email *
                          </label>
                          <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputClasses} />
                        </div>
                        <div>
                          <label htmlFor="phone" className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            Phone
                          </label>
                          <input id="phone" name="phone" type="tel" placeholder="+44 ..." className={inputClasses} />
                        </div>
                        <div>
                          <label htmlFor="service" className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            Interested in
                          </label>
                          <select id="service" name="service" className={`${inputClasses} cursor-pointer`} defaultValue="">
                            <option value="" disabled>
                              Select a service
                            </option>
                            {SERVICES.map((s) => (
                              <option key={s.slug} value={s.slug}>
                                {s.title}
                              </option>
                            ))}
                            <option value="other">Something else</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="message" className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            Tell us about your home *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            required
                            rows={5}
                            placeholder="The property, the rooms, the timeline — whatever you know so far."
                            className={`${inputClasses} resize-none`}
                          />
                        </div>
                      </div>

                      <div className="mt-10">
                        <MagneticButton>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group inline-flex items-center gap-4 bg-ink px-10 py-5 font-body text-[12px] uppercase tracking-[0.25em] text-ivory transition-all duration-500 hover:bg-bronze disabled:opacity-60"
                          >
                            {isSubmitting ? "Sending..." : "Send enquiry"}
                            {!isSubmitting && (
                              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.5} />
                            )}
                          </button>
                        </MagneticButton>
                        <p className="mt-6 font-body text-xs text-muted-foreground">
                          * Required. We reply within one working day, and we never share your details.
                        </p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-24 md:pb-36">
        <div className="container">
          <AnimatedSection>
            <div className="relative overflow-hidden border border-border">
              <iframe
                title="Arden & Stone studio location"
                src="https://www.google.com/maps?q=Ebury%20Street%2C%20Belgravia%2C%20London&output=embed"
                className="h-[420px] w-full grayscale transition-all duration-700 hover:grayscale-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute left-6 top-6 hidden border border-border bg-ivory/90 px-6 py-4 backdrop-blur-sm md:block">
                <p className="eyebrow !tracking-[0.25em]">Find us</p>
                <p className="mt-2 font-body text-sm text-ink">
                  {CONTACT.street}, {CONTACT.locality}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default ContactClient;
