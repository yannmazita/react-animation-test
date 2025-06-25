// src/features/lightning/hooks/useLightning.ts
import { useRef, useEffect, RefObject } from "react";
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
 * The hook reads its dimensions from the canvas element, so the canvas MUST be
 * styled with a width and height (ex: using CSS or Tailwind classes) for the
 * effect to be visible.
 *
 * @param canvasRef - Ref object pointing to the canvas element where the animation will be drawn.
 * @param options - Optional object to override the default lightning effect parameters. See `LightningOptions` for all available properties.
 *
 * @example
 * const MyComponent = () => {
 *   const canvasRef = useRef(null);
 *   useLightning(canvasRef);
 *
 *   // The parent element should have a positioning context (ex: `relative`).
 *   return (
 *     <div className="relative h-screen w-full">
 *       <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
 *     </div>
 *   );
 * }
 */
export const useLightning = (
  canvasRef: RefObject<HTMLCanvasElement>,
  options: Partial<LightningOptions> = {},
) => {
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const config = { ...DEFAULT_LIGHTNING_OPTIONS, ...options };

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w: number;
    let h: number;

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

    /* - Direction Update: The bolt's direction vector (`vx`, `vy`) is slightly
     *   altered by `turniness` to create a jagged path.
     * - Vector Normalization: The direction vector's length is reset to 1. This is
     *   crucial; it prevents the bolt from accelerating uncontrollably and ensures
     *   `speed` is the primary factor for segment length.
     * - Next Point Calculation: The next point is found by adding the direction
     *   vector (scaled by `speed`) plus some random "jitter."
     * - Termination: Bolts are removed if they go off-screen or their path limit is
     *   reached. This is essential for performance.
     */
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

    /*
     * On every frame, this function performs two main tasks:
     * a) Fading the Canvas: Using `globalCompositeOperation` to create
     *    trails. It draws a semi-transparent rectangle over the whole canvas, which
     *    makes the previous frame fade slightly instead of disappearing completely.
     * b) Timing and Drawing: It checks the timer to see if a new storm should be
     *    created and then calls `drawLightning` to update and render every bolt.
     */
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
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      // Clear existing lightning on resize to prevent weird artifacts
      lightning.length = 0;
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial size
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [canvasRef, options]);
};
