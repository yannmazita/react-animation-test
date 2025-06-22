// src/features/slides/components/Slides.tsx
import { useRef } from "react";
import { useMountAnimation } from "../hooks/useMountAnimation";

export const Slides: React.FC = () => {
  const { topMounted, sidesMounted, textMounted } = useMountAnimation({
    topDelay: 200,
    sidesDelay: 1200,
    textDelay: 2500,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-gray-100"
    >
      {/* Header */}
      <div
        ref={topRef}
        data-mounted={topMounted}
        className="mt-16 transition-all duration-700 ease-out"
        style={{
          opacity: topMounted ? 1 : 0,
          filter: `blur(${topMounted ? "0px" : "8px"})`,
          willChange: "filter, opacity",
        }}
      >
        <h1 className="text-4xl font-bold text-gray-800">Animated Component</h1>
      </div>

      {/* Sides */}
      <div className="relative mt-12 h-64 w-full">
        <div
          data-mounted={sidesMounted}
          className="absolute top-0 left-0 h-full w-1/2 bg-blue-500 transition-all duration-1000 ease-out"
          style={{
            opacity: sidesMounted ? 0.9 : 0,
            transform: `translateX(${sidesMounted ? "50%" : "-100%"})`,
            willChange: "transform, opacity",
          }}
        />
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

      {/* Text */}
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
          sapien eget justo feugiat, id varius nisi facilisis.
        </p>
        <p className="mb-4">
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci
          luctus et ultrices posuere cubilia curae.
        </p>
        <p>
          Suspendisse potenti. Phasellus venenatis, neque vel tincidunt
          pellentesque, nulla est pulvinar nunc, id tincidunt nisi lorem ac
          lacus.
        </p>
      </div>
    </div>
  );
};
