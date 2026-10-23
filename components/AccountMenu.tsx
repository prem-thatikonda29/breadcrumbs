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
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#F7F6F3] transition-colors"
          >
            {image ? (
              <Image src={image} alt={name ?? "User"} width={28} height={28} className="rounded-full" />
            ) : (
              <div className="h-7 w-7 rounded-full bg-[#EAEAEA] flex items-center justify-center text-xs font-medium text-[#787774]">
                {name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="z-50 min-w-44 rounded-lg border border-[#EAEAEA] bg-white p-1 text-sm shadow-md"
          >
            <DropdownMenu.Item
              onSelect={() => onSignOut()}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-[#111111] outline-none data-[highlighted]:bg-[#F7F6F3]"
            >
              <LogOut className="h-3.5 w-3.5 text-[#787774]" />
              Sign out
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => setConfirmOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-red-600 outline-none data-[highlighted]:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
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
          <p className="text-sm text-[#787774] leading-relaxed">
            This permanently deletes all your collections, saved links and learning notes. It
            can&apos;t be undone.
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
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
