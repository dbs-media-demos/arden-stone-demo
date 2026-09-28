import { AREAS } from "@/data/areas";
import { SERVICES, type Service } from "@/data/services";
import { REVIEWS } from "@/data/studio";
import { absoluteUrl, site, siteUrl } from "./site";

/** schema.org builders. Everything links back to one business node via @id. */

type Json = Record<string, unknown>;

export const businessId = `${siteUrl}/#business`;
export const websiteId = `${siteUrl}/#website`;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function businessSchema(): Json {
  return {
    "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
    "@id": businessId,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: siteUrl,
    logo: absoluteUrl("/brand/logo-512.png"),
    image: absoluteUrl("/images/hero/kitchen.jpg"),
    telephone: "+1-214-555-0162",
    email: site.email,
    priceRange: site.priceRange,
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: site.hours.flatMap((slot, i) =>
      slot ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[i], opens: slot[0], closes: slot[1] }] : [],
    ),
    areaServed: [
      ...AREAS.map((a) => ({ "@type": "Place", name: `${a.name}, TX` })),
      { "@type": "City", name: "Dallas" },
      { "@type": "City", name: "Fort Worth" },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5 },
    review: REVIEWS.slice(0, 6).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Renovation services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, url: absoluteUrl(`/services/${s.slug}`) },
      })),
    },
    sameAs: Object.values(site.social),
  };
}

export function websiteSchema(): Json {
  return { "@type": "WebSite", "@id": websiteId, url: siteUrl, name: site.name, description: site.description, publisher: { "@id": businessId }, inLanguage: "en-US" };
}

export function serviceSchema(s: Service): Json {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(`/services/${s.slug}`)}#service`,
    name: s.title,
    serviceType: s.title,
    description: s.lede,
    provider: { "@id": businessId },
    areaServed: AREAS.map((a) => ({ "@type": "Place", name: `${a.name}, TX` })),
    url: absoluteUrl(`/services/${s.slug}`),
    offers: { "@type": "Offer", description: `${s.price} · ${s.duration}`, priceCurrency: "USD" },
  };
}

export function faqSchema(items: { q: string; a: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/** Wraps nodes in one @graph document. */
export const graph = (...nodes: Json[]) => ({ "@context": "https://schema.org", "@graph": nodes });
