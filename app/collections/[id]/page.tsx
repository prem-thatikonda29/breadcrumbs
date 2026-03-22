"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { EntryCard } from "@/components/EntryCard";
import { AddEntryDialog } from "@/components/AddEntryDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, FolderOpen, GripVertical, Trash2, CheckCircle, FolderInput } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

function SortableRow({
  entry,
  selected,
  onToggleSelect,
}: {
  entry: Doc<"entries">;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry._id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-1">
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors p-1"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <EntryCard
          entry={entry}
          selectable
          selected={selected}
          onToggleSelect={onToggleSelect}
        />
      </div>
    </div>
  );
}

export default function CollectionPage() {
  const params = useParams();
  const collectionId = params.id as Id<"collections">;
  const collections = useQuery(api.collections.list);
  const entries = useQuery(api.entries.getByCollection, { collectionId });
  const reorder = useMutation(api.entries.reorder);
  const bulkMarkExplored = useMutation(api.entries.bulkMarkExplored);
  const bulkRemove = useMutation(api.entries.bulkRemove);
  const bulkMove = useMutation(api.entries.bulkMove);

  const [section, setSection] = useState<"unexplored" | "explored">("unexplored");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMoveTarget, setBulkMoveTarget] = useState("");

  const collection = collections?.find((c) => c._id === collectionId);
  const unexplored = entries?.filter((e) => e.status === "not_explored") ?? [];
  const explored = entries?.filter((e) => e.status === "explored") ?? [];
  const currentList = section === "unexplored" ? unexplored : explored;
  const otherCollections = collections?.filter((c) => c._id !== collectionId) ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setBulkMoveTarget("");
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = currentList.map((e) => e._id);
    const oldIndex = ids.indexOf(active.id as Id<"entries">);
    const newIndex = ids.indexOf(over.id as Id<"entries">);
    const reordered = arrayMove(ids, oldIndex, newIndex);
    await reorder({ orderedIds: reordered });
  }

  async function handleBulkExplored() {
    await bulkMarkExplored({ entryIds: [...selectedIds] as Id<"entries">[] });
    clearSelection();
  }

  async function handleBulkDelete() {
    await bulkRemove({ entryIds: [...selectedIds] as Id<"entries">[] });
    clearSelection();
  }

  async function handleBulkMove() {
    if (!bulkMoveTarget) return;
    await bulkMove({ entryIds: [...selectedIds] as Id<"entries">[], collectionId: bulkMoveTarget as Id<"collections"> });
    clearSelection();
  }

  const selectedCount = selectedIds.size;

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-6">
            <Link href="/app">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {collection && (
                collection.iconUrl ? (
                  <img
                    src={collection.iconUrl}
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover shrink-0"
                    alt=""
                  />
                ) : (
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: collection.color ?? "#94a3b8" }}
                  />
                )
              )}
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight truncate">
                  {collection?.name ?? "Collection"}
                </h1>
                {collection?.description && (
                  <p className="text-sm text-slate-500 truncate">{collection.description}</p>
                )}
              </div>
              <span className="text-slate-400 text-sm shrink-0">
                ({(entries?.length ?? 0)})
              </span>
            </div>
            <div className="shrink-0">
              {collectionId && <AddEntryDialog defaultCollectionId={collectionId} />}
            </div>
          </div>

          <div className="flex gap-1 mb-6 border-b border-slate-200">
            <button
              onClick={() => { setSection("unexplored"); clearSelection(); }}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                section === "unexplored"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              To Explore ({unexplored.length})
            </button>
            <button
              onClick={() => { setSection("explored"); clearSelection(); }}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                section === "explored"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Explored ({explored.length})
            </button>
          </div>

          {entries === undefined ? (
            <div className="flex justify-center py-12">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            </div>
          ) : (
            <div className="space-y-2">
              {section === "unexplored" && (
                <>
                  {unexplored.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Nothing to explore here yet.</p>
                    </div>
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={unexplored.map((e) => e._id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {unexplored.map((entry) => (
                            <SortableRow
                              key={entry._id}
                              entry={entry}
                              selected={selectedIds.has(entry._id)}
                              onToggleSelect={() => toggleSelect(entry._id)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </>
              )}
              {section === "explored" && (
                <>
                  {explored.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-sm">Nothing explored yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {explored.map((entry) => (
                        <EntryCard
                          key={entry._id}
                          entry={entry}
                          selectable
                          selected={selectedIds.has(entry._id)}
                          onToggleSelect={() => toggleSelect(entry._id)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white shadow-lg px-4 py-3">
              <span className="text-sm font-medium text-slate-700 mr-1">
                {selectedCount} selected
              </span>
              {section === "unexplored" && (
                <Button size="sm" variant="outline" onClick={handleBulkExplored} className="gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Mark explored
                </Button>
              )}
              {otherCollections.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Select value={bulkMoveTarget} onValueChange={setBulkMoveTarget}>
                    <SelectTrigger className="h-8 text-xs w-32">
                      <SelectValue placeholder="Move to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {otherCollections.map((col) => (
                        <SelectItem key={col._id} value={col._id}>
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color ?? "#94a3b8" }} />
                            {col.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" disabled={!bulkMoveTarget} onClick={handleBulkMove} className="gap-1.5">
                    <FolderInput className="h-3.5 w-3.5" />
                    Move
                  </Button>
                </div>
              )}
              <Button size="sm" variant="outline" onClick={handleBulkDelete} className="gap-1.5 text-red-500 hover:text-red-600 hover:border-red-300">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
              <button
                onClick={clearSelection}
                className="text-xs text-slate-400 hover:text-slate-600 ml-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
