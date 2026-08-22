import Link from "next/link";
import { PixelCells } from "@/components/pixel-cells";

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
        className="btn mt-8"
      >
        <PixelCells seed="back-home" variant="hover" cols={10} rows={3} spread={240} />
        <span className="btn__label">Back home</span>
      </Link>
    </div>
  );
}
