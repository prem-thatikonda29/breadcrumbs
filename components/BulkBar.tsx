"use client";

import { useState } from "react";
import { Check, FolderInput, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { collectionColor } from "@/lib/collection-colors";

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
  const [moveTarget, setMoveTarget] = useState("");
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
            <div className="flex items-center gap-1.5">
              <Select value={moveTarget} onValueChange={setMoveTarget}>
                <SelectTrigger className="h-8 w-36 bg-card/10 text-[13px] text-card ring-card/15 data-[placeholder]:text-card/60">
                  <SelectValue placeholder="Move to…" />
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
              <Button
                size="sm"
                variant="ghost"
                disabled={!moveTarget}
                onClick={async () => {
                  await onMove(moveTarget);
                  setMoveTarget("");
                }}
                className="text-card hover:bg-card/10 hover:text-card"
              >
                <FolderInput className="h-3.5 w-3.5" strokeWidth={1.5} />
                Move
              </Button>
            </div>
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
