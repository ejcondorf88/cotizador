import { useState, useCallback } from 'react';

interface UseStepperReturn {
  activeStep: number;
  next: () => void;
  previous: () => void;
  goTo: (step: number) => void;
  isFirst: boolean;
  isLast: boolean;
  totalSteps: number;
}

export function useStepper(totalSteps: number, initialStep: number = 0): UseStepperReturn {
  const [activeStep, setActiveStep] = useState(initialStep);

  const next = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const previous = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback((step: number) => {
    setActiveStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  const isFirst = activeStep === 0;
  const isLast = activeStep === totalSteps - 1;

  return {
    activeStep,
    next,
    previous,
    goTo,
    isFirst,
    isLast,
    totalSteps,
  };
}
