// src/features/lightning/types.ts

export interface LightningBolt {
  x: number;
  y: number;
  vx: number;
  vy: number;
  path: { x: number; y: number }[];
  pathLimit: number;
  speed: number;
  turniness: number;
}
