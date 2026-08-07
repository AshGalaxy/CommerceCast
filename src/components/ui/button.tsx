import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[inset_0px_1px_0px_rgba(255,255,255,0.2),_0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[inset_0px_1px_0px_rgba(255,255,255,0.3),_0_4px_15px_rgba(59,130,246,0.4)] hover:from-blue-400 hover:to-blue-500 transition-all duration-300 border border-blue-700/50 hover:border-blue-500 hover:-translate-y-px",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[inset_0px_1px_0px_rgba(255,255,255,0.2),_0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[inset_0px_1px_0px_rgba(255,255,255,0.3),_0_4px_15px_rgba(239,68,68,0.4)] hover:from-red-400 hover:to-red-500 border border-red-700/50 hover:-translate-y-px",
        outline:
          "border border-border/60 bg-background/50 backdrop-blur-sm shadow-sm hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-foreground hover:shadow-md hover:shadow-blue-500/10 hover:-translate-y-px",
        secondary:
          "bg-secondary/50 backdrop-blur-sm border border-border/40 text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:border-border/80 hover:-translate-y-px",
        ghost: "hover:bg-foreground/5 hover:text-foreground dark:hover:bg-foreground/10 transition-colors active:bg-foreground/10",
        link: "text-primary underline-offset-4 hover:underline hover:text-blue-600 transition-colors",
      },
      size: {
        default: "h-8 px-3.5 py-1.5 text-[13px]",
        sm: "h-7 rounded text-xs px-2.5",
        lg: "h-9 rounded-md px-5 text-[13.5px]",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
