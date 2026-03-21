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

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
];

interface CollectionData {
  _id: Id<"collections">;
  name: string;
  color?: string;
  description?: string;
  iconStorageId?: Id<"_storage">;
  iconUrl?: string | null;
}

interface Props {
  trigger: React.ReactNode;
  mode: "create" | "edit";
  collection?: CollectionData;
}

export function CollectionModal({ trigger, mode, collection }: Props) {
  const createCollection = useMutation(api.collections.create);
  const updateCollection = useMutation(api.collections.update);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen && mode === "edit" && collection) {
      setName(collection.name);
      setDescription(collection.description ?? "");
      setColor(collection.color ?? COLORS[0]);
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
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
    e.target.value = "";
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl overflow-hidden focus:outline-none">
          <DialogPrimitive.Title className="sr-only">
            {mode === "create" ? "New Collection" : "Edit Collection"}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {mode === "create" ? "Create a new collection" : "Edit collection details"}
          </DialogPrimitive.Description>
          <form onSubmit={handleSubmit}>
            {/* Top colored section */}
            <div
              className="h-28 transition-colors duration-200"
              style={{ backgroundColor: color }}
            />

            {/* Divider line + icon straddling it */}
            <div className="border-t border-slate-200 relative">
              <div className="absolute -top-10 left-6">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 w-20 rounded-full border-4 border-white bg-slate-100 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors shadow-sm"
                  title="Upload icon"
                >
                  {iconPreview ? (
                    <img src={iconPreview} className="h-full w-full object-cover" alt="icon" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom section */}
            <div className="pt-14 px-6 pb-6 space-y-3">
              <Input
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
                  <div className="h-8 w-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 pointer-events-none">
                    <Plus className="h-4 w-4" />
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
                    className={cn(
                      "h-8 w-8 rounded-full transition-transform",
                      color === c && "ring-2 ring-offset-2 ring-slate-400 scale-110"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full !mt-5"
                disabled={!name.trim() || loading}
              >
                {mode === "create" ? "Create Collection" : "Save Changes"}
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
          <DialogPrimitive.Close className="absolute right-3 top-3 z-10 h-7 w-7 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors focus:outline-none">
            <X className="h-3.5 w-3.5 text-white" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}
