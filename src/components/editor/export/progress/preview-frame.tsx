import { useEffect, useRef } from "react";

type PreviewFrameProps = {
  frame: HTMLCanvasElement;
};

export default function PreviewFrame({ frame }: PreviewFrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    canvas.width = frame.width;
    canvas.height = frame.height;
    context.drawImage(frame, 0, 0);
  }, [frame]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 size-full" />
  );
}
