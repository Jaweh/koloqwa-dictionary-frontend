"use client";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface SearchTabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export function SearchTabs({ tabs, active, onChange }: SearchTabsProps) {
  return (
    <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          )}
          style={{
            background: active === tab.id ? "var(--bg-primary)" : "transparent",
            color: active === tab.id ? "var(--accent)" : "var(--text-muted)",
            boxShadow: active === tab.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}>
          {tab.label}
          {tab.count !== undefined && (
            <span className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ background: active === tab.id ? "var(--accent)" : "var(--border)", color: active === tab.id ? "white" : "var(--text-muted)" }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
