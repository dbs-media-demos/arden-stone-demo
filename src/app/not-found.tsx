import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="eyebrow !text-bronze-light">404</p>
      <h1 className="headline-lg mt-6 text-ivory">This room doesn&rsquo;t exist yet.</h1>
      <p className="mt-6 max-w-md font-body text-base leading-relaxed text-ivory/60">
        The page you&rsquo;re looking for has been demolished, relocated, or was never built. Let us
        show you back to the entrance.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex border border-ivory/30 px-10 py-5 font-body text-[12px] uppercase tracking-[0.25em] text-ivory transition-all duration-500 hover:border-bronze-light hover:bg-bronze-light/10"
      >
        Back to home
      </Link>
    </section>
  );
}
