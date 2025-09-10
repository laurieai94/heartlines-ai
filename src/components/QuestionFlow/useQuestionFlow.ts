import { useEffect, useMemo, useRef, useState } from "react";

export type QuestionStep<TData = any> = {
  id: string;
  title: string;
  // Return true when current data satisfies this step
  validate?: (data: TData) => boolean;
  // Render the step content. Receives the same stepProps passed to QuestionFlow
  render: (stepProps: any) => React.ReactNode;
  // Optional: conditionally include a step
  when?: (data: TData) => boolean;
};

export interface UseQuestionFlowOptions<TData = any> {
  steps: QuestionStep<TData>[];
  data: TData;
  onStepChange?: (index: number) => void;
}

export const useQuestionFlow = <TData,>({ steps, data, onStepChange }: UseQuestionFlowOptions<TData>) => {
  const [index, setIndex] = useState(0);

  // Filter steps by `when`
  const activeSteps = useMemo(() => {
    return steps.filter((s) => (s.when ? s.when(data) : true));
  }, [steps, data]);

  const total = activeSteps.length;
  const clampedIndex = Math.min(index, Math.max(0, total - 1));

  const isValid = useMemo(() => {
    const step = activeSteps[clampedIndex];
    if (!step) return false;
    return step.validate ? !!step.validate(data) : true;
  }, [activeSteps, clampedIndex, data]);

  // Progress percentage (1-based)
  const progress = total > 0 ? Math.round(((clampedIndex + 1) / total) * 100) : 0;

  // Focus management for accessibility
  const focusRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    onStepChange?.(clampedIndex);
    // Focus the container on step change for SR announcement
    const el = focusRef.current;
    if (el) {
      // Delay to ensure new content is in DOM
      const t = setTimeout(() => el.focus({ preventScroll: true }), 0);
      return () => clearTimeout(t);
    }
  }, [clampedIndex, onStepChange]);

  const next = () => setIndex((i) => Math.min(i + 1, total - 1));
  const back = () => setIndex((i) => Math.max(i - 1, 0));
  const goTo = (i: number) => setIndex(() => Math.min(Math.max(i, 0), total - 1));

  return {
    index: clampedIndex,
    total,
    isValid,
    progress,
    steps: activeSteps,
    next,
    back,
    goTo,
    focusRef,
  };
};
