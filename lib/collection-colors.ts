// Muted earth tones that sit on the cream background.
export const COLLECTION_COLORS = [
  "#9C4A2A", // rust
  "#B9775A", // clay
  "#B7862F", // ochre
  "#7A7A3A", // olive
  "#6F8F72", // sage
  "#4F7F80", // teal
  "#5A6F8C", // slate
  "#7D5470", // plum
];

// Collections saved before the redesign used bright Tailwind colors. Show each as its closest earth tone.
const LEGACY: Record<string, string> = {
  "#ef4444": "#9C4A2A",
  "#f97316": "#B9775A",
  "#eab308": "#B7862F",
  "#22c55e": "#6F8F72",
  "#06b6d4": "#4F7F80",
  "#6366f1": "#5A6F8C",
  "#8b5cf6": "#7D5470",
  "#ec4899": "#7D5470",
  "#94a3b8": "#A99E90",
};

export function collectionColor(color?: string): string {
  if (!color) return "#A99E90";
  return LEGACY[color.toLowerCase()] ?? color;
}
