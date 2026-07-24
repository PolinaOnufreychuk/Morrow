import { forwardRef, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-button border border-transparent bg-cream-100/60 font-body text-text-primary placeholder:text-text-tertiary transition-shadow duration-fast ease-out",
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-[13px]",
        md: "h-11 px-3.5 text-[14px]",
        lg: "h-12 px-4 text-[15px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", size, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        inputVariants({ size }),
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:border-brand-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
