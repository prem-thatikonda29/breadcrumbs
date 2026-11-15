"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { collectionColor } from "@/lib/collection-colors";

type PickableCollection = { _id: string; name: string; color?: string };

interface Props<C extends PickableCollection> {
  collections: C[];
  onPick: (collection: C) => void;
  disabled?: boolean;
}

/** Search box plus an always-open list. Type to filter, arrows to move, Enter or click to pick. */
export function CollectionPicker<C extends PickableCollection>({ collections, onPick, disabled }: Props<C>) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? collections.filter((c) => c.name.toLowerCase().includes(q)) : collections;
  }, [collections, query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function pick(c: C | undefined) {
    if (c && !disabled) onPick(c);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(filtered[active]);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-line-strong">
      <div className="flex items-center gap-2.5 border-b border-line px-3.5">
        <Search className="h-4 w-4 shrink-0 text-faint" strokeWidth={1.5} />
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search collections"
          aria-label="Search collections"
          role="combobox"
          aria-expanded
          aria-controls="collection-picker-list"
          aria-activedescendant={filtered[active] ? `collection-option-${filtered[active]._id}` : undefined}
          className="h-11 w-full bg-transparent text-sm text-ink placeholder:text-ghost focus:outline-none"
        />
      </div>
      <ul ref={listRef} id="collection-picker-list" role="listbox" className="max-h-64 overflow-y-auto p-1.5">
        {filtered.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-faint">No collections match “{query.trim()}”</li>
        ) : (
          filtered.map((c, i) => (
            <li
              key={c._id}
              id={`collection-option-${c._id}`}
              data-index={i}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => pick(c)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink",
                i === active && "bg-sunken",
                disabled && "pointer-events-none opacity-50"
              )}
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: collectionColor(c.color) }} />
              <span className="truncate">{c.name}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
