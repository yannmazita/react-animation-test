// src/features/lightning/utils/random.ts

export const random = (min: number, max: number): number =>
  Math.random() * (max - min) + min;
