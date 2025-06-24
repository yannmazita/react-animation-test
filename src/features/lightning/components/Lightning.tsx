import React, { useRef, useEffect } from "react";

interface LightningBolt {
  x: number;
  y: number;
  xRange: number;
  yRange: number;
  path: { x: number; y: number }[];
  pathLimit: number;
}

export const Lightning: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const random = (min: number, max: number) =>
      Math.random() * (max - min + 1) + min;

    const lightning: LightningBolt[] = [];
    let lightTimeCurrent = 0;
    let lightTimeTotal = random(15, 40);

    // Logic to create horizontal and vertical bolts.
    const createLightning = () => {
      let x, y;
      const boltType = random(1, 3); // Simple switch for bolt types

      // Horizontal bolts starting from sides
      if (boltType < 3) {
        x = random(0, 1) === 0 ? 0 : w; // Start at left or right edge
        y = random(0, h);
        const createCount = random(1, 3);
        for (let i = 0; i < createCount; i++) {
          lightning.push({
            x: x,
            y: y,
            xRange: random(40, 60), // Strong horizontal movement
            yRange: random(10, 20), // Weaker vertical movement
            path: [{ x: x, y: y }],
            pathLimit: random(30, 60),
          });
        }
      }
      // Vertical bolts starting from top/bottom
      else {
        x = random(0, w);
        y = random(0, 1) === 0 ? 0 : h; // Start at top or bottom edge
        const createCount = random(1, 3);
        for (let i = 0; i < createCount; i++) {
          lightning.push({
            x: x,
            y: y,
            xRange: random(10, 20), // Weaker horizontal movement
            yRange: random(40, 60), // Strong vertical movement
            path: [{ x: x, y: y }],
            pathLimit: random(30, 60),
          });
        }
      }
    };

    // DRAWING_FUNCTIONS
    const drawLightning = () => {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(120, 180, 255, 0.5)";

      for (let i = lightning.length - 1; i >= 0; i--) {
        const light = lightning[i];
        // Allow movement in all directions
        const nextX =
          light.path[light.path.length - 1].x +
          (random(0, light.xRange) - light.xRange / 2);
        const nextY =
          light.path[light.path.length - 1].y +
          (random(0, light.yRange) - light.yRange / 2);
        light.path.push({ x: nextX, y: nextY });

        if (light.path.length > light.pathLimit) {
          lightning.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = "rgba(220, 235, 255, 0.8)";
        ctx.lineWidth = random(1, 4);

        ctx.beginPath();
        ctx.moveTo(light.x, light.y);
        for (const segment of light.path) {
          ctx.lineTo(segment.x, segment.y);
        }

        ctx.lineJoin = "round";
        ctx.stroke();
      }
    };

    // ANIMATION_LOOP_FUNCTIONS
    const animateLightning = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;

      lightTimeCurrent++;
      if (lightTimeCurrent >= lightTimeTotal) {
        createLightning();
        lightTimeCurrent = 0;
        lightTimeTotal = random(15, 40);
      }
      drawLightning();
    };

    const animate = () => {
      animateLightning();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 z-1" />
    </div>
  );
};
