"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, BookOpen, Download, Bookmark, Trash2, Pencil, Archive, ArchiveX } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CollectionModal } from "@/components/CollectionModal";

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const collections = useQuery(api.collections.list);
  const archivedCollections = useQuery(api.collections.listArchived);
  const removeCollection = useMutation(api.collections.remove);
  const archiveCollection = useMutation(api.collections.archive);
  const unarchiveCollection = useMutation(api.collections.unarchive);
  const [showArchived, setShowArchived] = useState(false);

  return (
    <aside
      className={cn(
        // Shared
        "flex flex-col bg-white border-r border-[#EAEAEA] h-dvh",
        // Mobile: fixed overlay, slides in from left
        "fixed top-0 left-0 z-30 w-72 transition-transform duration-200 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: in-flow sticky, always visible
        "md:sticky md:top-0 md:w-56 md:shrink-0 md:translate-x-0 md:z-auto"
      )}
    >
      <div className="px-4 py-5 border-b border-[#EAEAEA]">
        <span className="text-lg font-bold text-[#111111] tracking-tight">Breadcrumbs</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <Link
          href="/app"
          onClick={onClose}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/app"
              ? "bg-[#F7F6F3] text-[#111111]"
              : "text-[#787774] hover:bg-[#F7F6F3] hover:text-[#111111]"
          )}
        >
          <BookOpen className="h-4 w-4" />
          Library
        </Link>
        <Link
          href="/export"
          onClick={onClose}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/export"
              ? "bg-[#F7F6F3] text-[#111111]"
              : "text-[#787774] hover:bg-[#F7F6F3] hover:text-[#111111]"
          )}
        >
          <Download className="h-4 w-4" />
          Export
        </Link>
        <Link
          href="/bookmarklet"
          onClick={onClose}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/bookmarklet"
              ? "bg-[#F7F6F3] text-[#111111]"
              : "text-[#787774] hover:bg-[#F7F6F3] hover:text-[#111111]"
          )}
        >
          <Bookmark className="h-4 w-4" />
          Bookmarklet
        </Link>

        <div className="pt-3 pb-1 px-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#BBBBB8]">
            Collections
          </span>
        </div>

        {collections?.map((col) => (
          <div
            key={col._id}
            className={cn(
              "group flex items-center rounded-lg transition-colors",
              pathname === `/collections/${col._id}`
                ? "bg-[#F7F6F3]"
                : "hover:bg-[#F7F6F3]"
            )}
          >
            <Link
              href={`/collections/${col._id}`}
              onClick={onClose}
              className={cn(
                "flex flex-1 items-center gap-2.5 px-3 py-2 text-sm font-medium min-w-0",
                pathname === `/collections/${col._id}`
                  ? "text-[#111111]"
                  : "text-[#787774] group-hover:text-[#111111]"
              )}
            >
              {col.iconUrl ? (
                <img
                  src={col.iconUrl}
                  className="h-4 w-4 rounded-full object-cover shrink-0"
                  alt=""
                />
              ) : (
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: col.color ?? "#94a3b8" }}
                />
              )}
              <span className="truncate">{col.name}</span>
            </Link>
            <div className="mr-1 hidden group-hover:flex items-center gap-0.5">
              <CollectionModal
                mode="edit"
                collection={col}
                trigger={
                  <button className="h-6 w-6 flex items-center justify-center cursor-pointer text-[#BBBBB8] hover:text-[#111111] transition-colors">
                    <Pencil className="h-3 w-3" />
                  </button>
                }
              />
              <button
                onClick={() => archiveCollection({ collectionId: col._id })}
                className="h-6 w-6 flex items-center justify-center cursor-pointer text-[#BBBBB8] hover:text-[#111111] transition-colors"
                title="Archive"
              >
                <Archive className="h-3 w-3" />
              </button>
              <button
                onClick={() => removeCollection({ collectionId: col._id })}
                className="h-6 w-6 flex items-center justify-center cursor-pointer text-[#BBBBB8] hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        {collections?.length === 0 && (archivedCollections?.length ?? 0) === 0 && (
          <p className="px-3 py-2 text-xs text-[#BBBBB8]">No collections yet</p>
        )}

        {(archivedCollections?.length ?? 0) > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowArchived((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-[#BBBBB8] hover:text-[#787774] transition-colors w-full"
            >
              <Archive className="h-3 w-3" />
              Archived ({archivedCollections!.length})
            </button>
            {showArchived && archivedCollections!.map((col) => (
              <div key={col._id} className="group flex items-center rounded-lg hover:bg-[#F7F6F3] transition-colors opacity-60">
                <Link
                  href={`/collections/${col._id}`}
                  onClick={onClose}
                  className="flex flex-1 items-center gap-2.5 px-3 py-2 text-sm font-medium min-w-0 text-[#787774]"
                >
                  {col.iconUrl ? (
                    <img src={col.iconUrl} className="h-4 w-4 rounded-full object-cover shrink-0" alt="" />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: col.color ?? "#94a3b8" }} />
                  )}
                  <span className="truncate">{col.name}</span>
                </Link>
                <div className="mr-1 hidden group-hover:flex items-center gap-0.5">
                  <button
                    onClick={() => unarchiveCollection({ collectionId: col._id })}
                    className="h-6 w-6 flex items-center justify-center cursor-pointer text-[#BBBBB8] hover:text-[#111111] transition-colors"
                    title="Unarchive"
                  >
                    <ArchiveX className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeCollection({ collectionId: col._id })}
                    className="h-6 w-6 flex items-center justify-center cursor-pointer text-[#BBBBB8] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-[#EAEAEA]">
        <CollectionModal
          mode="create"
          trigger={
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              New Collection
            </Button>
          }
        />
      </div>
    </aside>
  );
}
