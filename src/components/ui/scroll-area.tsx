import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  viewportRef?: React.RefObject<HTMLDivElement>;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  role?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-label'?: string;
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, onScroll, viewportRef, onTouchStart, onTouchMove, role, 'aria-live': ariaLive, 'aria-label': ariaLabel, ...props }, ref) => {
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Store initial touch position for move detection
    e.currentTarget.setAttribute('data-start-y', e.touches[0].clientY.toString());
    onTouchStart?.(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    onTouchMove?.(e);
  };

  return (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      ref={viewportRef}
      className={cn("h-full w-full rounded-[inherit] scrollbar-sleek", className)}
      onScroll={onScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      role={role}
      aria-live={ariaLive}
      aria-label={ariaLabel}
      style={{ 
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorY: 'contain'
      }}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
  );
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors md:flex hidden",
      orientation === "vertical" &&
        "h-full w-1.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-1.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb 
      className="relative flex-1 rounded-full border border-coral-300/20"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--coral-400) / 0.7), hsl(var(--peach-400) / 0.6))'
      }}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }