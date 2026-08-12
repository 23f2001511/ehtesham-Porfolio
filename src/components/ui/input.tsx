import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-11 w-full rounded-[10px] border border-border bg-input px-3 py-2 text-sm text-foreground shadow-[inset_0_1px_2px_rgba(2,6,16,0.15)] outline-none transition placeholder:text-muted-foreground focus:border-primary/70 focus:ring-2 focus:ring-ring/20 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_15%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";

export { Input };
