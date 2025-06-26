// src/features/lightning/components/LightningOptimized.tsx
import { useRef } from "react";
import { useLightningOptimized } from "../hooks/useLightningOptimized";

export const LightningOptimized: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 1. Use default
  useLightningOptimized(canvasRef);

  // 2. Only from top, pointing downward
  // useLightning(canvasRef, {
  //   startPosition: 'top',
  //   startVelocity: Math.PI / 2, // 90 degrees (downward)
  // });

  // 3. From corners, pointing toward center
  // useLightning(canvasRef, {
  //   startPositionBias: 'corners',
  //   startVelocity: 'inward',
  // });

  // 4. Custom center burst effect
  // useLightning(canvasRef, {
  //   startPosition: (w, h) => ({ x: w / 2, y: h / 2 }),
  //   startVelocity: 'outward',
  // });

  // 5. Custom spiral pattern
  // useLightning(canvasRef, {
  //   startPosition: (w, h) => {
  //     const angle = Date.now() * 0.001;
  //     const radius = Math.min(w, h) * 0.3;
  //     return {
  //       x: w / 2 + Math.cos(angle) * radius,
  //       y: h / 2 + Math.sin(angle) * radius
  //     };
  //   },
  //   startVelocity: (edge, x, y, w, h) => {
  //     const angle = Math.atan2(y - h / 2, x - w / 2) + Math.PI / 2;
  //     return { vx: Math.cos(angle), vy: Math.sin(angle) };
  //   },
  // });
  return (
    <div className="relative h-screen w-full bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};
