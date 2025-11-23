import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md glass-burgundy-input px-3 py-2 text-base text-pink-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-pink-200 placeholder:text-pink-200 caret-[#ff6b9d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-coral-400/20 focus-visible:border-coral-400/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
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
