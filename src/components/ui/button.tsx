import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-white/10 hover:-translate-y-0.5",
        destructive:
          "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm hover:shadow-red-500/25 hover:bg-[position:right_center] hover:-translate-y-0.5",
        outline:
          "border border-border/60 bg-background/50 backdrop-blur-sm shadow-sm hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-foreground hover:shadow-md hover:shadow-blue-500/10 hover:-translate-y-0.5",
        secondary:
          "bg-secondary/50 backdrop-blur-sm border border-border/40 text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:border-border/80 hover:-translate-y-0.5",
        ghost: "hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:bg-blue-500/20",
        link: "text-primary underline-offset-4 hover:underline hover:text-blue-600 transition-colors",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
