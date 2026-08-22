import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { Children, type ReactNode } from "react";
import { PhoneFrame } from "@/components/phone-frame";

/* Every multi-item piece below is a .cascade under a .reveal-up: the
   container reveals, its children arrive one stagger apart. Reveal assigns
   --i to cascade children and never arms them separately. */
function ScreenRow({ children }: { children: ReactNode }) {
  return (
    <div className="screen-row cascade reveal-up">
      {Children.map(children, (child) => (
        <div>
          <PhoneFrame>{child}</PhoneFrame>
        </div>
      ))}
    </div>
  );
}

/**
 * The five pipeline stages, drawn as a rail. Built in markup rather than
 * shipped as an image so it stays crisp and readable at any size.
 */
function Pipeline({ steps }: { steps: string }) {
  const items = steps.split("|").map((s) => s.trim());
  return (
    <ol className="pipeline cascade reveal-up">
      {items.map((item, i) => {
        const [title, ...rest] = item.split(":");
        return (
          <li key={item} className="pipeline-step">
            <span className="pipeline-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="pipeline-title">{title}</span>
            {rest.length > 0 && (
              <span className="pipeline-note">{rest.join(":").trim()}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** A single number pulled out of the prose, with its unit and meaning. */
function StatRow({ stats }: { stats: string }) {
  const items = stats.split("|").map((s) => s.trim());
  return (
    <div className="stat-row cascade reveal-up">
      {items.map((item) => {
        const [value, ...label] = item.split(":");
        return (
          <div key={item} className="stat">
            <span className="stat-value">{value.trim()}</span>
            <span className="stat-label">{label.join(":").trim()}</span>
          </div>
        );
      })}
    </div>
  );
}

/* Prose lists cascade their items like the résumé's bullets do. */
function Ul(props: React.ComponentProps<"ul">) {
  return <ul {...props} className={["cascade", props.className].filter(Boolean).join(" ")} />;
}
function Ol(props: React.ComponentProps<"ol">) {
  return <ol {...props} className={["cascade", props.className].filter(Boolean).join(" ")} />;
}

const components = {
  ScreenRow,
  Pipeline,
  StatRow,
  ul: Ul,
  ol: Ol,
};

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [
              rehypePrettyCode,
              { theme: "everforest-dark", keepBackground: false },
            ],
          ],
        },
      }}
    />
  );
}
