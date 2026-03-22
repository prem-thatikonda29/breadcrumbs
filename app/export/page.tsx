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

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111]">Export</h1>
              <p className="text-sm text-[#787774] mt-0.5">
                Export your learnings as Markdown for your blog
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!markdown}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
              </Button>
              <Button size="sm" onClick={handleDownload} disabled={!markdown}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download .md</span>
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-[#787774] mb-1.5 block">Collection</label>
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {collections?.map((col) => (
                  <SelectItem key={col._id} value={col._id}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data === undefined ? (
            <div className="flex justify-center py-12">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#EAEAEA] border-t-[#111111]" />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-16 text-[#BBBBB8] border border-dashed border-[#EAEAEA] rounded-xl">
              <p className="text-sm">No learning notes found for this collection.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#EAEAEA] bg-white overflow-hidden">
              <pre className="p-5 text-xs text-[#333333] overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono max-h-[60vh] overflow-y-auto">
                {markdown}
              </pre>
            </div>
          )}
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
