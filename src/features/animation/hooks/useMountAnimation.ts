// src/features/animation/hooks/useMountAnimation.ts
import { useEffect, useState } from "react";

export interface UseMountAnimationOptions {
  /** Delay before top animation starts (in milliseconds). */
  topDelay?: number;
  /** Delay before side elements animate in (in milliseconds). */
  sidesDelay?: number;
  /** Delay before text content fades in (in milliseconds). */
  textDelay?: number;
}

export interface UseMountAnimationResult {
  /** Has top panel mounted? (animated in). */
  topMounted: boolean;
  /** Have side panels mounted? (animated in). */
  sidesMounted: boolean;
  /** Has text content mounted? (animated in). */
  textMounted: boolean;
}

/**
 * Controls staggered mount animations using delayed timeouts.
 *
 * @param options - Optional configuration for animation delays.
 * @param options.topDelay - Time before top mounts (default: 100ms).
 * @param options.sidesDelay - Time before side panels mount (default: 1200ms).
 * @param options.textDelay - Time before text content mounts (default: 2500ms).
 * @returns Object with boolean flags indicating whether each element is mounted.
 */
export const useMountAnimation = (
  options: UseMountAnimationOptions = {},
): UseMountAnimationResult => {
  const { topDelay = 100, sidesDelay = 1200, textDelay = 2500 } = options;

  const [topMounted, setHeaderMounted] = useState(false);
  const [sidesMounted, setSidesMounted] = useState(false);
  const [textMounted, setTextMounted] = useState(false);

  useEffect(() => {
    const topTimer = setTimeout(() => setHeaderMounted(true), topDelay);
    const sidesTimer = setTimeout(() => setSidesMounted(true), sidesDelay);
    const textTimer = setTimeout(() => setTextMounted(true), textDelay);

    return () => {
      clearTimeout(topTimer);
      clearTimeout(sidesTimer);
      clearTimeout(textTimer);
    };
  }, [topDelay, sidesDelay, textDelay]);

  return {
    topMounted,
    sidesMounted,
    textMounted,
  };
};
