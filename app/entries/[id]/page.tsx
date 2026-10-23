"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowUpRight, Check, Copy, Download, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import Link from "next/link";
import { useState } from "react";
import { cn, formatDate, formatDateTime, getDomain, starsFromRating, timeAgo } from "@/lib/utils";
import { collectionColor } from "@/lib/collection-colors";

export default function EntryPage() {
  const params = useParams();
  const entryId = params.id as Id<"entries">;

  const entry = useQuery(api.entries.get, { entryId });
  const collections = useQuery(api.collections.list);
  const archivedCollections = useQuery(api.collections.listArchived);
  const learnings = useQuery(api.learnings.getByEntry, { entryId });
  const markExplored = useMutation(api.entries.markExplored);
  const markUnexplored = useMutation(api.entries.markUnexplored);
  const updateEntry = useMutation(api.entries.update);
  const createLearning = useMutation(api.learnings.create);
  const updateLearning = useMutation(api.learnings.update);
  const removeLearning = useMutation(api.learnings.remove);

  const [copied, setCopied] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addContent, setAddContent] = useState("");
  const [addRating, setAddRating] = useState(0);
  const [editingId, setEditingId] = useState<Id<"learnings"> | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [deletingNote, setDeletingNote] = useState<Id<"learnings"> | null>(null);

  // Entry editing
  const [editingEntry, setEditingEntry] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editNotes, setEditNotes] = useState("");

  function startEditEntry() {
    if (!entry) return;
    setEditTitle(entry.title);
    setEditUrl(entry.url);
    setEditNotes(entry.notes ?? "");
    setEditingEntry(true);
  }

  async function handleUpdateEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!editTitle.trim() || !editUrl.trim()) return;
    await updateEntry({ entryId, title: editTitle.trim(), url: editUrl.trim(), notes: editNotes.trim() || undefined });
    setEditingEntry(false);
  }

  function buildMarkdown() {
    if (!entry || !learnings) return "";
    const lines: string[] = [
      `# ${entry.title}`,
      "",
      `**URL:** ${entry.url}`,
      `**Added:** ${formatDate(entry.dateAdded)}`,
    ];
    if (entry.dateExplored) lines.push(`**Explored:** ${formatDate(entry.dateExplored)}`);
    lines.push("");
    learnings.forEach((l, i) => {
      const stars = starsFromRating(l.rating);
      lines.push(`## Note ${i + 1} — ${formatDate(l.createdAt)}${stars ? ` ${stars}` : ""}`);
      lines.push("");
      lines.push(l.content);
      lines.push("");
    });
    return lines.join("\n");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!entry) return;
    const md = buildMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entry.title.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleAddLearning(e: React.FormEvent) {
    e.preventDefault();
    if (!addContent.trim()) return;
    await createLearning({
      entryId,
      content: addContent.trim(),
      rating: addRating || undefined,
    });
    setAddContent("");
    setAddRating(0);
    setAddOpen(false);
  }

  async function handleUpdateLearning(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editContent.trim()) return;
    await updateLearning({
      learningId: editingId,
      content: editContent.trim(),
      rating: editRating || undefined,
    });
    setEditingId(null);
  }

  function startEdit(id: Id<"learnings">, content: string, rating?: number) {
    setEditingId(id);
    setEditContent(content);
    setEditRating(rating ?? 0);
  }

  if (entry === undefined) {
    return (
      <AppShell>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-6 sm:pt-10" role="status" aria-label="Loading">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-8 h-10 w-4/5" />
            <Skeleton className="mt-4 h-4 w-40" />
            <Skeleton className="mt-12 h-28 w-full rounded-2xl" />
          </div>
        </main>
      </AppShell>
    );
  }

  if (entry === null) {
    return (
      <AppShell>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6">
            <EmptyState title="This link isn't here" body="It may have been deleted, or it belongs to a different account.">
              <Link href="/app" className="text-sm font-medium text-accent underline-offset-4 hover:underline">
                Back to your library
              </Link>
            </EmptyState>
          </div>
        </main>
      </AppShell>
    );
  }

  const collection =
    collections?.find((c) => c._id === entry.collectionId) ?? archivedCollections?.find((c) => c._id === entry.collectionId);
  const isExplored = entry.status === "explored";
  const hasNotes = !!learnings && learnings.length > 0;
  const iconButton =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-faint transition-colors duration-300 ease-soft hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
          {/* Back link and export */}
          <div className="mb-8 flex items-center justify-between gap-3">
            <Link
              href={collection ? `/collections/${collection._id}` : "/app"}
              className="inline-flex min-w-0 items-center gap-1.5 rounded-lg text-sm text-faint transition-colors duration-300 ease-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              {collection ? (
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: collectionColor(collection.color) }} />
                  <span className="truncate">{collection.name}</span>
                </span>
              ) : (
                "Library"
              )}
            </Link>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!hasNotes} title="Copy notes as Markdown">
                {copied ? <Check className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={!hasNotes} title="Download notes as Markdown">
                <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="hidden sm:inline">Download .md</span>
              </Button>
            </div>
          </div>

          {/* The link itself */}
          <section className="mb-12">
            {editingEntry ? (
              <form onSubmit={handleUpdateEntry} className="space-y-3 rounded-[1.75rem] bg-card p-5 ring-1 ring-line sm:p-6">
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" aria-label="Title" autoFocus />
                <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://" aria-label="Link" type="url" />
                <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Why you saved it (optional)" aria-label="Note" rows={3} />
                <div className="flex gap-2 pt-1">
                  <Button type="submit" size="sm" disabled={!editTitle.trim() || !editUrl.trim()}>
                    Save
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditingEntry(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h1
                    className={cn(
                      "serif text-[32px] leading-[1.1] tracking-[-0.03em] text-balance sm:text-[40px]",
                      isExplored ? "text-ghost line-through decoration-ghost/50" : "text-ink"
                    )}
                  >
                    {entry.title}
                  </h1>
                  <button onClick={startEditEntry} className={cn(iconButton, "mt-1.5")} aria-label="Edit link" title="Edit link">
                    <Pencil className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[15px] text-muted underline decoration-line-strong underline-offset-4 transition-colors duration-300 ease-soft hover:text-accent hover:decoration-accent/50"
                >
                  {getDomain(entry.url)}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </a>
                {entry.notes && (
                  <p className="mt-5 max-w-[60ch] border-l-2 border-accent/40 pl-4 text-[15px] italic leading-relaxed text-muted">{entry.notes}</p>
                )}
              </>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
              {isExplored ? (
                <Button variant="outline" onClick={() => markUnexplored({ entryId })}>
                  <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
                  Mark as not explored
                </Button>
              ) : (
                <Button variant="accent" onClick={() => markExplored({ entryId })}>
                  <Check className="h-4 w-4" strokeWidth={1.75} />
                  Mark as explored
                </Button>
              )}
              <p className="text-[13px] text-faint">
                Saved {timeAgo(entry.dateAdded)}
                {entry.dateExplored && <> · explored {timeAgo(entry.dateExplored)}</>}
              </p>
            </div>
          </section>

          {/* Learning notes */}
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 className="serif text-[26px] leading-none tracking-[-0.02em] text-ink">
              What I learned
              {hasNotes && <span className="ml-2 font-body text-sm tabular-nums tracking-normal text-faint">{learnings.length}</span>}
            </h2>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Add note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a note</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddLearning} className="space-y-4">
                  <Textarea placeholder="What did you take away from it?" aria-label="Note" value={addContent} onChange={(e) => setAddContent(e.target.value)} rows={5} autoFocus />
                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-ink-2">
                      How good was it? <span className="font-normal text-faint">(optional)</span>
                    </p>
                    <StarPicker value={addRating} onChange={setAddRating} />
                  </div>
                  <Button type="submit" className="w-full" disabled={!addContent.trim()}>
                    Save note
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {learnings === undefined ? (
            <div className="space-y-3" role="status" aria-label="Loading">
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ) : learnings.length === 0 ? (
            <EmptyState
              title="No notes yet"
              body={isExplored ? "Jot down a line or two about what you got out of it, while it's fresh." : "Once you've been through it, write down what stuck with you."}
            />
          ) : (
            <div className="space-y-3">
              {learnings.map((learning) => (
                <article key={learning._id} className="group rounded-2xl bg-card px-5 py-4 ring-1 ring-line">
                  {editingId === learning._id ? (
                    <form onSubmit={handleUpdateLearning} className="space-y-3">
                      <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} aria-label="Note" rows={4} autoFocus />
                      <StarPicker value={editRating} onChange={setEditRating} />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" disabled={!editContent.trim()}>
                          Save
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink-2">{learning.content}</p>
                        <div className="-mr-2 -mt-1 flex shrink-0 gap-0.5 transition-opacity duration-300 ease-soft md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
                          <button onClick={() => startEdit(learning._id, learning.content, learning.rating)} className={iconButton} aria-label="Edit note" title="Edit note">
                            <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                          <button onClick={() => setDeletingNote(learning._id)} className={cn(iconButton, "hover:text-danger")} aria-label="Delete note" title="Delete note">
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        {learning.rating ? (
                          <span className="text-sm tracking-[0.15em] text-accent" aria-label={`${learning.rating} out of 5`}>
                            {"★".repeat(learning.rating)}
                            <span className="text-line-strong">{"★".repeat(5 - learning.rating)}</span>
                          </span>
                        ) : null}
                        <span className="text-[13px] text-faint">{formatDateTime(learning.createdAt)}</span>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={!!deletingNote}
        onOpenChange={(open) => !open && setDeletingNote(null)}
        title="Delete this note?"
        body="You can't undo this."
        confirmLabel="Delete note"
        onConfirm={() => deletingNote && removeLearning({ learningId: deletingNote })}
      />
    </AppShell>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(value === star ? 0 : star)}
          className={cn(
            "rounded-md text-2xl leading-none transition-colors duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            star <= value ? "text-accent" : "text-line-strong hover:text-accent/50"
          )}
        >
          ★
        </button>
      ))}
    </div>
  );
}
