import { cn } from "@/lib/utils";

interface Props {
  title: string;
  body: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, body, children, className }: Props) {
  return (
    <div className={cn("rounded-[1.75rem] bg-ink/[0.03] p-1.5 ring-1 ring-line", className)}>
      <div className="rounded-[calc(1.75rem-0.375rem)] bg-card px-6 py-12 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:px-10 sm:py-16">
        <h2 className="serif text-[26px] leading-tight tracking-[-0.02em] text-ink">{title}</h2>
        <p className="mx-auto mt-3 max-w-[42ch] text-[15px] leading-relaxed text-muted">{body}</p>
        {children && <div className="mt-7 flex flex-wrap items-center justify-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
