import Link from "next/link";

/**
 * Floating nav: no bar, no border, no background. It sits over the forest
 * at the top of the page and scrolls away with it, tamalsen-style.
 * Anchors are absolute (/#id) so they work from every page.
 */
const anchors = [
  { num: "01", label: "home", href: "/#home" },
  { num: "02", label: "expertise", href: "/#expertise" },
  { num: "03", label: "work", href: "/#work" },
  { num: "04", label: "contact", href: "/#contact" },
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="container-site flex h-20 items-center justify-between">
        <Link
          href="/#home"
          className="whitespace-nowrap font-display text-lg font-bold tracking-[-0.02em] text-white/95"
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
                i === 1 ? "hidden sm:block" : ""
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
            className="ml-2 rounded-full border border-white/20 px-4 py-1.5 text-[13px] text-white/80 transition-colors hover:border-white/60 hover:text-white"
          >
            resume
          </Link>
        </nav>
      </div>
    </header>
  );
}
