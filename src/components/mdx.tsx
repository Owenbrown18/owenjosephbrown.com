import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { Children, type ReactNode } from "react";
import { PhoneFrame } from "@/components/phone-frame";

function ScreenRow({ children }: { children: ReactNode }) {
  return (
    <div className="screen-row">
      {Children.map(children, (child) => (
        <PhoneFrame>{child}</PhoneFrame>
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
    <ol className="pipeline">
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
    <div className="stat-row">
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

const components = {
  ScreenRow,
  Pipeline,
  StatRow,
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
