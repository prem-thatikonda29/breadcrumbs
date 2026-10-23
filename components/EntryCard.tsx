"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ArrowUpRight, Check, FolderInput, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { cn, getDomain, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useState } from "react";
import { collectionColor } from "@/lib/collection-colors";

interface Props {
  entry: Doc<"entries">;
  showCollection?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

const actionClass = "h-8 w-8 text-faint hover:bg-sunken hover:text-ink";
const menuItem = "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink outline-none data-[highlighted]:bg-sunken";

export function EntryCard({ entry, showCollection, selectable, selected, onToggleSelect }: Props) {
  const collections = useQuery(api.collections.list);
  const markExplored = useMutation(api.entries.markExplored);
  const markUnexplored = useMutation(api.entries.markUnexplored);
  const removeEntry = useMutation(api.entries.remove);
  const moveToCollection = useMutation(api.entries.moveToCollection);
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

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
          "group flex items-start gap-3.5 rounded-2xl bg-card px-4 py-4 ring-1 ring-line transition-all duration-300 ease-soft hover:ring-line-strong hover:shadow-[0_16px_32px_-24px_rgba(92,58,28,0.35)] sm:px-5",
          selected && "bg-sunken/60 ring-accent/40 hover:ring-accent/50"
        )}
      >
        {selectable && (
          <button
            type="button"
            role="checkbox"
            aria-checked={!!selected}
            aria-label={selected ? "Deselect" : "Select"}
            onClick={(e) => {
              e.preventDefault();
              onToggleSelect?.();
            }}
            className={cn(
              "mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md transition-colors duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              selected ? "bg-accent text-card" : "ring-1 ring-line-strong hover:ring-faint"
            )}
          >
            {selected && <Check className="h-3 w-3" strokeWidth={2.5} />}
          </button>
        )}

        <div className="min-w-0 flex-1">
          <Link
            href={`/entries/${entry._id}`}
            className={cn(
              "serif line-clamp-2 text-[19px] leading-snug tracking-[-0.01em] decoration-line-strong underline-offset-4 hover:underline",
              isExplored ? "text-ghost line-through decoration-ghost/60" : "text-ink"
            )}
          >
            {entry.title}
          </Link>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-faint">
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 transition-colors duration-300 ease-soft hover:text-accent"
            >
              {getDomain(entry.url)}
              <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
            </a>
            {showCollection && collection && (
              <Link href={`/collections/${collection._id}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: collectionColor(collection.color) }} />
                {collection.name}
              </Link>
            )}
            <span className="tabular-nums">{timeAgo(entry.dateAdded)}</span>
          </div>
          {entry.notes && <p className="mt-2 line-clamp-1 text-[13px] italic text-faint">{entry.notes}</p>}
        </div>

        {/* Phones: one menu instead of a row of icons */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            aria-label="Link options"
            className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-faint transition-colors duration-300 ease-soft hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent data-[state=open]:bg-sunken md:hidden"
          >
            <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={4} className="z-50 min-w-48 rounded-2xl bg-card p-1.5 ring-1 ring-line shadow-[0_24px_48px_-24px_rgba(92,58,28,0.4)]">
              <DropdownMenu.Item
                className={menuItem}
                onSelect={() => (isExplored ? markUnexplored({ entryId: entry._id }) : markExplored({ entryId: entry._id }))}
              >
                {isExplored ? <RotateCcw className="h-4 w-4 text-faint" strokeWidth={1.5} /> : <Check className="h-4 w-4 text-accent" strokeWidth={1.75} />}
                {isExplored ? "Mark as not explored" : "Mark as explored"}
              </DropdownMenu.Item>
              {otherCollections.length > 0 && (
                <DropdownMenu.Item className={menuItem} onSelect={() => setMoveOpen(true)}>
                  <FolderInput className="h-4 w-4 text-faint" strokeWidth={1.5} />
                  Move to collection
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Separator className="my-1 h-px bg-line" />
              <DropdownMenu.Item className={cn(menuItem, "text-danger")} onSelect={() => setConfirmOpen(true)}>
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <div className="hidden shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-300 ease-soft group-focus-within:opacity-100 group-hover:opacity-100 md:flex">
          {otherCollections.length > 0 && (
            <Button variant="ghost" size="icon" className={actionClass} onClick={() => setMoveOpen(true)} title="Move to collection" aria-label="Move to collection">
              <FolderInput className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          )}
          {isExplored ? (
            <Button variant="ghost" size="icon" className={actionClass} onClick={() => markUnexplored({ entryId: entry._id })} title="Mark as not explored" aria-label="Mark as not explored">
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className={cn(actionClass, "hover:text-accent")} onClick={() => markExplored({ entryId: entry._id })} title="Mark as explored" aria-label="Mark as explored">
              <Check className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          )}
          <Button variant="ghost" size="icon" className={cn(actionClass, "hover:text-danger")} onClick={() => setConfirmOpen(true)} title="Delete" aria-label="Delete">
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to a collection</DialogTitle>
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
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: collectionColor(col.color) }} />
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

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this link?"
        body={
          <>
            <span className="text-ink">{entry.title}</span> and any notes on it will be deleted. You can&apos;t undo this.
          </>
        }
        confirmLabel="Delete link"
        onConfirm={() => removeEntry({ entryId: entry._id })}
      />
    </>
  );
}
