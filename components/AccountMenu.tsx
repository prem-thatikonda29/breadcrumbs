"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  name?: string;
  image?: string;
  onSignOut: () => Promise<void> | void;
}

export function AccountMenu({ name, image, onSignOut }: Props) {
  const deleteAccount = useMutation(api.users.deleteAccount);
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await deleteAccount();
    } catch {
      setError("Couldn't delete your account. Please try again.");
      setDeleting(false);
      return;
    }
    // The session is already gone server-side; clear the local tokens too.
    try {
      await onSignOut();
    } catch {
      // ignore
    }
    router.replace("/");
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            title="Account"
            aria-label="Account"
            className="flex items-center rounded-xl p-1 transition-colors duration-300 ease-soft hover:bg-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {image ? (
              <Image src={image} alt={name ?? "User"} width={32} height={32} className="rounded-[0.7rem]" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-[0.7rem] bg-accent font-display text-[15px] text-card">
                {name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="z-50 min-w-48 rounded-2xl bg-card p-1.5 text-sm ring-1 ring-line shadow-[0_24px_48px_-24px_rgba(92,58,28,0.4)]"
          >
            <DropdownMenu.Item
              onSelect={() => onSignOut()}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-ink outline-none data-[highlighted]:bg-sunken"
            >
              <LogOut className="h-3.5 w-3.5 text-faint" strokeWidth={1.5} />
              Sign out
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => setConfirmOpen(true)}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-danger outline-none data-[highlighted]:bg-sunken"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              Delete account
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <Dialog open={confirmOpen} onOpenChange={(open) => !deleting && setConfirmOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
          </DialogHeader>
          <p className="text-[15px] leading-relaxed text-muted">
            This permanently deletes all your collections, saved links and learning notes. It
            can&apos;t be undone.
          </p>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete account"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
