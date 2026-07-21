import { forwardRef } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * Thin semantic wrapper over the base Button so feature code can speak in
 * the design vocabulary (primary = sage-900 solid / secondary = subtle
 * neutral / ghost). No new styling — it just maps to Button variants so
 * there is a single source of truth for button appearance.
 */
export type GlassButtonProps = ButtonProps;

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ variant = "primary", ...props }, ref) => (
    <Button ref={ref} variant={variant} {...props} />
  ),
);
GlassButton.displayName = "GlassButton";
