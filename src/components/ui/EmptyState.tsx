interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = "📖" }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display text-xl font-semibold mb-2"
        style={{ color: "var(--text-primary)" }}>{title}</h3>
      <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>{description}</p>
    </div>
  );
}
