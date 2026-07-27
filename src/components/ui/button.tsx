import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Re-skinned entirely to the Morrow token system — no shadcn default blue
 * focus ring, no pill radius, no default font survives here.
 * Primary CTA is always sage-900, same radius everywhere (docs/DESIGN.md).
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button text-[14px] font-medium font-body transition-colors transition-transform duration-fast ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page",
  {
    variants: {
      variant: {
        primary: "bg-sage-900 text-cream-50 hover:bg-sage-700 hover:-translate-y-px",
        secondary:
          "bg-surface-card text-text-primary border border-border-default hover:bg-cream-100 hover:-translate-y-px",
        ghost: "text-text-secondary hover:bg-cream-100 hover:text-text-primary",
        destructive: "bg-blush-600 text-cream-50 hover:bg-blush-600/90",
        /** Gradient-textured CTA reserved for the "New project" mockup's
         * hero modal; every other primary CTA stays flat sage-900. */
        hero: "bg-gradient-to-r from-sage-600 to-sage-400 text-cream-50 hover:brightness-105 hover:-translate-y-px",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-10 w-10 shrink-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Stretches the button to fill its container — used for a modal's lone
   * terminal CTA (see ModalShell's `footerAlign="stretch"`). */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, fullWidth, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
