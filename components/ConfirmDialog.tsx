"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => Promise<unknown> | unknown;
}

// Asks before anything is permanently deleted.
export function ConfirmDialog({ open, onOpenChange, title, body, confirmLabel, onConfirm }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      setError("That didn't work. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (busy) return;
        setError("");
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="text-[15px] leading-relaxed text-muted">{body}</div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <div className="mt-7 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={busy}>
            {busy ? "Deleting…" : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
