import { cn } from "@/lib/utils";

export type SpinnerSize = "sm" | "md" | "lg";

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  text?: string;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
};

const textSizeClasses: Record<SpinnerSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function LoadingSpinner({ size = "md", text, className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-primary border-t-transparent",
          sizeClasses[size]
        )}
        role="status"
        aria-label={text || "Loading"}
      />
      {text && (
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );
}
