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
import { Search, Inbox, LogOut, CheckCircle, Trash2, FolderInput } from "lucide-react";
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
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignInPage onSignIn={() => signIn("google")} />;
  }

  return <Dashboard onSignOut={signOut} />;
}

function SignInPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Breadcrumbs</h1>
        <p className="mt-2 text-slate-500">Track what you explore. Capture what you learn.</p>
      </div>
      <Button onClick={onSignIn} size="lg" className="gap-2">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </Button>
    </div>
  );
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
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
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
        <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
          {me?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}
      <LogOut className="h-3.5 w-3.5 text-slate-400" />
    </button>
  );

  return (
    <AppShell topbarRight={profileButton}>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex items-center justify-between mb-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" />
                Inbox
                {count > 0 && (
                  <span className="ml-1 rounded-full bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
                    {count}
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {count === 0 ? "All caught up!" : `${count} item${count !== 1 ? "s" : ""} to explore`}
              </p>
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Inbox className="h-10 w-10 mx-auto mb-3 opacity-40" />
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
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white shadow-lg px-4 py-3">
              <span className="text-sm font-medium text-slate-700 mr-1">
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
              <button onClick={clearSelection} className="text-xs text-slate-400 hover:text-slate-600 ml-1">
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
