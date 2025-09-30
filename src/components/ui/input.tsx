import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md glass-burgundy-input px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-[#ff6b9d]/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-coral-400/20 focus-visible:border-coral-400/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200 text-white",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
