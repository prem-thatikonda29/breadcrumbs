"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { ExternalLink, Trash2, CheckCircle, FolderInput, RotateCcw } from "lucide-react";
import { cn, getDomain, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Props {
  entry: Doc<"entries">;
  showCollection?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

export function EntryCard({ entry, showCollection, selectable, selected, onToggleSelect }: Props) {
  const collections = useQuery(api.collections.list);
  const markExplored = useMutation(api.entries.markExplored);
  const markUnexplored = useMutation(api.entries.markUnexplored);
  const removeEntry = useMutation(api.entries.remove);
  const moveToCollection = useMutation(api.entries.moveToCollection);

  const [moveOpen, setMoveOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState("");

  const collection = collections?.find((c) => c._id === entry.collectionId);
  const isExplored = entry.status === "explored";
  const otherCollections = collections?.filter((c) => c._id !== entry.collectionId) ?? [];

  async function handleMove() {
    if (!moveTarget) return;
    await moveToCollection({ entryId: entry._id, collectionId: moveTarget as Id<"collections"> });
    setMoveOpen(false);
    setMoveTarget("");
  }

  return (
    <>
      <div
        className={cn(
          "group flex items-start gap-3 rounded-xl border p-4 bg-white transition-colors hover:border-slate-300",
          isExplored ? "border-slate-100" : "border-slate-200",
          selected && "border-slate-400 bg-slate-50"
        )}
      >
        {selectable && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleSelect?.(); }}
            className={cn(
              "mt-0.5 shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-colors",
              selected
                ? "bg-slate-900 border-slate-900"
                : "border-slate-300 hover:border-slate-500"
            )}
          >
            {selected && (
              <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <Link
              href={`/entries/${entry._id}`}
              className={cn(
                "font-medium text-sm leading-snug hover:underline line-clamp-2",
                isExplored ? "text-slate-400 line-through" : "text-slate-900"
              )}
            >
              {entry.title}
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
            >
              <ExternalLink className="h-3 w-3" />
              {getDomain(entry.url)}
            </a>
            {showCollection && collection && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: collection.color ?? "#94a3b8" }}
              >
                {collection.name}
              </span>
            )}
            <span className="text-xs text-slate-400">{formatDate(entry.dateAdded)}</span>
          </div>
          {entry.notes && (
            <p className="mt-1.5 text-xs text-slate-400 line-clamp-1 italic">{entry.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {otherCollections.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              onClick={() => setMoveOpen(true)}
              title="Move to collection"
            >
              <FolderInput className="h-4 w-4" />
            </Button>
          )}
          {isExplored ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-amber-600 hover:bg-amber-50"
              onClick={() => markUnexplored({ entryId: entry._id })}
              title="Mark as not explored"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-green-600 hover:bg-green-50"
              onClick={() => markExplored({ entryId: entry._id })}
              title="Mark as explored"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50"
            onClick={() => removeEntry({ entryId: entry._id })}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={moveTarget} onValueChange={setMoveTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a collection" />
              </SelectTrigger>
              <SelectContent>
                {otherCollections.map((col) => (
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
            <Button className="w-full" disabled={!moveTarget} onClick={handleMove}>
              Move
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
