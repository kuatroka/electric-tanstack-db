import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface ErrorCardProps {
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorCard({
  title = "Error",
  message,
  details,
  onRetry,
  retryLabel = "Try Again",
  className,
}: ErrorCardProps) {
  return (
    <Card className={cn("border-destructive/50 bg-destructive/5", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-destructive text-lg">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-foreground">{message}</p>
        {details && (
          <pre className="mt-2 rounded-md bg-muted p-3 text-xs text-muted-foreground overflow-auto max-h-32">
            {details}
          </pre>
        )}
      </CardContent>
      {onRetry && (
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {retryLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
