import { VideoFormat } from "./enums";

export type VideoFormatOption = {
  value: VideoFormat;
  label: string;
  extension: string;
  fps: number;
  pixelRatio: number;
};

export type Size = {
  width: number;
  height: number;
};
