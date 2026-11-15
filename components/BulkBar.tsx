"use client";

import { useState } from "react";
import { Check, FolderInput, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CollectionPicker } from "@/components/CollectionPicker";

interface Props {
  count: number;
  collections: { _id: string; name: string; color?: string }[] | undefined;
  onMarkExplored?: () => Promise<unknown>;
  onMove: (collectionId: string) => Promise<unknown>;
  onDelete: () => Promise<unknown>;
  onClear: () => void;
}

// Floating action bar for the entries currently selected in a list.
export function BulkBar({ count, collections, onMarkExplored, onMove, onDelete, onClear }: Props) {
  const [moveOpen, setMoveOpen] = useState(false);
  const [moving, setMoving] = useState(false);

  async function handleMove(collectionId: string) {
    setMoving(true);
    try {
      await onMove(collectionId);
      setMoveOpen(false);
    } finally {
      setMoving(false);
    }
  }
  const [confirmOpen, setConfirmOpen] = useState(false);
  const noun = count === 1 ? "link" : "links";

  return (
    <>
      <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
        <div className="flex w-full max-w-max flex-wrap items-center gap-2 rounded-[1.5rem] bg-ink px-3 py-2.5 text-card shadow-[0_24px_48px_-16px_rgba(33,28,22,0.5)] sm:rounded-full sm:pl-5">
          <span className="mr-1 text-sm font-medium tabular-nums">{count} selected</span>
          {onMarkExplored && (
            <Button size="sm" variant="ghost" onClick={() => onMarkExplored()} className="text-card hover:bg-card/10 hover:text-card">
              <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
              Mark explored
            </Button>
          )}
          {(collections?.length ?? 0) > 0 && (
            <Button size="sm" variant="ghost" onClick={() => setMoveOpen(true)} className="text-card hover:bg-card/10 hover:text-card">
              <FolderInput className="h-3.5 w-3.5" strokeWidth={1.5} />
              Move to…
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setConfirmOpen(true)} className="text-[#F2A38C] hover:bg-card/10 hover:text-[#F7BBA9]">
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            Delete
          </Button>
          <button
            onClick={onClear}
            className="rounded-full px-3 py-1.5 text-[13px] text-card/60 transition-colors duration-300 ease-soft hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-card/40"
          >
            Cancel
          </button>
        </div>
      </div>

      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Move {count} {noun} to a collection
            </DialogTitle>
          </DialogHeader>
          <CollectionPicker collections={collections ?? []} onPick={(c) => handleMove(c._id)} disabled={moving} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${count} ${noun}?`}
        body={`This also deletes any notes on ${count === 1 ? "it" : "them"}. You can't undo this.`}
        confirmLabel={`Delete ${noun}`}
        onConfirm={onDelete}
      />
    </>
  );
}
