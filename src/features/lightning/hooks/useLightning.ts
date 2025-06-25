// src/features/projects/hooks/useLightning.ts
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
  trailLength: 30,
};

interface TrailSegment {
  path: { x: number; y: number }[];
  age: number;
  lineWidth: number;
}

/**
 * @hook useLightning
 *
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
    const trails: TrailSegment[] = [];
    let lightTimeCurrent = 0;
    let lightTimeTotal = random(config.minDelay, config.maxDelay);

    /**
     * Creates new lightning bolts originating from random edges of the canvas.
     * Each creation event can spawn multiple bolts based on config settings.
     *
     * The function:
     * 1. Randomly selects an edge (top, right, bottom, left)
     * 2. Sets initial position on that edge
     * 3. Sets initial velocity vectors pointing inward
     * 4. Creates the specified number of bolts with randomized properties
     */
    const createLightning = () => {
      const edge = Math.floor(random(0, 4));
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
          lineWidth: random(config.minLineWidth, config.maxLineWidth),
        });
      }
    };

    /**
     * Updates the position and path of all active lightning bolts.
     *
     * For each bolt:
     * 1. Applies turniness to create natural-looking direction changes
     * 2. Normalizes the velocity vector to maintain consistent speed
     * 3. Calculates the next segment position with jitter for organic movement
     * 4. Removes bolts that go off-screen or exceed their path limit
     * 5. Transfers completed bolts to the trails array for fade-out effect
     */
    const updateLightning = () => {
      for (let i = lightning.length - 1; i >= 0; i--) {
        const light = lightning[i];
        const lastSegment = light.path[light.path.length - 1];

        // Update direction vector with turniness
        light.vx += random(-light.turniness, light.turniness);
        light.vy += random(-light.turniness, light.turniness);

        // Normalize the vector
        const magnitude = Math.sqrt(light.vx * light.vx + light.vy * light.vy);
        if (magnitude > 0) {
          light.vx /= magnitude;
          light.vy /= magnitude;
        }

        // Calculate next point
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
          // Add to trails before removing
          trails.push({
            path: [...light.path],
            age: 0,
            lineWidth: light.lineWidth,
          });
          lightning.splice(i, 1);
          continue;
        }

        light.path.push({ x: nextX, y: nextY });

        if (light.path.length > light.pathLimit) {
          // Add to trails before removing
          trails.push({
            path: [...light.path],
            age: 0,
            lineWidth: light.lineWidth,
          });
          lightning.splice(i, 1);
        }
      }
    };

    /**
     * Renders a single frame of the lightning animation.
     *
     * 1. Clears the entire canvas to ensure no color accumulation
     * 2. Ages existing trails and removes those that exceed trailLength
     * 3. Draws all trails with decreasing opacity based on age
     * 4. Draws all active lightning bolts at full opacity
     *
     */
    const drawFrame = () => {
      // Clear the entire canvas
      ctx.clearRect(0, 0, w, h);

      // Update trail ages and remove old ones
      for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].age++;
        if (trails[i].age > config.trailLength) {
          trails.splice(i, 1);
        }
      }

      // Draw trails with fading opacity
      ctx.shadowBlur = config.blur;
      ctx.shadowColor = config.blurColor;

      for (const trail of trails) {
        const opacity = 1 - trail.age / config.trailLength;
        const [r, g, b] = [220, 235, 255]; // Extract RGB from strokeColor
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`;
        ctx.lineWidth = trail.lineWidth * opacity;

        ctx.beginPath();
        ctx.moveTo(trail.path[0].x, trail.path[0].y);
        for (const segment of trail.path) {
          ctx.lineTo(segment.x, segment.y);
        }
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      // Draw active lightning bolts
      for (const light of lightning) {
        ctx.strokeStyle = config.strokeColor;
        ctx.lineWidth = light.lineWidth;

        ctx.beginPath();
        ctx.moveTo(light.path[0].x, light.path[0].y);
        for (const segment of light.path) {
          ctx.lineTo(segment.x, segment.y);
        }
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    };

    /**
     * Main animation loop function called on each frame.
     *
     * 1. Tracks frames and spawns new bolts at intervals
     * 2. Updates all active lightning bolt positions
     * 3. Renders the complete frame
     * 4. Schedules the next animation frame
     */
    const animate = () => {
      lightTimeCurrent++;
      if (lightTimeCurrent >= lightTimeTotal) {
        createLightning();
        lightTimeCurrent = 0;
        lightTimeTotal = random(config.minDelay, config.maxDelay);
      }

      updateLightning();
      drawFrame();

      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      lightning.length = 0;
      trails.length = 0;
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [canvasRef, options]);
};
