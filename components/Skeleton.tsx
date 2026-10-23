import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-lg", className)} />;
}

// Placeholder shaped like a list of entry cards.
export function EntryListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2.5" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="rounded-2xl bg-card px-5 py-4 ring-1 ring-line">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="mt-3 h-3 w-2/5" />
        </div>
      ))}
    </div>
  );
}
