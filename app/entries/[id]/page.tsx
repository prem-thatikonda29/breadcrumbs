"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
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
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Plus,
  Star,
  Trash2,
  Pencil,
  StickyNote,
  RotateCcw,
  Download,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn, formatDate, formatDateTime, getDomain, starsFromRating } from "@/lib/utils";

export default function EntryPage() {
  const params = useParams();
  const entryId = params.id as Id<"entries">;

  const entry = useQuery(api.entries.get, { entryId });
  const collections = useQuery(api.collections.list);
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

  const collection = collections?.find((c) => c._id === entry?.collectionId);

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
    const md = buildMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entry!.title.toLowerCase().replace(/\s+/g, "-")}.md`;
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
      <div className="flex h-screen items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      </div>
    );
  }

  if (entry === null) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Entry not found.
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <Link href={entry.collectionId ? `/collections/${entry.collectionId}` : "/"}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              {collection && (
                <Link href={`/collections/${collection._id}`}>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: collection.color ?? "#94a3b8" }}
                  >
                    {collection.name}
                  </span>
                </Link>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!learnings || learnings.length === 0}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!learnings || learnings.length === 0}
              >
                <Download className="h-4 w-4" />
                Download .md
              </Button>
            </div>
          </div>

          {/* Entry info */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 mb-6">
            {editingEntry ? (
              <form onSubmit={handleUpdateEntry} className="space-y-3 mb-4">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  autoFocus
                />
                <Input
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="URL"
                  type="url"
                />
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Context note (optional)"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={!editTitle.trim() || !editUrl.trim()}>Save</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditingEntry(false)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h1
                    className={cn(
                      "text-xl font-semibold text-slate-900",
                      entry.status === "explored" && "line-through text-slate-400"
                    )}
                  >
                    {entry.title}
                  </h1>
                  <button
                    onClick={startEditEntry}
                    className="shrink-0 h-7 w-7 flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mb-4"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {getDomain(entry.url)}
                </a>
                {entry.notes && (
                  <div className="flex items-start gap-1.5 mb-4 text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                    <StickyNote className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
                    <p className="leading-relaxed">{entry.notes}</p>
                  </div>
                )}
              </>
            )}
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>Added {formatDate(entry.dateAdded)}</span>
              {entry.dateExplored && (
                <span>Explored {formatDate(entry.dateExplored)}</span>
              )}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-medium",
                  entry.status === "explored"
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                )}
              >
                {entry.status === "explored" ? "Explored" : "Not explored"}
              </span>
            </div>
            {entry.status === "not_explored" ? (
              <Button
                className="mt-4"
                onClick={() => markExplored({ entryId })}
              >
                <CheckCircle className="h-4 w-4" />
                Mark Explored
              </Button>
            ) : (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => markUnexplored({ entryId })}
              >
                <RotateCcw className="h-4 w-4" />
                Mark as Not Explored
              </Button>
            )}
          </div>

          {/* Learning notes */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Learning Notes
              {learnings && learnings.length > 0 && (
                <span className="ml-2 text-sm font-normal text-slate-400">
                  ({learnings.length})
                </span>
              )}
            </h2>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Learning Note</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddLearning} className="space-y-4">
                  <Textarea
                    placeholder="What did you learn?"
                    value={addContent}
                    onChange={(e) => setAddContent(e.target.value)}
                    rows={5}
                    autoFocus
                  />
                  <div>
                    <p className="text-xs text-slate-500 mb-1.5">Rating (optional)</p>
                    <StarPicker value={addRating} onChange={setAddRating} />
                  </div>
                  <Button type="submit" className="w-full" disabled={!addContent.trim()}>
                    Save Note
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {learnings === undefined ? (
            <div className="flex justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            </div>
          ) : learnings.length === 0 ? (
            <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <p className="text-sm">No learning notes yet. Add one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {learnings.map((learning) => (
                <div
                  key={learning._id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  {editingId === learning._id ? (
                    <form onSubmit={handleUpdateLearning} className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        autoFocus
                      />
                      <StarPicker value={editRating} onChange={setEditRating} />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" disabled={!editContent.trim()}>
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {learning.content}
                        </p>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() =>
                              startEdit(learning._id, learning.content, learning.rating)
                            }
                            className="h-7 w-7 flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => removeLearning({ learningId: learning._id })}
                            className="h-7 w-7 flex items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {learning.rating && (
                          <span className="text-amber-400 text-sm">
                            {"★".repeat(learning.rating)}
                            <span className="text-slate-200">
                              {"★".repeat(5 - learning.rating)}
                            </span>
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          {formatDateTime(learning.createdAt)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(value === star ? 0 : star)}
          className={cn(
            "text-2xl transition-colors",
            star <= value ? "text-amber-400" : "text-slate-200 hover:text-amber-200"
          )}
        >
          ★
        </button>
      ))}
    </div>
  );
}
