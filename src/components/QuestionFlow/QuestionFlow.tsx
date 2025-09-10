import React from "react";
import { useQuestionFlow, QuestionStep } from "./useQuestionFlow";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuestionFlowProps<TData = any> {
  steps: QuestionStep<TData>[];
  data: TData;
  stepProps?: any; // forwarded to step.render
  onComplete: () => void;
  onClose?: () => void;
  title?: string;
  className?: string;
}

function QuestionFlow<TData = any>({
  steps,
  data,
  stepProps,
  onComplete,
  onClose,
  title,
  className,
}: QuestionFlowProps<TData>) {
  const { index, total, isValid, progress, steps: activeSteps, next, back, focusRef } = useQuestionFlow<TData>({ steps, data });

  const isLast = index >= total - 1;

  const handlePrimary = () => {
    if (isLast) onComplete();
    else next();
  };

  const Current = activeSteps[index];

  return (
    <div className={cn("min-h-[100svh] flex flex-col", className)}>
      {/* Header */}
      <header className="px-4 pt-4 pb-2">
        {title && (
          <h1 className="text-lg font-semibold tracking-tight" aria-live="polite">
            {title}
          </h1>
        )}
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-2 flex-1" aria-label="Progress" />
          <span className="text-xs tabular-nums" aria-hidden>
            {index + 1}/{total}
          </span>
        </div>
      </header>

      {/* Content */}
      <main
        ref={focusRef as any}
        tabIndex={-1}
        className="flex-1 px-4 pb-24 focus:outline-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {Current && (
          <section>
            {/* Keep existing cards intact; we just render one at a time */}
            {Current.render(stepProps)}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed inset-x-0 bottom-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="mx-auto max-w-screen-md px-4 py-3 flex items-center gap-3">
          <Button variant="outline" onClick={back} disabled={index === 0} aria-label="Back">
            Back
          </Button>
          <div className="flex-1" />
          <Button onClick={handlePrimary} disabled={!isValid} aria-label={isLast ? "Finish" : "Continue"}>
            {isLast ? "Finish" : "Continue"}
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default QuestionFlow;
export type { QuestionStep } from "./useQuestionFlow";
