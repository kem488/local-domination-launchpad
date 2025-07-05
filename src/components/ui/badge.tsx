import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-soft",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-primary text-primary-foreground hover:shadow-medium",
        secondary:
          "border-transparent bg-gradient-card text-secondary-foreground hover:shadow-medium border-border/50",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-soft",
        outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        premium: "border-transparent bg-gradient-brand text-brand-orange-foreground shadow-medium hover:shadow-strong",
        success: "border-transparent bg-gradient-success text-white shadow-soft hover:shadow-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
