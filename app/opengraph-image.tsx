import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const instrumentSerif = await readFile(
    join(process.cwd(), "assets/InstrumentSerif-Regular.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#F7F6F3",
          color: "#111111",
        }}
      >
        {/* Wordmark: the three-dot trail from the app icon */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 16px",
              background: "#0f172a",
              borderRadius: 14,
            }}
          >
            {[1, 0.7, 0.4].map((opacity) => (
              <div
                key={opacity}
                style={{ width: 14, height: 14, borderRadius: 7, background: "white", opacity }}
              />
            ))}
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Instrument Serif",
              fontSize: 96,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              color: "#000000",
            }}
          >
            A trail of everything you&apos;ve learned.
          </div>
          <div style={{ marginTop: 24, fontSize: 28, color: "#787774", maxWidth: 860 }}>
            Save links. Track what you&apos;ve explored. Export your notes as Markdown.
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 36 }}>
            <div
              style={{
                display: "flex",
                padding: "16px 32px",
                background: "#111111",
                color: "white",
                fontSize: 28,
                fontWeight: 600,
                borderRadius: 8,
              }}
            >
              Start for free
            </div>
            <div style={{ marginLeft: 24, fontSize: 26, color: "#787774" }}>
              {new URL(siteConfig.url).host}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Instrument Serif", data: instrumentSerif, style: "normal", weight: 400 }],
    }
  );
}
