import Link from "next/link";

/**
 * Landing-page nav: numbered anchors into the one-page flow, plus Resume.
 * Anchors are absolute (/#id) so they work from every page.
 */
const anchors = [
  { num: "01", label: "home", href: "/#home" },
  { num: "02", label: "expertise", href: "/#expertise" },
  { num: "03", label: "work", href: "/#work" },
  { num: "04", label: "experience", href: "/#experience" },
  { num: "05", label: "contact", href: "/#contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest/75 backdrop-blur-sm">
      <div className="container-site flex h-14 items-center justify-between">
        <Link
          href="/#home"
          className="whitespace-nowrap font-display text-base font-bold tracking-[-0.02em] text-white/95 sm:text-lg"
        >
          <span className="md:hidden">
            OB<span className="text-accent">.</span>
          </span>
          <span className="hidden md:inline">
            Owen Brown<span className="text-accent">.</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center">
          {anchors.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2 py-1.5 text-[13px] text-white/60 transition-colors hover:text-white sm:px-3 ${
                i === 1 || i === 3 ? "hidden sm:block" : ""
              }`}
            >
              <span aria-hidden className="nav-num">
                {item.num}
              </span>
              {item.label}
            </Link>
          ))}
          <Link
            href="/resume"
            className="ml-2 hidden rounded-full border border-white/20 px-4 py-1.5 text-[13px] text-white/80 transition-colors hover:border-white/60 hover:text-white sm:block"
          >
            resume
          </Link>
        </nav>
      </div>
    </header>
  );
}
