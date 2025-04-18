declare module 'canvas-confetti' {
  type Options = {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
    resize?: boolean;
    useWorker?: boolean;
  };

  type CreateTypes = {
    (options?: Options): void;
    reset: () => void;
  };

  function create(canvas: HTMLCanvasElement, options?: { resize?: boolean; useWorker?: boolean }): CreateTypes;

  function reset(): void;

  export default function confetti(options?: Options): Promise<void> | null;
  export { create, reset };
}
