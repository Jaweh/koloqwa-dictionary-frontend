import { Badge } from "@/components/ui/Badge";
import type { Definition } from "@/types/dictionary";

export function DefinitionBlock({ definition, index }: { definition: Definition; index: number }) {
  return (
    <div className="group">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-mono text-sm font-medium flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
          style={{ background: "var(--accent)", color: "white" }}>
          {index + 1}
        </span>
        <p className="text-base leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {definition.definition}
        </p>
      </div>

      {/* Register / usage note */}
      <div className="ml-9 space-y-2">
        {definition.register && (
          <Badge variant="tag">{definition.register}</Badge>
        )}
        {definition.usageNote && (
          <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
            {definition.usageNote}
          </p>
        )}

        {/* Examples */}
        {definition.examples.length > 0 && (
          <div className="space-y-2 mt-3">
            {definition.examples.map(ex => (
              <div key={ex.id} className="pl-4 border-l-2"
                style={{ borderColor: "var(--accent)" }}>
                <p className="text-sm font-medium italic" style={{ color: "var(--text-primary)" }}>
                  &ldquo;{ex.sentence}&rdquo;
                </p>
                {ex.translation && (
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {ex.translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
