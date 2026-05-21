import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "pos" | "language" | "tag" | "default";
  className?: string;
}

const variants = {
  pos: "bg-kola-100 text-kola-800 dark:bg-kola-900 dark:text-kola-200",
  language: "bg-savanna-100 text-savanna-800 dark:bg-savanna-900 dark:text-savanna-200",
  tag: "bg-earth-100 text-earth-800 dark:bg-earth-900 dark:text-earth-200",
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-mono tracking-wide",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
