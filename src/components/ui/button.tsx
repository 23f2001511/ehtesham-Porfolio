import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold btn-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_rgba(79,156,255,0.5)] hover:scale-[1.03] hover:brightness-110 active:scale-[0.97]",
        glow:
          "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.04] hover:brightness-110 active:scale-[0.97]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_8px_20px_-10px_rgba(45,212,191,0.5)] hover:scale-[1.03] hover:brightness-110 active:scale-[0.97]",
        outline:
          "border border-[var(--glass-border)] bg-[var(--glass-bg)] text-foreground backdrop-blur-md hover:border-border-strong hover:shadow-[var(--elevation-1)]",
        ghost: "text-muted-foreground hover:bg-[var(--glass-bg)] hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg shadow-rose-500/20 hover:brightness-110"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);

Button.displayName = "Button";

export { Button, buttonVariants };
