"use client";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { setProductPublished } from "@/app/actions/publish";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PublishToggleProps {
  productId: number;
  isPublished: boolean;
  title?: string;
  showBadge?: boolean;
  compact?: boolean;
  className?: string;
  onVisibilityChange?: () => void | Promise<void>;
}

export function PublishToggle({
  productId,
  isPublished,
  title,
  showBadge = false,
  compact = false,
  className,
  onVisibilityChange,
}: PublishToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        compact ? "gap-1.5" : "gap-2.5",
        className,
      )}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {showBadge && (
        <Badge
          variant="outline"
          className={cn(
            "border text-xs font-medium",
            isPublished
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-400",
          )}
        >
          {isPublished ? (
            <>
              <Eye className="size-3" />
              Published
            </>
          ) : (
            <>
              <EyeOff className="size-3" />
              Hidden
            </>
          )}
        </Badge>
      )}
      <Switch
        checked={isPublished}
        onCheckedChange={async (checked) => {
          await setProductPublished(productId, checked);
          await onVisibilityChange?.();
          toast.success(
            checked
              ? `"${title ?? "Product"}" is now visible to users`
              : `"${title ?? "Product"}" is hidden from users`,
          );
        }}
        aria-label={isPublished ? "Hide from users" : "Publish to users"}
        className="data-checked:bg-emerald-500"
      />
      {!compact && (
        <span className="text-sm text-white/50">
          {isPublished ? "Visible" : "Hidden"}
        </span>
      )}
    </div>
  );
}
