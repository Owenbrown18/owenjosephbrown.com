import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { identity } from "@/lib/resume-data";
import { PageHeader } from "@/components/page-header";
import { ArrowUpRightIcon, MailIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Owen Brown: software engineering student at UVic, founder of OBdesign, seeking a Spring 2027 co-op.",
};

const PDF = "/owen-brown-resume.pdf";

export default function ResumePage() {
  // Checked at build time: if the PDF hasn't been dropped in yet, show a
  // plain note instead of an embed that renders as a broken grey box.
  const hasPdf = existsSync(join(process.cwd(), "public", PDF.slice(1)));

  return (
    <div className="container-site pb-24 pt-36 sm:pt-40">
      <PageHeader
        eyebrow="Resume"
        title={identity.name}
        summary={`${identity.title} · ${identity.location}. Seeking ${identity.seeking}.`}
        meta={[
          {
            label: "Email",
            wide: true,
            value: (
              <a
                href={`mailto:${identity.email}`}
                className="link-underline inline-flex items-center gap-2 text-fg"
              >
                <MailIcon className="h-3.5 w-3.5" />
                {identity.email}
              </a>
            ),
          },
          {
            label: "GitHub",
            value: (
              <a
                href={identity.github}
                rel="me noopener"
                className="link-underline text-fg"
              >
                Owenbrown18
              </a>
            ),
          },
          {
            label: "Terminal",
            wide: true,
            value: (
              <code className="text-fg">curl owenjosephbrown.com</code>
            ),
          },
          {
            label: "PDF",
            value: hasPdf ? (
              <a
                href={PDF}
                download
                className="link-underline inline-flex items-center gap-1.5 text-fg"
              >
                Download
                <ArrowUpRightIcon />
              </a>
            ) : (
              <span className="text-fg-faint">Coming shortly</span>
            ),
          },
        ]}
      />

      {hasPdf ? (
        <div className="mt-12 overflow-hidden border border-line bg-surface">
          <object
            data={`${PDF}#view=FitH`}
            type="application/pdf"
            className="block h-[min(90vh,1100px)] w-full"
            aria-label="Owen Brown resume, PDF"
          >
            {/* iOS Safari and most mobile browsers refuse to inline a PDF;
                they get the link instead of an empty frame. */}
            <div className="p-10 text-center">
              <p className="text-fg-muted">
                Your browser won’t display the PDF inline.
              </p>
              <a
                href={PDF}
                className="link-underline mt-3 inline-block font-display text-lg font-bold text-fg"
              >
                Open the resume →
              </a>
            </div>
          </object>
        </div>
      ) : (
        <div className="mt-12 border border-line p-10">
          <p className="max-w-[52ch] text-fg-muted">
            The PDF isn’t in the build yet. In the meantime the full history
            is on{" "}
            <a
              href={identity.linkedin}
              rel="me noopener"
              className="link-underline text-fg"
            >
              LinkedIn
            </a>
            , and the work itself is on{" "}
            <Link href="/#work" className="link-underline text-fg">
              the work section
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
