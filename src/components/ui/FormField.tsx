import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, required, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {label}
        {required && <span className="ml-1" style={{ color: "#BF0A30" }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>
      )}
      {error && (
        <p className="text-xs font-medium" style={{ color: "#BF0A30" }}>{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn("w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all", className)}
      style={{
        background: "var(--bg-primary)",
        borderColor: error ? "#BF0A30" : "var(--border)",
        color: "var(--text-primary)",
      }}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={cn("w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none", className)}
      style={{
        background: "var(--bg-primary)",
        borderColor: error ? "#BF0A30" : "var(--border)",
        color: "var(--text-primary)",
      }}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={cn("w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all", className)}
      style={{
        background: "var(--bg-primary)",
        borderColor: error ? "#BF0A30" : "var(--border)",
        color: "var(--text-primary)",
      }}>
      {children}
    </select>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
}

export function Button({ loading, variant = "primary", fullWidth, children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "h-11 px-6 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
        fullWidth && "w-full",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      style={{
        background: variant === "primary" ? "var(--accent)" : "var(--bg-secondary)",
        color: variant === "primary" ? "white" : "var(--text-secondary)",
        border: variant === "ghost" ? "1px solid var(--border)" : "none",
      }}>
      {loading && (
        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "currentColor", borderTopColor: "transparent" }} />
      )}
      {children}
    </button>
  );
}
