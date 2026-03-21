"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
];

interface Props {
  defaultCollectionId?: Id<"collections">;
}

export function AddEntryDialog({ defaultCollectionId }: Props) {
  const collections = useQuery(api.collections.list);
  const createEntry = useMutation(api.entries.create);
  const createCollection = useMutation(api.collections.create);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [collectionId, setCollectionId] = useState<string>(defaultCollectionId ?? "");

  // Inline new-collection state
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || !collectionId) return;
    const finalTitle = title.trim() || url.trim();
    await createEntry({
      title: finalTitle,
      url: url.trim(),
      collectionId: collectionId as Id<"collections">,
      notes: notes.trim() || undefined,
    });
    setTitle("");
    setUrl("");
    setNotes("");
    setShowNotes(false);
    setCollectionId(defaultCollectionId ?? "");
    setOpen(false);
  }

  async function handleCreateCollection() {
    if (!newName.trim()) return;
    const id = await createCollection({ name: newName.trim(), color: newColor });
    setCollectionId(id);
    setCreatingNew(false);
    setNewName("");
    setNewColor(COLORS[0]);
  }

  const hasCollections = (collections?.length ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setCreatingNew(false); setShowNotes(false); setNotes(""); } }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Explore</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 mb-1 block">
              Title <span className="text-slate-400">(optional)</span>
            </label>
            <Input
              placeholder="Leave blank to use URL"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 mb-1 block">URL *</label>
            <Input
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 mb-1 block">Collection *</label>

            {!creatingNew ? (
              <div className="space-y-2">
                {hasCollections && (
                  <Select value={collectionId} onValueChange={setCollectionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {collections!.map((col) => (
                        <SelectItem key={col._id} value={col._id}>
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: col.color ?? "#94a3b8" }}
                            />
                            {col.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <button
                  type="button"
                  onClick={() => setCreatingNew(true)}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {hasCollections ? "New collection" : "Create your first collection"}
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 p-3 space-y-3">
                <Input
                  placeholder="Collection name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={cn(
                        "h-5 w-5 rounded-full transition-transform",
                        newColor === c && "ring-2 ring-offset-1 ring-slate-400 scale-110"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateCollection}
                    disabled={!newName.trim()}
                  >
                    Create
                  </Button>
                  {hasCollections && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCreatingNew(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            {!showNotes ? (
              <button
                type="button"
                onClick={() => setShowNotes(true)}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700 transition-colors"
              >
                <ChevronDown className="h-3.5 w-3.5" />
                Add a context note
              </button>
            ) : (
              <Textarea
                placeholder="Why are you saving this? (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                autoFocus
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!url.trim() || !collectionId}
          >
            Add Entry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
