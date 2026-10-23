"use client";

import { cn } from "@/lib/utils";

interface Tab<K extends string> {
  key: K;
  label: string;
  count: number;
}

interface Props<K extends string> {
  value: K;
  onChange: (key: K) => void;
  tabs: Tab<K>[];
  className?: string;
}

// Pill-shaped tab switcher used by the Library and collection pages.
export function SegmentedTabs<K extends string>({ value, onChange, tabs, className }: Props<K>) {
  return (
    <div role="tablist" className={cn("inline-flex rounded-full bg-sunken p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={value === tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm transition-all duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            value === tab.key ? "bg-card font-medium text-ink shadow-[0_2px_8px_-2px_rgba(92,58,28,0.25)]" : "text-muted hover:text-ink"
          )}
        >
          {tab.label} <span className="tabular-nums text-faint">{tab.count}</span>
        </button>
      ))}
    </div>
  );
}
