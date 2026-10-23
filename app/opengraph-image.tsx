import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Satori can't read woff2, so the share image uses the static OTF.
  const erode = await readFile(join(process.cwd(), "assets/fonts/erode/Erode-Regular.otf"));

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
          background: "#F3EEE4",
          color: "#211C16",
          fontFamily: "Erode",
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
              background: "#211C16",
              borderRadius: 14,
            }}
          >
            {[1, 0.7, 0.4].map((opacity) => (
              <div
                key={opacity}
                style={{ width: 14, height: 14, borderRadius: 7, background: "#F3EEE4", opacity }}
              />
            ))}
          </div>
          <div style={{ fontSize: 34, letterSpacing: "-0.01em" }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: 1000 }}>
            {siteConfig.tagline}
          </div>
          <div style={{ marginTop: 32, fontSize: 32, color: "#9C4A2A" }}>
            Save it in one click. Come back when you have time.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Erode", data: erode, style: "normal", weight: 400 }],
    }
  );
}
