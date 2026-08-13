"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import { identity } from "@/lib/resume-data";

type WorkItem = { slug: string; title: string };

export function CommandPalette({ work = [] }: { work?: WorkItem[] }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    document.addEventListener("open-command-palette", onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(null), 2400);
    return () => clearTimeout(t);
  }, [note]);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-forest/40 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command palette"
        className="fixed left-1/2 top-[18vh] z-[95] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-md border border-line bg-bg shadow-2xl"
      >
        <Command.Input
          placeholder="Type a command or search…"
          className="w-full border-b border-line bg-transparent px-4 py-3.5 text-[15px] text-fg outline-none placeholder:text-fg-faint"
        />
        <Command.List className="max-h-[50vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-fg-faint">
            Nothing found.
          </Command.Empty>

          <Command.Group heading="Go to" className="cmdk-group">
            {[
              { label: "Home", href: "/" },
              { label: "OBdesign (the studio)", href: "/obdesign" },
              { label: "About", href: "/about" },
              { label: "Resume", href: "/resume" },
            ].map((item) => (
              <Command.Item
                key={item.href}
                onSelect={() => run(() => router.push(item.href))}
                className="cmdk-item"
              >
                {item.label}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Case studies" className="cmdk-group">
            {work.map((w) => (
              <Command.Item
                key={w.slug}
                onSelect={() => run(() => router.push(`/work/${w.slug}`))}
                className="cmdk-item"
              >
                {w.title}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Actions" className="cmdk-group">
            <Command.Item
              onSelect={() => {
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
              }}
              className="cmdk-item"
            >
              Toggle theme
            </Command.Item>
            <Command.Item
              onSelect={() =>
                run(async () => {
                  await navigator.clipboard.writeText(identity.email);
                  setNote("Email copied");
                })
              }
              className="cmdk-item"
            >
              Copy email
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => window.open(identity.github, "_blank"))}
              className="cmdk-item"
            >
              GitHub
            </Command.Item>
            <Command.Item
              onSelect={() =>
                run(() => window.open(identity.linkedin, "_blank"))
              }
              className="cmdk-item"
            >
              LinkedIn
            </Command.Item>
            <Command.Item
              onSelect={() =>
                run(() => window.open("https://www.obwebdesign.ca", "_blank"))
              }
              className="cmdk-item"
            >
              obwebdesign.ca
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Terminal" className="cmdk-group">
            <Command.Item
              value="curl resume terminal"
              onSelect={() =>
                run(async () => {
                  await navigator.clipboard.writeText(
                    "curl owenjosephbrown.com",
                  );
                  setNote("Copied. Paste it in a terminal.");
                })
              }
              className="cmdk-item"
            >
              curl owenjosephbrown.com
            </Command.Item>
            <Command.Item
              value="develop the roll grain"
              onSelect={() => run(() => router.push("/work/grain"))}
              className="cmdk-item"
            >
              Develop the roll
            </Command.Item>
          </Command.Group>
        </Command.List>
        <div className="flex items-center justify-between border-t border-line px-4 py-2 text-xs text-fg-faint">
          <span>{note ?? "↑↓ navigate · ↵ select · esc close"}</span>
          <span className="font-display font-bold">
            OB<span className="text-accent">.</span>
          </span>
        </div>
      </Command.Dialog>
    </>
  );
}
