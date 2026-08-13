import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site pb-24 pt-40 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)]">
        Nothing at this address.
      </h1>
      <p className="mx-auto mt-5 max-w-[40ch] text-fg-muted">
        The page moved, or never existed. The work index has everything worth
        finding.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full border border-line px-6 py-3 text-xs font-bold uppercase tracking-[0.06em] text-fg transition-colors hover:border-fg"
      >
        Back home
      </Link>
    </div>
  );
}
