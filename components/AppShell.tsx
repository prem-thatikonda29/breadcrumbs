"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

export function AppShell({ children, topbarRight }: { children: React.ReactNode; topbarRight?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar whenever the route changes (user tapped a nav link)
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink/30 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar — hidden on md+ */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-paper/90 px-3 backdrop-blur-xl md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors duration-300 ease-soft hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <span className="serif flex-1 text-[19px] tracking-[-0.02em] text-ink">Breadcrumbs</span>
          {topbarRight}
        </header>

        {children}
      </div>
    </div>
  );
}
