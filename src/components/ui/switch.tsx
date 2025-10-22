import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-8 w-13 shrink-0 cursor-pointer items-center rounded-full border-[3px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:scale-105 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-400 data-[state=checked]:to-orange-400 data-[state=checked]:border-transparent data-[state=unchecked]:bg-burgundy-800/40 data-[state=unchecked]:backdrop-blur-sm data-[state=unchecked]:border-burgundy-600/50",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-6 w-6 rounded-full bg-background shadow-xl ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
