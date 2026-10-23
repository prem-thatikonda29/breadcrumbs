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
import { COLLECTION_COLORS } from "@/lib/collection-colors";
import { Textarea } from "@/components/ui/textarea";
import { collectionColor } from "@/lib/collection-colors";

const COLORS = COLLECTION_COLORS;

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
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Inline new-collection state
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);

  function reset() {
    setTitle("");
    setUrl("");
    setNotes("");
    setShowNotes(false);
    setCreatingNew(false);
    setError("");
    setCollectionId(defaultCollectionId ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setSaving(true);
    setError("");
    try {
      const result = await createEntry({
        title: title.trim() || url.trim(),
        url: url.trim(),
        collectionId: collectionId ? (collectionId as Id<"collections">) : undefined,
        notes: notes.trim() || undefined,
      });
      if (result.alreadyExists) {
        setError("That link is already in your library.");
        return;
      }
      reset();
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message.includes("http")
          ? "Links need to start with http:// or https://"
          : "Couldn't save that link. Please try again."
      );
    } finally {
      setSaving(false);
    }
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

  const label = "mb-1.5 block text-[13px] font-medium text-ink-2";
  const optional = <span className="font-normal text-faint">(optional)</span>;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save a link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="add-url" className={label}>
              Link
            </label>
            <Input
              id="add-url"
              placeholder="https://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="add-title" className={label}>
              Title {optional}
            </label>
            <Input id="add-title" placeholder="Uses the link if left blank" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <span className={label}>Collection {optional}</span>
            {!creatingNew ? (
              <div className="space-y-2">
                {hasCollections && (
                  <Select value={collectionId} onValueChange={setCollectionId}>
                    <SelectTrigger aria-label="Collection">
                      <SelectValue placeholder="Pick a collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {collections!.map((col) => (
                        <SelectItem key={col._id} value={col._id}>
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: collectionColor(col.color) }} />
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
                  className="flex items-center gap-1.5 rounded-lg text-[13px] text-muted transition-colors duration-300 ease-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {hasCollections ? "New collection" : "Create your first collection"}
                </button>
              </div>
            ) : (
              <div className="space-y-3 rounded-2xl bg-sunken/60 p-3 ring-1 ring-line">
                <Input placeholder="Collection name" aria-label="Collection name" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Color ${c}`}
                      onClick={() => setNewColor(c)}
                      className={cn(
                        "h-6 w-6 rounded-full transition-transform duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        newColor === c && "scale-110 ring-2 ring-ink/40 ring-offset-2 ring-offset-sunken"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={handleCreateCollection} disabled={!newName.trim()}>
                    Create
                  </Button>
                  {hasCollections && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setCreatingNew(false)}>
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
                className="flex items-center gap-1.5 rounded-lg text-[13px] text-muted transition-colors duration-300 ease-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                Add a note about why you&apos;re saving it
              </button>
            ) : (
              <Textarea
                placeholder="Why are you saving this?"
                aria-label="Note"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                autoFocus
              />
            )}
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" className="w-full" disabled={!url.trim() || saving}>
            {saving ? "Saving…" : "Save link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
