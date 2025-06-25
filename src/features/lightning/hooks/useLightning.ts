// src/features/lightning/hooks/useLightning.ts
import { useRef, useEffect } from "react";
import { LightningBolt, LightningOptions } from "../types";
import { random } from "../utils/random";

const DEFAULT_LIGHTNING_OPTIONS: LightningOptions = {
  // Timing
  minDelay: 15,
  maxDelay: 40,

  // Bolt creation
  minCreateCount: 1,
  maxCreateCount: 4,

  // Bolt physics
  minPathLength: 80,
  maxPathLength: 150,
  minSpeed: 30,
  maxSpeed: 50,
  minTurniness: 0.1,
  maxTurniness: 0.5,

  // Aesthetics
  minLineWidth: 1,
  maxLineWidth: 4,
  blur: 20,
  blurColor: "rgba(120, 180, 255, 0.5)",
  strokeColor: "rgba(220, 235, 255, 0.8)",
  fadeoutColor: "rgba(0, 0, 0, 0.05)",
};

/**
 * @hook useLightning
 * Renders a continuous, generative lightning effect onto a canvas element.
 * It handles the animation loop, canvas resizing, and all drawing logic internally.
 *
 * @param canvasRef - Ref object pointing to the canvas element where the animation will be drawn.
 * @param options - Optional object to override the default lightning effect parameters. See `LightningOptions` for all available properties.
 *
 * @example
 * const MyComponent = () => {
 *   const canvasRef = useRef(null);
 *
 *   // Use with default settings
 *   useLightning(canvasRef);
 *
 *   // Or customize it
 *   const customOptions = {
 *     strokeColor: 'rgba(255, 0, 0, 0.8)',
 *     blurColor: 'rgba(255, 0, 0, 0.5)',
 *     maxDelay: 20,
 *   };
 *   useLightning(canvasRef, customOptions);
 *
 *   return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
 * }
 */
export const useLightning = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options: Partial<LightningOptions> = {},
) => {
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const config = { ...DEFAULT_LIGHTNING_OPTIONS, ...options };

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const lightning: LightningBolt[] = [];
    let lightTimeCurrent = 0;
    let lightTimeTotal = random(config.minDelay, config.maxDelay);

    const createLightning = () => {
      const edge = Math.floor(random(0, 4)); // 0: top, 1: right, 2: bottom, 3: left
      let x, y, vx, vy;

      switch (edge) {
        case 0: // Top edge
          x = random(0, w);
          y = 0;
          vx = random(-1, 1);
          vy = random(0.5, 1);
          break;
        case 1: // Right edge
          x = w;
          y = random(0, h);
          vx = random(-1, -0.5);
          vy = random(-1, 1);
          break;
        case 2: // Bottom edge
          x = random(0, w);
          y = h;
          vx = random(-1, 1);
          vy = random(-1, -0.5);
          break;
        default: // Left edge (case 3)
          x = 0;
          y = random(0, h);
          vx = random(0.5, 1);
          vy = random(-1, 1);
          break;
      }

      const createCount = Math.floor(
        random(config.minCreateCount, config.maxCreateCount),
      );
      for (let i = 0; i < createCount; i++) {
        lightning.push({
          x: x,
          y: y,
          vx: vx,
          vy: vy,
          path: [{ x: x, y: y }],
          pathLimit: random(config.minPathLength, config.maxPathLength),
          speed: random(config.minSpeed, config.maxSpeed),
          turniness: random(config.minTurniness, config.maxTurniness),
        });
      }
    };

    const drawLightning = () => {
      ctx.shadowBlur = config.blur;
      ctx.shadowColor = config.blurColor;

      for (let i = lightning.length - 1; i >= 0; i--) {
        const light = lightning[i];
        const lastSegment = light.path[light.path.length - 1];

        // 1. Update direction vector with turniness
        light.vx += random(-light.turniness, light.turniness);
        light.vy += random(-light.turniness, light.turniness);

        // 2. Normalize the vector to maintain a consistent direction push
        const magnitude = Math.sqrt(light.vx * light.vx + light.vy * light.vy);
        if (magnitude > 0) {
          light.vx /= magnitude;
          light.vy /= magnitude;
        }

        // 3. Calculate next point with main direction and jitter
        const segmentLength = random(light.speed * 0.5, light.speed * 1.5);
        const jitterAmount = light.speed * 1.5;

        const nextX =
          lastSegment.x +
          light.vx * segmentLength +
          random(-jitterAmount, jitterAmount);
        const nextY =
          lastSegment.y +
          light.vy * segmentLength +
          random(-jitterAmount, jitterAmount);

        // Terminate if bolt goes off-screen
        if (nextX < 0 || nextX > w || nextY < 0 || nextY > h) {
          lightning.splice(i, 1);
          continue;
        }

        light.path.push({ x: nextX, y: nextY });

        if (light.path.length > light.pathLimit) {
          lightning.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = config.strokeColor;
        ctx.lineWidth = random(config.minLineWidth, config.maxLineWidth);

        ctx.beginPath();
        ctx.moveTo(light.x, light.y);
        for (const segment of light.path) {
          ctx.lineTo(segment.x, segment.y);
        }

        ctx.lineJoin = "round";
        ctx.stroke();
      }
    };

    const animateLightning = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = config.fadeoutColor;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;

      lightTimeCurrent++;
      if (lightTimeCurrent >= lightTimeTotal) {
        createLightning();
        lightTimeCurrent = 0;
        lightTimeTotal = random(config.minDelay, config.maxDelay);
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
      // Clear existing lightning on resize to prevent weird artifacts
      lightning.length = 0;
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [canvasRef, options]);
};
