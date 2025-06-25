// src/features/lightning/types.ts

/**
 * Defines where lightning bolts can start
 * - 'edges': Random edge (default behavior)
 * - 'top' | 'right' | 'bottom' | 'left': Specific edge
 * - Custom function returning {x, y} coordinates
 */
export type StartPosition =
  | "edges"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | ((canvasWidth: number, canvasHeight: number) => { x: number; y: number });

/**
 * Controls position distribution along edges
 * - 'uniform': Even distribution (default)
 * - 'center': Bias toward center of edge
 * - 'corners': Bias toward corners
 * - Custom function returning 0-1 value for position along edge
 */
export type PositionBias =
  | "uniform"
  | "center"
  | "corners"
  | ((random: number) => number);

/**
 * Defines initial velocity vectors
 * - 'inward': Points toward canvas interior (default)
 * - 'outward': Points away from canvas
 * - 'random': Random direction
 * - number: Fixed angle in radians
 * - Custom function returning {vx, vy} normalized vector
 */
export type StartVelocity =
  | "inward"
  | "outward"
  | "random"
  | number
  | ((
      edge: "top" | "right" | "bottom" | "left",
      x: number,
      y: number,
      canvasWidth: number,
      canvasHeight: number,
    ) => { vx: number; vy: number });

/**
 * @interface LightningBolt
 *
 * Represents the state and properties of a single lightning bolt instance.
 *
 * @field x - The starting horizontal coordinate.
 * @field y - The starting vertical coordinate.
 * @field vx - The horizontal velocity vector, defining the bolt's general direction.
 * @field vy - The vertical velocity vector, defining the bolt's general direction.
 * @field path - An array of {x, y} coordinates that form the segments of the bolt.
 * @field pathLimit - The maximum number of segments the bolt can have before it is removed.
 * @field speed - The base speed, influencing the length of each new segment.
 * @field turniness - A factor determining how much the bolt's direction can change per frame.
 */
export interface LightningBolt {
  x: number;
  y: number;
  vx: number;
  vy: number;
  path: { x: number; y: number }[];
  pathLimit: number;
  speed: number;
  turniness: number;
  lineWidth: number;
}

/**
 * @interface LightningOptions
 *
 * Configuration options for customizing the lightning effect.
 *
 * @field minDelay - The minimum number of physics ticks (at 60 ticks/sec) before a new lightning storm can be created.
 * @field maxDelay - The maximum number of physics ticks (at 60 ticks/sec) before a new lightning storm can be created.
 * @field minCreateCount - The minimum number of individual bolts to create in a single storm.
 * @field maxCreateCount - The maximum number of individual bolts to create in a single storm.
 * @field minPathLength - The minimum number of segments a bolt can have.
 * @field maxPathLength - The maximum number of segments a bolt can have.
 * @field minSpeed - The minimum base speed/length for each bolt segment per tick.
 * @field maxSpeed - The maximum base speed/length for each bolt segment per tick.
 * @field minTurniness - The minimum factor for how much a bolt can change direction per tick.
 * @field maxTurniness - The maximum factor for how much a bolt can change direction per tick.
 * @field minLineWidth - The minimum pixel width of the rendered bolt line.
 * @field maxLineWidth - The maximum pixel width of the rendered bolt line.
 * @field blur - The size of the glow/blur effect around the lightning.
 * @field blurColor - The color of the glow/blur effect.
 * @field strokeColor - The primary color of the lightning bolt itself.
 * @field trailLength - The number of physics ticks (at 60 ticks/sec) that a trail will last, determining its fade-out duration.
 * @field startPosition - Defines where new lightning bolts originate. Can be a predefined string ('edges', 'top', etc.) or a custom function.
 * @field startPositionBias - When using an edge-based `startPosition`, controls the distribution of bolts along that edge.
 * @field startVelocity - Defines initial direction vector for new lightning bolts. Can be a predefined string, a fixed angle (in radians), or a custom function. The vector will be normalized internally.
 */
export interface LightningOptions {
  // Timing
  minDelay: number;
  maxDelay: number;

  // Bolt creation
  minCreateCount: number;
  maxCreateCount: number;

  // Bolt physics
  minPathLength: number;
  maxPathLength: number;
  minSpeed: number;
  maxSpeed: number;
  minTurniness: number;
  maxTurniness: number;

  // Aesthetics
  minLineWidth: number;
  maxLineWidth: number;
  blur: number;
  blurColor: string;
  strokeColor: string;
  trailLength: number;

  // Starting position and velocity
  startPosition?: StartPosition;
  startPositionBias?: PositionBias;
  startVelocity?: StartVelocity;
}
