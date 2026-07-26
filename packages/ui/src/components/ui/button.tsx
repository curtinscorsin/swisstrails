"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em]",
    "transition-[transform,background-color,border-color,color,box-shadow] duration-200 cursor-pointer select-none",
    "pointer-coarse:min-h-11",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpine-400 focus-visible:ring-offset-2 focus-visible:ring-offset-trail-950",
    "disabled:opacity-40 disabled:pointer-events-none",
    "whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        gold: [
          "bg-gold-200 text-trail-950 font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
          "hover:bg-gold-100 hover:shadow-[0_14px_36px_rgba(0,0,0,0.24)] hover:-translate-y-0.5",
          "active:bg-gold-300 active:translate-y-0 active:scale-[0.98]",
        ].join(" "),
        alpine: [
          "bg-alpine-300 text-trail-950 font-semibold",
          "hover:bg-alpine-200 hover:-translate-y-0.5",
          "active:bg-alpine-400 active:translate-y-0 active:scale-[0.98]",
        ].join(" "),
        outline: [
          "border border-white/15 bg-white/[0.025] text-stone-200",
          "hover:bg-white/[0.07] hover:border-white/25 hover:text-fg",
          "active:scale-[0.98]",
        ].join(" "),
        ghost: [
          "bg-transparent text-stone-300",
          "hover:bg-white/[0.05] hover:text-fg",
          "active:scale-[0.98]",
        ].join(" "),
        glass: [
          "bg-trail-900/70 backdrop-blur-xl border border-white/12 text-fg shadow-md",
          "hover:bg-trail-800/90 hover:border-white/20",
          "active:scale-[0.98]",
        ].join(" "),
        danger: [
          "bg-red-900 text-red-300",
          "hover:bg-red-800",
          "active:scale-[0.99]",
        ].join(" "),
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-sm",
        xl: "h-14 px-8 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
        "icon-lg": "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
