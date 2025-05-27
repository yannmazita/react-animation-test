// src/features/animation/components/AnimatedComponents.tsx
import { useState, useEffect, useRef } from "react";

export const AnimatedComponent: React.FC = () => {
  // Animation state
  const [headerMounted, setHeaderMounted] = useState(false);
  const [sidesMounted, setSidesMounted] = useState(false);
  const [textMounted, setTextMounted] = useState(false);

  // Refs for animation measurements
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Animation sequence controller
  useEffect(() => {
    // First render completed, start animations,
    // stagger animation starts with small delays between
    const headerTimer = setTimeout(() => {
      setHeaderMounted(true);
    }, 100);

    const sidesTimer = setTimeout(() => {
      setSidesMounted(true);
    }, 1200);

    const textTimer = setTimeout(() => {
      setTextMounted(true);
    }, 2500);

    // Cleanup timers
    return () => {
      clearTimeout(headerTimer);
      clearTimeout(sidesTimer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-gray-100"
    >
      {/* Header with blur effect */}
      <div
        ref={headerRef}
        data-mounted={headerMounted}
        className="mt-16 transition-all duration-700 ease-out"
        style={{
          opacity: headerMounted ? 1 : 0,
          filter: `blur(${headerMounted ? "0px" : "8px"})`,
          willChange: "filter, opacity", // Performance hint for browser
        }}
      >
        <h1 className="text-4xl font-bold text-gray-800">Animated Component</h1>
      </div>

      {/* Sides Animation Container */}
      <div className="relative mt-12 h-64 w-full">
        {/* Left Side */}
        <div
          data-mounted={sidesMounted}
          className="absolute top-0 left-0 h-full w-1/2 bg-blue-500 transition-all duration-1000 ease-out"
          style={{
            opacity: sidesMounted ? 0.9 : 0,
            transform: `translateX(${sidesMounted ? "50%" : "-100%"})`,
            willChange: "transform, opacity",
          }}
        />

        {/* Right Side */}
        <div
          data-mounted={sidesMounted}
          className="absolute top-0 right-0 h-full w-1/2 bg-blue-500 transition-all duration-1000 ease-out"
          style={{
            opacity: sidesMounted ? 0.9 : 0,
            transform: `translateX(${sidesMounted ? "-50%" : "100%"})`,
            willChange: "transform, opacity",
          }}
        />
      </div>

      <div
        data-mounted={textMounted}
        className="mx-auto mt-12 max-w-2xl px-6 text-gray-600 transition-all duration-1000 ease-in-out"
        style={{
          opacity: textMounted ? 1 : 0,
          transform: `translateY(${textMounted ? "0" : "30px"})`,
          willChange: "transform, opacity",
        }}
      >
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor
          sapien eget justo feugiat, id varius nisi facilisis. Donec rhoncus
          tellus at velit ultricies, sit amet sollicitudin nibh pretium.
        </p>
        <p className="mb-4">
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci
          luctus et ultrices posuere cubilia curae; Sed ac magna vitae eros
          scelerisque aliquet.
        </p>
        <p>
          Suspendisse potenti. Phasellus venenatis, neque vel tincidunt
          pellentesque, nulla est pulvinar nunc, id tincidunt nisi lorem ac
          lacus. Vivamus convallis ipsum vitae libero commodo, a convallis diam
          tincidunt.
        </p>
      </div>
    </div>
  );
};
