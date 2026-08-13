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
