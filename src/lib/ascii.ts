import {
  education,
  experience,
  identity,
  projects,
  skills,
} from "@/lib/resume-data";

/**
 * The resume, rendered for a terminal. Served to curl/wget/httpie
 * user agents by the middleware rewrite.
 */

const SAGE = "\x1b[38;5;108m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

// "OWEN" / "BROWN" in ANSI Shadow.
const BANNER = String.raw`
 ██████╗ ██╗    ██╗███████╗███╗   ██╗
██╔═══██╗██║    ██║██╔════╝████╗  ██║
██║   ██║██║ █╗ ██║█████╗  ██╔██╗ ██║
██║   ██║██║███╗██║██╔══╝  ██║╚██╗██║
╚██████╔╝╚███╔███╔╝███████╗██║ ╚████║
 ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═══╝
██████╗ ██████╗  ██████╗ ██╗    ██╗███╗   ██╗
██╔══██╗██╔══██╗██╔═══██╗██║    ██║████╗  ██║
██████╔╝██████╔╝██║   ██║██║ █╗ ██║██╔██╗ ██║
██╔══██╗██╔══██╗██║   ██║██║███╗██║██║╚██╗██║
██████╔╝██║  ██║╚██████╔╝╚███╔███╔╝██║ ╚████║
╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝
`;

const RULE = "─".repeat(64);

function wrap(text: string, width: number, indent: string): string {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > width) {
      lines.push(line.trim());
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line.trim());
  return lines.map((l) => indent + l).join("\n");
}

export function renderAsciiResume({ color = true } = {}): string {
  const c = (code: string) => (color ? code : "");
  const out: string[] = [];

  out.push(c(SAGE) + BANNER + c(RESET));
  out.push(
    `${c(BOLD)}${identity.title}${c(RESET)} · ${identity.location}`,
  );
  out.push(`${identity.email} · ${identity.site}`);
  out.push(`github.com/Owenbrown18 · linkedin.com/in/owenbrown18`);
  out.push("");
  out.push(`${c(SAGE)}▸ Seeking:${c(RESET)} ${identity.seeking}`);
  out.push("");

  const section = (title: string) => {
    out.push(c(SAGE) + RULE + c(RESET));
    out.push(`${c(BOLD)}${title.toUpperCase()}${c(RESET)}`);
    out.push("");
  };

  section("Experience");
  for (const e of experience) {
    out.push(`${c(BOLD)}${e.org}${c(RESET)} · ${e.role}`);
    out.push(`${c(DIM)}${e.period} · ${e.location}${c(RESET)}`);
    for (const b of e.bullets) {
      out.push(wrap(`• ${b}`, 60, "  "));
    }
    out.push("");
  }

  section("Projects");
  for (const p of projects) {
    out.push(`${c(BOLD)}${p.org}${c(RESET)} · ${p.role}`);
    out.push(`${c(DIM)}${p.period} · ${p.location}${c(RESET)}`);
    for (const b of p.bullets) {
      out.push(wrap(`• ${b}`, 60, "  "));
    }
    if (p.link?.startsWith("/")) {
      out.push(`  ${c(DIM)}case study: ${identity.site}${p.link}${c(RESET)}`);
    }
    out.push("");
  }

  section("Education");
  out.push(`${c(BOLD)}${education.org}${c(RESET)} · ${education.credential}`);
  out.push(`${c(DIM)}${education.period}${c(RESET)}`);
  out.push("");

  section("Skills");
  for (const s of skills) {
    const lines = wrap(s.items, 50, " ".repeat(12)).split("\n");
    out.push(
      `${c(BOLD)}${s.label.padEnd(12)}${c(RESET)}${lines[0].trim()}`,
    );
    out.push(...lines.slice(1));
  }
  out.push("");

  out.push(c(SAGE) + RULE + c(RESET));
  out.push(`Case studies, lab, and HTML resume: https://${identity.site}`);
  out.push(
    `${c(DIM)}You're reading a Next.js middleware rewrite. Nice user agent.${c(RESET)}`,
  );
  out.push("");

  return out.join("\n");
}
