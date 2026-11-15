"use client";

import { useState } from "react";
import { cn, getDomain } from "@/lib/utils";

interface Props {
  url: string;
  /** Square size in px. */
  size?: number;
  className?: string;
}

/** A site's icon, or a paper tile with the domain's first letter when there isn't one. */
export function Favicon({ url, ...rest }: Props) {
  const domain = getDomain(url);
  // Keyed so load/error state resets if the entry's URL is edited to another site.
  return <Tile key={domain} domain={domain} {...rest} />;
}

function Tile({ domain, size = 20, className }: Omit<Props, "url"> & { domain: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  const letter = domain.match(/[a-z0-9]/i)?.[0]?.toUpperCase() ?? "•";
  const pad = Math.max(2, Math.round(size * 0.14));

  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden ring-1 ring-line transition-colors duration-300 ease-soft",
        status === "loaded" ? "bg-card" : "bg-sunken",
        className
      )}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.28) }}
    >
      {status !== "loaded" && (
        <span className="serif leading-none text-faint" style={{ fontSize: Math.round(size * 0.55) }}>
          {letter}
        </span>
      )}
      {status !== "failed" && (
        // Plain <img>: tiny icons gain nothing from next/image optimisation.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/favicon?host=${encodeURIComponent(domain)}`}
          alt=""
          loading="lazy"
          decoding="async"
          // Cached icons can finish before hydration, when onLoad/onError aren't attached yet.
          ref={(img) => {
            if (img?.complete) setStatus(img.naturalWidth > 0 ? "loaded" : "failed");
          }}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("failed")}
          className={cn(
            "absolute object-contain transition-opacity duration-300 ease-soft",
            status === "loaded" ? "opacity-100" : "opacity-0"
          )}
          style={{ top: pad, left: pad, width: size - pad * 2, height: size - pad * 2 }}
        />
      )}
    </span>
  );
}
