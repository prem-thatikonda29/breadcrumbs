"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Archive, ArchiveRestore, BookOpen, Bookmark, ChevronRight, Download, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { collectionColor } from "@/lib/collection-colors";
import { CollectionModal } from "@/components/CollectionModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type CollectionWithIcon = Doc<"collections"> & { iconUrl: string | null };

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const NAV = [
  { href: "/app", label: "Library", icon: BookOpen },
  { href: "/export", label: "Export", icon: Download },
  { href: "/bookmarklet", label: "Bookmarklet", icon: Bookmark },
];

const menuItem =
  "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink outline-none data-[highlighted]:bg-sunken";

function CollectionDot({ col }: { col: CollectionWithIcon }) {
  if (col.iconUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={col.iconUrl} className="h-5 w-5 shrink-0 rounded-md object-cover" alt="" />;
  }
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: collectionColor(col.color) }} />
    </span>
  );
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const collections = useQuery(api.collections.list);
  const archivedCollections = useQuery(api.collections.listArchived);
  const removeCollection = useMutation(api.collections.remove);
  const archiveCollection = useMutation(api.collections.archive);
  const unarchiveCollection = useMutation(api.collections.unarchive);

  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<CollectionWithIcon | null>(null);
  const [deleting, setDeleting] = useState<CollectionWithIcon | null>(null);
  const deletingEntries = useQuery(api.entries.getByCollection, deleting ? { collectionId: deleting._id } : "skip");

  function row(col: CollectionWithIcon, archived: boolean) {
    const active = pathname === `/collections/${col._id}`;
    return (
      <div
        key={col._id}
        className={cn(
          "group relative flex items-center rounded-xl transition-colors duration-300 ease-soft",
          active ? "bg-sunken" : "hover:bg-sunken/70",
          archived && "opacity-70"
        )}
      >
        {active && <span aria-hidden="true" className="absolute -left-2 top-2 bottom-2 w-[3px] rounded-full bg-accent" />}
        <Link
          href={`/collections/${col._id}`}
          onClick={onClose}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2 text-sm",
            active ? "font-medium text-ink" : "text-muted group-hover:text-ink"
          )}
        >
          <CollectionDot col={col} />
          <span className="truncate">{col.name}</span>
        </Link>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            aria-label={`Options for ${col.name}`}
            className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-faint transition-all duration-300 ease-soft hover:bg-card hover:text-ink focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent data-[state=open]:bg-card data-[state=open]:text-ink data-[state=open]:opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={4}
              className="z-50 min-w-44 rounded-2xl bg-card p-1.5 ring-1 ring-line shadow-[0_24px_48px_-24px_rgba(92,58,28,0.4)]"
            >
              {!archived && (
                <DropdownMenu.Item className={menuItem} onSelect={() => setEditing(col)}>
                  <Pencil className="h-3.5 w-3.5 text-faint" strokeWidth={1.5} />
                  Edit
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Item
                className={menuItem}
                onSelect={() => (archived ? unarchiveCollection({ collectionId: col._id }) : archiveCollection({ collectionId: col._id }))}
              >
                {archived ? (
                  <ArchiveRestore className="h-3.5 w-3.5 text-faint" strokeWidth={1.5} />
                ) : (
                  <Archive className="h-3.5 w-3.5 text-faint" strokeWidth={1.5} />
                )}
                {archived ? "Move back" : "Archive"}
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-line" />
              <DropdownMenu.Item className={cn(menuItem, "text-danger")} onSelect={() => setDeleting(col)}>
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    );
  }

  const linkCount = deletingEntries?.length;

  return (
    <aside
      className={cn(
        "flex h-dvh flex-col bg-card ring-1 ring-line",
        // Mobile: fixed overlay, slides in from left
        "fixed left-0 top-0 z-30 w-72 transition-transform duration-500 ease-soft",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: in-flow sticky, always visible
        "md:sticky md:top-0 md:z-auto md:w-60 md:shrink-0 md:translate-x-0"
      )}
    >
      <div className="px-5 pb-4 pt-6">
        <Link href="/app" onClick={onClose} className="serif text-[22px] tracking-[-0.02em] text-ink">
          Breadcrumbs
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors duration-300 ease-soft",
                  active ? "bg-sunken font-medium text-ink" : "text-muted hover:bg-sunken/70 hover:text-ink"
                )}
              >
                {active && <span aria-hidden="true" className="absolute -left-2 top-2 bottom-2 w-[3px] rounded-full bg-accent" />}
                <Icon className={cn("h-4 w-4", active ? "text-accent" : "text-faint")} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between px-3 pb-1.5">
          <span className="text-[13px] font-medium text-faint">Collections</span>
          <CollectionModal
            mode="create"
            trigger={
              <button
                aria-label="New collection"
                title="New collection"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-faint transition-colors duration-300 ease-soft hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
              </button>
            }
          />
        </div>

        <div className="space-y-0.5">
          {collections?.map((col) => row(col, false))}
          {collections?.length === 0 && (
            <CollectionModal
              mode="create"
              trigger={
                <button className="w-full rounded-xl px-3 py-2 text-left text-[13px] leading-relaxed text-faint transition-colors duration-300 ease-soft hover:bg-sunken/70 hover:text-ink">
                  Group links by topic. <span className="text-accent">Make your first collection</span>
                </button>
              }
            />
          )}
        </div>

        {(archivedCollections?.length ?? 0) > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowArchived((v) => !v)}
              aria-expanded={showArchived}
              className="flex w-full items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] text-faint transition-colors duration-300 ease-soft hover:text-ink"
            >
              <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-300 ease-soft", showArchived && "rotate-90")} strokeWidth={1.5} />
              Archived ({archivedCollections!.length})
            </button>
            {showArchived && <div className="mt-0.5 space-y-0.5">{archivedCollections!.map((col) => row(col, true))}</div>}
          </div>
        )}
      </nav>

      {editing && (
        <CollectionModal
          key={editing._id}
          mode="edit"
          collection={editing}
          open
          onOpenChange={(open) => !open && setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "collection"}?`}
        body={
          linkCount === undefined
            ? "This also deletes the links in it and their notes. You can't undo this."
            : linkCount === 0
              ? "It's empty, so nothing else is deleted. You can't undo this."
              : `This also deletes its ${linkCount} ${linkCount === 1 ? "link" : "links"} and their notes. You can't undo this. If you might want them later, archive it instead.`
        }
        confirmLabel="Delete collection"
        onConfirm={() => deleting && removeCollection({ collectionId: deleting._id })}
      />
    </aside>
  );
}
