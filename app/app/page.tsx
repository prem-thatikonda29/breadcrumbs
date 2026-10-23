"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { AppShell } from "@/components/AppShell";
import { EntryCard } from "@/components/EntryCard";
import { AddEntryDialog } from "@/components/AddEntryDialog";
import { AccountMenu } from "@/components/AccountMenu";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { BulkBar } from "@/components/BulkBar";
import { SegmentedTabs } from "@/components/SegmentedTabs";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { EntryListSkeleton } from "@/components/Skeleton";
import { Id } from "@/convex/_generated/dataModel";

export default function DashboardPage() {
  const { isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <EntryListSkeleton />
      </div>
    );
  }

  return <Dashboard onSignOut={signOut} />;
}

function Dashboard({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [section, setSection] = useState<"unexplored" | "explored">("unexplored");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const me = useQuery(api.users.me);
  const collections = useQuery(api.collections.list);
  const bulkMarkExplored = useMutation(api.entries.bulkMarkExplored);
  const bulkRemove = useMutation(api.entries.bulkRemove);
  const bulkMove = useMutation(api.entries.bulkMove);
  const unexplored = useQuery(api.entries.getUnexplored);
  const everything = useQuery(api.entries.getAll);
  const explored = everything
    ?.filter((e) => e.status === "explored")
    .sort((a, b) => (b.dateExplored ?? 0) - (a.dateExplored ?? 0));
  const titleResults = useQuery(
    api.entries.search,
    searchQuery.trim() ? { query: searchQuery } : "skip"
  );
  const learningEntryIds = useQuery(
    api.learnings.searchEntryIds,
    searchQuery.trim() ? { query: searchQuery } : "skip"
  );
  const searchResults = searchQuery.trim()
    ? (() => {
        if (!titleResults || !learningEntryIds || !everything) return undefined;
        const titleIds = new Set(titleResults.map((e) => e._id));
        const extra = everything.filter(
          (e) => learningEntryIds.includes(e._id) && !titleIds.has(e._id)
        );
        return [...titleResults, ...extra];
      })()
    : undefined;

  const entries = searchQuery.trim()
    ? searchResults
    : section === "explored"
    ? explored
    : unexplored;

  const count = unexplored?.length ?? 0;

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  async function handleBulkExplored() {
    await bulkMarkExplored({ entryIds: [...selectedIds] as Id<"entries">[] });
    clearSelection();
  }

  async function handleBulkDelete() {
    await bulkRemove({ entryIds: [...selectedIds] as Id<"entries">[] });
    clearSelection();
  }

  async function handleBulkMove(collectionId: string) {
    await bulkMove({ entryIds: [...selectedIds] as Id<"entries">[], collectionId: collectionId as Id<"collections"> });
    clearSelection();
  }

  const selectedCount = selectedIds.size;

  const profileButton = (
    <AccountMenu name={me?.name} image={me?.image} onSignOut={onSignOut} />
  );

  const query = searchQuery.trim();

  return (
    <AppShell topbarRight={profileButton}>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 pb-32 pt-6 sm:px-6 sm:pt-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="serif text-[36px] leading-none tracking-[-0.03em] text-ink sm:text-[44px]">Library</h1>
              <p className="mt-2 text-sm tabular-nums text-faint">
                {unexplored === undefined ? "\u00a0" : count === 0 ? "Nothing waiting" : `${count} to explore`}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <AddEntryDialog />
              {/* Hidden on mobile, shown in the AppShell top bar instead */}
              <div className="hidden md:block">{profileButton}</div>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ghost" strokeWidth={1.5} />
              <Input
                placeholder="Search titles and notes"
                aria-label="Search titles and notes"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Search covers every link, so the tabs step back while a query is typed */}
            <SegmentedTabs
              className={cn("transition-opacity duration-300 ease-soft sm:ml-auto", query && "opacity-50")}
              value={section}
              onChange={(key) => {
                setSection(key);
                clearSelection();
              }}
              tabs={[
                { key: "unexplored", label: "To explore", count: unexplored?.length ?? 0 },
                { key: "explored", label: "Explored", count: explored?.length ?? 0 },
              ]}
            />
          </div>

          {entries === undefined ? (
            <EntryListSkeleton />
          ) : entries.length > 0 ? (
            <div className="space-y-2.5">
              {entries.map((entry) => (
                <EntryCard
                  key={entry._id}
                  entry={entry}
                  showCollection
                  selectable
                  selected={selectedIds.has(entry._id)}
                  onToggleSelect={() => toggleSelect(entry._id)}
                />
              ))}
            </div>
          ) : query ? (
            <EmptyState title={`Nothing matches \u201c${query}\u201d`} body="Search looks through your link titles and the notes you've written." />
          ) : section === "explored" ? (
            <EmptyState title="Nothing explored yet" body="When you mark a link as explored, it moves here." />
          ) : (everything?.length ?? 0) === 0 ? (
            everything === undefined ? (
              <EntryListSkeleton rows={2} />
            ) : (
              <EmptyState
                title="Nothing saved yet"
                body="Add your first link here, or put the bookmarklet in your bookmarks bar so you can save any page in one click."
              >
                <AddEntryDialog />
                <Link href="/bookmarklet" className={buttonVariants({ variant: "outline" })}>
                  Get the bookmarklet
                </Link>
              </EmptyState>
            )
          ) : (
            <EmptyState
              title="All caught up"
              body="You've explored everything you saved. Switch to Explored to look back through it, or go find something new."
            />
          )}
        </div>

        {selectedCount > 0 && (
          <BulkBar
            count={selectedCount}
            collections={collections}
            onMarkExplored={section === "unexplored" ? handleBulkExplored : undefined}
            onMove={handleBulkMove}
            onDelete={handleBulkDelete}
            onClear={clearSelection}
          />
        )}
      </main>
    </AppShell>
  );
}
