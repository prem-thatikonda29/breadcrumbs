"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Sidebar } from "@/components/Sidebar";
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Export</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Export your learnings as Markdown for your blog
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!markdown}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button size="sm" onClick={handleDownload} disabled={!markdown}>
                <Download className="h-4 w-4" />
                Download .md
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-slate-600 mb-1.5 block">Collection</label>
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
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <p className="text-sm">No learning notes found for this collection.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <pre className="p-5 text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono max-h-[60vh] overflow-y-auto">
                {markdown}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
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
