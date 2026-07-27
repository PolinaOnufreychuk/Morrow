import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full border border-transparent bg-cream-100/60 font-body text-text-primary placeholder:text-text-tertiary transition-shadow duration-fast ease-out aria-invalid:border-blush-400 aria-invalid:bg-blush-100/40",
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-[13px]",
        md: "h-11 px-3.5 text-[14px]",
        lg: "h-12 px-4 text-[15px]",
      },
      /** "default" is the standard 10px radius every field uses. "soft" is
       * the taller, rounder, more-padded field from the "New project"
       * mockup (overrides the size axis's height/padding) — opt in per-form. */
      rounded: {
        default: "rounded-button",
        soft: "h-[52px] rounded-[16px] bg-[#F9F9F8] px-4 text-[15px] placeholder:text-[#BFBEBC]",
      },
    },
    defaultVariants: { size: "md", rounded: "default" },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Icon rendered inside the field — wraps the input in a relative
   * container and reserves padding on that side. Omit for a plain input. */
  icon?: ReactNode;
  /** Which side `icon` renders on. Defaults to "left". */
  iconPosition?: "left" | "right";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", size, rounded, icon, iconPosition = "left", ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        type={type}
        className={cn(
          inputVariants({ size, rounded }),
          icon && (iconPosition === "left" ? "pl-10" : "pr-10"),
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:border-brand-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );

    if (!icon) return input;

    return (
      <div className="relative">
        {input}
        <span
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-text-tertiary",
            iconPosition === "left" ? "left-3.5" : "right-3.5",
          )}
        >
          {icon}
        </span>
      </div>
    );
  },
);
Input.displayName = "Input";
