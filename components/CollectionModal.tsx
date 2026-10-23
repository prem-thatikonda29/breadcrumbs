"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useRef } from "react";
import { X, ImageIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COLLECTION_COLORS, collectionColor } from "@/lib/collection-colors";

// Matches MAX_ICON_BYTES in convex/validate.ts, which enforces it server-side.
const MAX_ICON_BYTES = 1024 * 1024;

const COLORS = COLLECTION_COLORS;

interface CollectionData {
  _id: Id<"collections">;
  name: string;
  color?: string;
  description?: string;
  iconStorageId?: Id<"_storage">;
  iconUrl?: string | null;
}

interface Props {
  // Either pass a trigger, or control it with open/onOpenChange (remount with a new key to reset the fields).
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode: "create" | "edit";
  collection?: CollectionData;
}

export function CollectionModal({ trigger, open: openProp, onOpenChange, mode, collection }: Props) {
  const createCollection = useMutation(api.collections.create);
  const updateCollection = useMutation(api.collections.update);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = (next: boolean) => (openProp === undefined ? setInternalOpen(next) : onOpenChange?.(next));
  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [color, setColor] = useState(collectionColor(collection?.color ?? COLORS[0]));
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(collection?.iconUrl ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    setError("");
    if (isOpen && mode === "edit" && collection) {
      setName(collection.name);
      setDescription(collection.description ?? "");
      setColor(collectionColor(collection.color ?? COLORS[0]));
      setIconPreview(collection.iconUrl ?? null);
      setIconFile(null);
    } else if (!isOpen) {
      setName("");
      setDescription("");
      setColor(COLORS[0]);
      setIconFile(null);
      setIconPreview(null);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (!file.type.startsWith("image/") || file.size > MAX_ICON_BYTES) {
      setError("Icon must be an image under 1 MB");
      return;
    }
    setError("");
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      let iconStorageId: Id<"_storage"> | undefined =
        mode === "edit" ? collection?.iconStorageId : undefined;

      if (iconFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": iconFile.type },
          body: iconFile,
        });
        const { storageId } = await result.json();
        iconStorageId = storageId;
      }

      if (mode === "create") {
        await createCollection({
          name: name.trim(),
          color,
          description: description.trim() || undefined,
          iconStorageId,
        });
      } else if (collection) {
        await updateCollection({
          collectionId: collection._id,
          name: name.trim(),
          color,
          description: description.trim() || undefined,
          iconStorageId,
        });
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            nameRef.current?.focus();
          }}
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.75rem] bg-card ring-1 ring-line shadow-[0_40px_80px_-32px_rgba(92,58,28,0.45)] focus:outline-none">
          <DialogPrimitive.Title className="sr-only">
            {mode === "create" ? "New collection" : "Edit collection"}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {mode === "create" ? "Create a new collection" : "Edit collection details"}
          </DialogPrimitive.Description>
          <form onSubmit={handleSubmit}>
            {/* Top colored section */}
            <div
              className="h-28 transition-colors duration-500 ease-soft"
              style={{ backgroundColor: color }}
            />

            {/* Divider line + icon straddling it */}
            <div className="relative">
              <div className="absolute -top-10 left-6">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-[1.4rem] border-4 border-card bg-sunken shadow-[0_8px_20px_-10px_rgba(92,58,28,0.5)] transition-colors duration-300 ease-soft hover:bg-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  title="Upload icon"
                >
                  {iconPreview ? (
                    <img src={iconPreview} className="h-full w-full object-cover" alt="icon" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-faint" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom section */}
            <div className="space-y-3 px-6 pb-6 pt-14">
              <Input
                ref={nameRef}
                placeholder="Name of collection"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Color swatches */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <div className="relative h-8 w-8">
                  <div className="pointer-events-none flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-line-strong text-faint">
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full"
                    title="Custom color"
                  />
                </div>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                    className={cn(
                      "h-8 w-8 rounded-full transition-transform duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                      color === c && "scale-110 ring-2 ring-ink/40 ring-offset-2 ring-offset-card"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {error && <p className="text-sm text-danger">{error}</p>}
              <Button
                type="submit"
                className="w-full !mt-5"
                disabled={!name.trim() || loading}
              >
                {mode === "create" ? "Create collection" : "Save changes"}
              </Button>
            </div>
          </form>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Close button */}
          <DialogPrimitive.Close className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink/20 text-card transition-colors duration-300 ease-soft hover:bg-ink/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-card">
            <X className="h-4 w-4" strokeWidth={1.5} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}
