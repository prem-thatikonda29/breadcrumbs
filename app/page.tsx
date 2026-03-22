import Link from "next/link";
import { BookOpen, Bookmark, FileText, FolderOpen, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-[#faf9f7]/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-700" />
            <span className="font-bold text-slate-900 tracking-tight">Breadcrumbs</span>
          </div>
          <Link href="/sign-in">
            <Button variant="outline" size="sm">Sign in</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 mb-8 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Personal knowledge tracker
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
          Save links.<br />
          <span className="text-slate-400">Actually come back to them.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Breadcrumbs helps you capture what you want to explore, build a trail of what you've learned, and turn saved links into real knowledge.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/sign-in">
            <Button size="lg" className="gap-2">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">How it works</h2>
          <p className="text-slate-500 text-center mb-14 text-sm">Three steps. No friction.</p>
          <div className="grid sm:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold mb-4">1</div>
              <h3 className="font-semibold text-slate-900 mb-2">Save</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Use the one-click bookmarklet or PWA to save any link instantly — from any browser, any device.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold mb-4">2</div>
              <h3 className="font-semibold text-slate-900 mb-2">Explore</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Work through your library at your own pace. Organize by collections, filter, and mark things explored as you go.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold mb-4">3</div>
              <h3 className="font-semibold text-slate-900 mb-2">Learn</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Add notes and star ratings to each link. Export your learnings as Markdown — ready to paste into a blog post.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="border-t border-slate-200 bg-[#faf9f7]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">Everything you need</h2>
          <p className="text-slate-500 text-center mb-14 text-sm">Built for the way curious people actually learn.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                <FolderOpen className="h-4.5 w-4.5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">Collections</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Group links by topic, project, or goal. Color-code them, add descriptions, archive when done.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                <FileText className="h-4.5 w-4.5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">Learning notes</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Capture key insights as you explore each link. Rate them 1–5 stars. Your notes live alongside the source.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                <Bookmark className="h-4.5 w-4.5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">One-click bookmarklet</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Save any page from any browser in one click — no extension needed. Install once, use everywhere.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                <Check className="h-4.5 w-4.5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">Markdown export</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Export everything you've learned from a collection as formatted Markdown. One click from your notes to your blog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-t border-slate-200 bg-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start leaving breadcrumbs.</h2>
          <p className="text-slate-400 mb-8">Free to use. Sign in with Google.</p>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 hover:text-white gap-2">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-500 font-medium">Breadcrumbs</span>
          </div>
          <p className="text-xs text-slate-600">Built for curious minds.</p>
        </div>
      </footer>
    </div>
  );
}
