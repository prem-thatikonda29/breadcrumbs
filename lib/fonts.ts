import { Geist, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});

// Erode by Indian Type Foundry, self-hosted under the ITF Free Font License (assets/fonts/erode/FFL.txt).
export const erode = localFont({
  src: [
    { path: "../assets/fonts/erode/Erode-Variable.woff2", weight: "300 700", style: "normal" },
    { path: "../assets/fonts/erode/Erode-VariableItalic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-erode",
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});
