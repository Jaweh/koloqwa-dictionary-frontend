"use client";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  value, onChange, placeholder = "Search...",
  loading = false, size = "md", className, autoFocus
}: SearchInputProps) {
  const heights = { sm: "h-10", md: "h-12", lg: "h-14" };
  const textSizes = { sm: "text-sm", md: "text-base", lg: "text-lg" };

  return (
    <div className={cn("relative", className)}>
      {/* Search icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--text-muted)" }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "w-full pl-11 pr-10 rounded-2xl border transition-all duration-200 outline-none",
          "focus:ring-2",
          heights[size],
          textSizes[size]
        )}
        style={{
          background: "var(--bg-primary)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
          // @ts-ignore
          "--tw-ring-color": "var(--accent)",
        }}
      />

      {/* Loading / clear */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
        ) : value ? (
          <button onClick={() => onChange("")}
            className="w-5 h-5 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "var(--border)", color: "var(--text-muted)" }}>
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
