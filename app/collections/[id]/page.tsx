"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { EntryCard } from "@/components/EntryCard";
import { AddEntryDialog } from "@/components/AddEntryDialog";
import { BulkBar } from "@/components/BulkBar";
import { SegmentedTabs } from "@/components/SegmentedTabs";
import { EmptyState } from "@/components/EmptyState";
import { EntryListSkeleton, Skeleton } from "@/components/Skeleton";
import { ArrowLeft, GripVertical } from "lucide-react";
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
import { collectionColor } from "@/lib/collection-colors";

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
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("group/row relative flex items-center gap-1", isDragging && "z-10")}>
      <button
        {...attributes}
        {...listeners}
        className="hidden shrink-0 cursor-grab touch-none rounded-lg p-1 text-ghost transition-colors duration-300 ease-soft hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:cursor-grabbing sm:block"
        title="Drag to reorder"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" strokeWidth={1.5} />
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
  const archived = useQuery(api.collections.listArchived);
  const entries = useQuery(api.entries.getByCollection, { collectionId });
  const reorder = useMutation(api.entries.reorder);
  const bulkMarkExplored = useMutation(api.entries.bulkMarkExplored);
  const bulkRemove = useMutation(api.entries.bulkRemove);
  const bulkMove = useMutation(api.entries.bulkMove);

  const [section, setSection] = useState<"unexplored" | "explored">("unexplored");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const collection = collections?.find((c) => c._id === collectionId) ?? archived?.find((c) => c._id === collectionId);
  const unexplored = entries?.filter((e) => e.status === "not_explored") ?? [];
  const explored = entries?.filter((e) => e.status === "explored") ?? [];
  const currentList = section === "unexplored" ? unexplored : explored;
  const otherCollections = collections?.filter((c) => c._id !== collectionId) ?? [];

  const sensors = useSensors(
    // A small drag distance keeps taps and scrolls from starting a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
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

  async function handleBulkMove(targetId: string) {
    await bulkMove({ entryIds: [...selectedIds] as Id<"entries">[], collectionId: targetId as Id<"collections"> });
    clearSelection();
  }

  const selectedCount = selectedIds.size;

  const loaded = entries !== undefined && collections !== undefined && archived !== undefined;

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 pb-32 pt-6 sm:px-6 sm:pt-10">
          <Link
            href="/app"
            className="mb-6 inline-flex items-center gap-1.5 rounded-lg text-sm text-faint transition-colors duration-300 ease-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Library
          </Link>

          <div className="mb-8 flex items-end justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              {!loaded ? (
                <Skeleton className="h-14 w-14 shrink-0 rounded-[1.1rem]" />
              ) : collection?.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={collection.iconUrl} className="h-14 w-14 shrink-0 rounded-[1.1rem] object-cover ring-1 ring-line" alt="" />
              ) : (
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.1rem] font-display text-[26px] text-card"
                  style={{ backgroundColor: collectionColor(collection?.color) }}
                >
                  {collection?.name?.[0]?.toUpperCase() ?? ""}
                </span>
              )}
              <div className="min-w-0">
                {loaded ? (
                  <h1 className="serif truncate text-[32px] leading-tight tracking-[-0.03em] text-ink sm:text-[40px]">
                    {collection?.name ?? "Collection not found"}
                  </h1>
                ) : (
                  <Skeleton className="h-9 w-48" />
                )}
                <p className="mt-1 truncate text-sm text-faint">
                  {collection?.archived ? "Archived · " : ""}
                  {collection?.description ?? (loaded ? `${entries?.length ?? 0} ${entries?.length === 1 ? "link" : "links"}` : "\u00a0")}
                </p>
              </div>
            </div>
            <div className="shrink-0">{collectionId && <AddEntryDialog defaultCollectionId={collectionId} />}</div>
          </div>

          <SegmentedTabs
            className="mb-5"
            value={section}
            onChange={(key) => {
              setSection(key);
              clearSelection();
            }}
            tabs={[
              { key: "unexplored", label: "To explore", count: unexplored.length },
              { key: "explored", label: "Explored", count: explored.length },
            ]}
          />

          {entries === undefined ? (
            <EntryListSkeleton />
          ) : section === "unexplored" ? (
            unexplored.length === 0 ? (
              <EmptyState
                title={explored.length > 0 ? "All caught up" : "Nothing here yet"}
                body={
                  explored.length > 0
                    ? "You've explored everything in this collection."
                    : "Save a link straight into this collection, or move links here from your library."
                }
              >
                {explored.length === 0 && collectionId && <AddEntryDialog defaultCollectionId={collectionId} />}
              </EmptyState>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={unexplored.map((e) => e._id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2.5 sm:-ml-7">
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
            )
          ) : explored.length === 0 ? (
            <EmptyState title="Nothing explored yet" body="When you mark a link here as explored, it moves to this tab." />
          ) : (
            <div className="space-y-2.5">
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
        </div>

        {selectedCount > 0 && (
          <BulkBar
            count={selectedCount}
            collections={otherCollections}
            onMarkExplored={section === "unexplored" ? handleBulkExplored : undefined}
            onMove={handleBulkMove}
            onDelete={handleBulkDelete}
            onClear={clearSelection}
          />
        )}
      </main>
    </AppShell>
  );
}
