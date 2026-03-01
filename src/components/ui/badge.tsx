import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white",
        accent: "border-transparent bg-accent text-white",
        outline: "border-primary text-primary",
        pinned: "border-transparent bg-accent-50 text-accent-700 border-accent-200",
        prayer: "border-transparent bg-primary-50 text-primary",
        iftar: "border-transparent bg-orange-50 text-orange-700",
        lecture: "border-transparent bg-blue-50 text-blue-700",
        fundraiser: "border-transparent bg-accent-50 text-accent-700",
        other: "border-transparent bg-warmGray-100 text-warmGray-500",
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
