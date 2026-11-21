declare module "gifenc" {
  type Palette = number[][];

  type WriteFrameOptions = {
    palette?: Palette;
    delay?: number;
    repeat?: number;
    transparent?: boolean;
  };

  type Encoder = {
    writeFrame: (index: Uint8Array, width: number, height: number, options?: WriteFrameOptions) => void;
    finish: () => void;
    bytes: () => Uint8Array<ArrayBuffer>;
  };

  export function GIFEncoder(): Encoder;
  export function quantize(rgba: Uint8Array | Uint8ClampedArray, maxColors: number): Palette;
  export function applyPalette(rgba: Uint8Array | Uint8ClampedArray, palette: Palette): Uint8Array;
}
