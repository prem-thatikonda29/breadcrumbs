"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Inbox, Download, Bookmark, Trash2, Pencil, Archive, ArchiveX } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CollectionModal } from "@/components/CollectionModal";

export function Sidebar() {
  const pathname = usePathname();
  const collections = useQuery(api.collections.list);
  const archivedCollections = useQuery(api.collections.listArchived);
  const removeCollection = useMutation(api.collections.remove);
  const archiveCollection = useMutation(api.collections.archive);
  const unarchiveCollection = useMutation(api.collections.unarchive);
  const [showArchived, setShowArchived] = useState(false);

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white h-screen sticky top-0 flex flex-col">
      <div className="px-4 py-5 border-b border-slate-100">
        <span className="text-lg font-bold text-slate-900 tracking-tight">Breadcrumbs</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Inbox className="h-4 w-4" />
          Inbox
        </Link>
        <Link
          href="/export"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/export"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Download className="h-4 w-4" />
          Export
        </Link>
        <Link
          href="/bookmarklet"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/bookmarklet"
              ? "bg-slate-100 text-slate-900"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Bookmark className="h-4 w-4" />
          Bookmarklet
        </Link>

        <div className="pt-3 pb-1 px-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Collections
          </span>
        </div>

        {collections?.map((col) => (
          <div
            key={col._id}
            className={cn(
              "group flex items-center rounded-lg transition-colors",
              pathname === `/collections/${col._id}`
                ? "bg-slate-100"
                : "hover:bg-slate-50"
            )}
          >
            <Link
              href={`/collections/${col._id}`}
              className={cn(
                "flex flex-1 items-center gap-2.5 px-3 py-2 text-sm font-medium min-w-0",
                pathname === `/collections/${col._id}`
                  ? "text-slate-900"
                  : "text-slate-600 group-hover:text-slate-900"
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
                  <button className="h-6 w-6 flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-700 transition-colors">
                    <Pencil className="h-3 w-3" />
                  </button>
                }
              />
              <button
                onClick={() => archiveCollection({ collectionId: col._id })}
                className="h-6 w-6 flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
                title="Archive"
              >
                <Archive className="h-3 w-3" />
              </button>
              <button
                onClick={() => removeCollection({ collectionId: col._id })}
                className="h-6 w-6 flex items-center justify-center cursor-pointer text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        {collections?.length === 0 && (archivedCollections?.length ?? 0) === 0 && (
          <p className="px-3 py-2 text-xs text-slate-400">No collections yet</p>
        )}

        {(archivedCollections?.length ?? 0) > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowArchived((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-400 hover:text-slate-600 transition-colors w-full"
            >
              <Archive className="h-3 w-3" />
              Archived ({archivedCollections!.length})
            </button>
            {showArchived && archivedCollections!.map((col) => (
              <div key={col._id} className="group flex items-center rounded-lg hover:bg-slate-50 transition-colors opacity-60">
                <Link
                  href={`/collections/${col._id}`}
                  className="flex flex-1 items-center gap-2.5 px-3 py-2 text-sm font-medium min-w-0 text-slate-500"
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
                    className="h-6 w-6 flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
                    title="Unarchive"
                  >
                    <ArchiveX className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeCollection({ collectionId: col._id })}
                    className="h-6 w-6 flex items-center justify-center cursor-pointer text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-slate-100">
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
