import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  unstyled?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, unstyled = false, ...props }, ref) => {
    return (
      <textarea
        className={unstyled ? className : cn(
          "flex min-h-[80px] w-full rounded-md glass-burgundy-input px-3 py-2 text-sm text-white/90 caret-white/80 placeholder:text-white/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-coral-400/20 focus-visible:border-coral-400/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
