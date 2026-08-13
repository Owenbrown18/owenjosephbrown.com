import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import type { ReactNode } from "react";

function ScreenRow({ children }: { children: ReactNode }) {
  return <div className="screen-row">{children}</div>;
}

const components = {
  ScreenRow,
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
