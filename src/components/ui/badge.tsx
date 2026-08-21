import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand/50",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brandSolid text-white",
        accent: "border-transparent bg-accent text-white",
        outline: "border-brand text-brand",
        // The category tints are pale washes that disappear on a dark canvas,
        // so each pairs a dark-mode fill with a lighter label.
        pinned:
          "border-accent-200 bg-accent-50 text-accent-700 dark:border-accent-700/40 dark:bg-accent-900/40 dark:text-accent-200",
        prayer: "border-transparent bg-brandSoft text-brand",
        iftar:
          "border-transparent bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
        lecture:
          "border-transparent bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
        fundraiser:
          "border-transparent bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200",
        other: "border-transparent bg-surfaceAlt text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
