"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { AppShell } from "@/components/AppShell";
import { EntryCard } from "@/components/EntryCard";
import { AddEntryDialog } from "@/components/AddEntryDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ElasticSwitch } from "@/components/ui/elastic-switch";
import { Search, BookOpen, LogOut, CheckCircle, Trash2, FolderInput } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "@/convex/_generated/dataModel";

export default function DashboardPage() {
  const { isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#EAEAEA] border-t-[#111111]" />
      </div>
    );
  }

  return <Dashboard onSignOut={signOut} />;
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showExplored, setShowExplored] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMoveTarget, setBulkMoveTarget] = useState("");

  const me = useQuery(api.users.me);
  const collections = useQuery(api.collections.list);
  const bulkMarkExplored = useMutation(api.entries.bulkMarkExplored);
  const bulkRemove = useMutation(api.entries.bulkRemove);
  const bulkMove = useMutation(api.entries.bulkMove);
  const unexplored = useQuery(api.entries.getUnexplored);
  const allEntries = useQuery(api.entries.getAll, showExplored ? {} : "skip");
  const titleResults = useQuery(
    api.entries.search,
    searchQuery.trim() ? { query: searchQuery } : "skip"
  );
  const learningEntryIds = useQuery(
    api.learnings.searchEntryIds,
    searchQuery.trim() ? { query: searchQuery } : "skip"
  );
  const allForSearch = useQuery(
    api.entries.getAll,
    searchQuery.trim() ? {} : "skip"
  );

  const searchResults = searchQuery.trim()
    ? (() => {
        if (!titleResults || !learningEntryIds || !allForSearch) return undefined;
        const titleIds = new Set(titleResults.map((e) => e._id));
        const extra = allForSearch.filter(
          (e) => learningEntryIds.includes(e._id) && !titleIds.has(e._id)
        );
        return [...titleResults, ...extra];
      })()
    : undefined;

  const entries = searchQuery.trim()
    ? searchResults
    : showExplored
    ? allEntries
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
    setBulkMoveTarget("");
  }

  async function handleBulkExplored() {
    await bulkMarkExplored({ entryIds: [...selectedIds] as Id<"entries">[] });
    clearSelection();
  }

  async function handleBulkDelete() {
    await bulkRemove({ entryIds: [...selectedIds] as Id<"entries">[] });
    clearSelection();
  }

  async function handleBulkMove() {
    if (!bulkMoveTarget) return;
    await bulkMove({ entryIds: [...selectedIds] as Id<"entries">[], collectionId: bulkMoveTarget as Id<"collections"> });
    clearSelection();
  }

  const selectedCount = selectedIds.size;

  const profileButton = (
    <button
      onClick={onSignOut}
      title="Sign out"
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#F7F6F3] transition-colors"
    >
      {me?.image ? (
        <Image
          src={me.image}
          alt={me.name ?? "User"}
          width={28}
          height={28}
          className="rounded-full"
        />
      ) : (
        <div className="h-7 w-7 rounded-full bg-[#EAEAEA] flex items-center justify-center text-xs font-medium text-[#787774]">
          {me?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}
      <LogOut className="h-3.5 w-3.5 text-[#BBBBB8]" />
    </button>
  );

  return (
    <AppShell topbarRight={profileButton}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex items-center justify-between mb-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111] flex items-center gap-2">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#787774]" />
                Library
                {count > 0 && (
                  <span className="ml-1 rounded-full bg-[#111111] px-2 py-0.5 text-xs font-medium text-white">
                    {count}
                  </span>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AddEntryDialog />
              {/* Hidden on mobile — shown in the AppShell top bar instead */}
              <div className="hidden md:block">
                {profileButton}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#BBBBB8]" />
              <Input
                placeholder="Search entries..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="ml-auto">
              <ElasticSwitch
                checked={showExplored}
                onChange={setShowExplored}
                label="Show explored"
              />
            </div>
          </div>

          {entries === undefined ? (
            <div className="flex justify-center py-12">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#EAEAEA] border-t-[#111111]" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 text-[#BBBBB8]">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                {searchQuery ? "No results found" : "Nothing to explore yet. Add something!"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
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
          )}
        </div>

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#EAEAEA] bg-white shadow-lg px-4 py-3">
              <span className="text-sm font-medium text-[#333333] mr-1">
                {selectedCount} selected
              </span>
              <Button size="sm" variant="outline" onClick={handleBulkExplored} className="gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                Mark explored
              </Button>
              {(collections?.length ?? 0) > 0 && (
                <div className="flex items-center gap-1.5">
                  <Select value={bulkMoveTarget} onValueChange={setBulkMoveTarget}>
                    <SelectTrigger className="h-8 text-xs w-32">
                      <SelectValue placeholder="Move to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {collections!.map((col) => (
                        <SelectItem key={col._id} value={col._id}>
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color ?? "#94a3b8" }} />
                            {col.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" disabled={!bulkMoveTarget} onClick={handleBulkMove} className="gap-1.5">
                    <FolderInput className="h-3.5 w-3.5" />
                    Move
                  </Button>
                </div>
              )}
              <Button size="sm" variant="outline" onClick={handleBulkDelete} className="gap-1.5 text-red-500 hover:text-red-600 hover:border-red-300">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
              <button onClick={clearSelection} className="text-xs text-[#BBBBB8] hover:text-[#787774] ml-1">
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
