// src/features/lightning/components/Lightning.tsx
import { useRef } from "react";
import { useLightning } from "../hooks/useLightning";

export const Lightning: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useLightning(canvasRef);

  return (
    <div className="relative h-screen w-full bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};
