import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function WordCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-5 w-14" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export function PhraseCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
      <Skeleton className="h-6 w-48 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
