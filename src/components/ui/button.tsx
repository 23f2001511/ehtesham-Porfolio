import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-cyan-500/20 hover:bg-cyan-300",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg shadow-emerald-500/20 hover:bg-emerald-300",
        outline:
          "border border-border bg-white/5 text-foreground hover:border-cyan-300/60 hover:bg-white/10",
        ghost: "text-muted-foreground hover:bg-white/[0.08] hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg shadow-rose-500/20 hover:bg-rose-300"
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
