"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Copy, Check } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import { collectionColor } from "@/lib/collection-colors";
import { useState } from "react";
import { formatDate, starsFromRating } from "@/lib/utils";

export default function ExportPage() {
  const collections = useQuery(api.collections.list);
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [copied, setCopied] = useState(false);

  const data = useQuery(
    api.learnings.getUserLearnings,
    selectedCollection === "all"
      ? {}
      : { collectionId: selectedCollection as Id<"collections"> }
  );

  const collection = collections?.find((c) => c._id === selectedCollection);
  const markdown = generateMarkdown(data ?? [], collection?.name ?? "All Collections");

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `breadcrumbs-${selectedCollection === "all" ? "all" : collection?.name ?? "export"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const empty = !data || data.length === 0;
  const noteCount = data?.reduce((n, row) => n + row.learnings.length, 0) ?? 0;

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 sm:px-6 sm:pt-12">
          <h1 className="serif text-[36px] leading-none tracking-[-0.03em] text-ink sm:text-[44px]">Export</h1>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted">
            Your notes as Markdown, grouped by link. Paste them into a doc or a blog post, or keep a copy.
          </p>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div className="w-full sm:w-64">
              <label htmlFor="export-collection" className="mb-1.5 block text-[13px] font-medium text-ink-2">
                Collection
              </label>
              <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                <SelectTrigger id="export-collection">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All collections</SelectItem>
                  {collections?.map((col) => (
                    <SelectItem key={col._id} value={col._id}>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: collectionColor(col.color) }} />
                        {col.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy} disabled={empty}>
                {copied ? <Check className="h-4 w-4 text-accent" strokeWidth={1.75} /> : <Copy className="h-4 w-4" strokeWidth={1.5} />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button onClick={handleDownload} disabled={empty}>
                <Download className="h-4 w-4" strokeWidth={1.5} />
                Download .md
              </Button>
            </div>
          </div>

          <div className="mt-6">
            {data === undefined ? (
              <Skeleton className="h-64 w-full rounded-[1.75rem]" />
            ) : data.length === 0 ? (
              <EmptyState
                title="No notes to export yet"
                body="Notes you write on a link show up here. Open something you've explored and add what you took away from it."
              >
                <Link href="/app" className="text-sm font-medium text-accent underline-offset-4 hover:underline">
                  Go to your library
                </Link>
              </EmptyState>
            ) : (
              <>
                <p className="mb-2 text-[13px] tabular-nums text-faint">
                  {noteCount} {noteCount === 1 ? "note" : "notes"} from {data.length} {data.length === 1 ? "link" : "links"}
                </p>
                <div className="rounded-[1.75rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
                  <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-[calc(1.75rem-0.375rem)] bg-card p-6 font-mono text-[12.5px] leading-relaxed text-ink-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    {markdown}
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function generateMarkdown(
  data: Array<{ entry: { title: string; url: string; status: string; dateAdded: number; dateExplored?: number }; learnings: Array<{ content: string; rating?: number; createdAt: number }> }>,
  collectionName: string
): string {
  if (data.length === 0) return "";

  const lines: string[] = [
    `# ${collectionName} — Learning Journey`,
    "",
    `*Exported ${formatDate(Date.now())}*`,
    "",
  ];

  data.forEach(({ entry, learnings }, i) => {
    lines.push(`## ${i + 1}. ${entry.title}`);
    lines.push(`**URL:** ${entry.url}`);
    lines.push(`**Status:** ${entry.status === "explored" ? "Explored" : "Not explored"}`);
    lines.push(`**Added:** ${formatDate(entry.dateAdded)}`);
    if (entry.dateExplored) {
      lines.push(`**Explored:** ${formatDate(entry.dateExplored)}`);
    }
    lines.push("");

    learnings.forEach((learning, j) => {
      const stars = starsFromRating(learning.rating);
      lines.push(`### Note ${j + 1} — ${formatDate(learning.createdAt)}${stars ? ` ${stars}` : ""}`);
      lines.push("");
      lines.push(learning.content);
      lines.push("");
    });

    lines.push("---");
    lines.push("");
  });

  return lines.join("\n");
}
