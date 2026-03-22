"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

export function AppShell({ children, topbarRight }: { children: React.ReactNode; topbarRight?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar whenever the route changes (user tapped a nav link)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar — hidden on md+ */}
        <header className="md:hidden flex items-center gap-3 px-4 h-12 border-b border-[#EAEAEA] bg-white shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 rounded-md text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-[#111111] tracking-tight flex-1">Breadcrumbs</span>
          {topbarRight}
        </header>

        {children}
      </div>
    </div>
  );
}
