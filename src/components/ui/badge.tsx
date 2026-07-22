import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-chip px-2 py-0.5 text-[12px] font-medium font-body",
  {
    variants: {
      variant: {
        neutral: "bg-cream-100 text-text-secondary",
        sage: "bg-sage-100 text-sage-900",
        blush: "bg-blush-100 text-blush-600",
        dark: "bg-sage-900 text-cream-50",
        outline: "border border-border-default bg-transparent text-text-secondary",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
