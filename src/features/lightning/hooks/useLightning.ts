// src/features/lightning/hooks/useLightning.ts
import { useRef, useEffect } from "react";
import { LightningBolt } from "../types";
import { random } from "../utils/random";

export const useLightning = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const lightning: LightningBolt[] = [];
    let lightTimeCurrent = 0;
    let lightTimeTotal = random(15, 40);

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

      const createCount = Math.floor(random(1, 4));
      for (let i = 0; i < createCount; i++) {
        lightning.push({
          x: x,
          y: y,
          vx: vx,
          vy: vy,
          path: [{ x: x, y: y }],
          pathLimit: random(80, 150),
          speed: random(30, 50),
          turniness: random(0.1, 0.5),
        });
      }
    };

    const drawLightning = () => {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(120, 180, 255, 0.5)";

      for (let i = lightning.length - 1; i >= 0; i--) {
        const light = lightning[i];
        const lastSegment = light.path[light.path.length - 1];

        light.vx += random(-light.turniness, light.turniness);
        light.vy += random(-light.turniness, light.turniness);

        const magnitude = Math.sqrt(light.vx * light.vx + light.vy * light.vy);
        if (magnitude > 0) {
          light.vx /= magnitude;
          light.vy /= magnitude;
        }

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

        if (nextX < 0 || nextX > w || nextY < 0 || nextY > h) {
          lightning.splice(i, 1);
          continue;
        }

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
  }, [canvasRef]);
};
