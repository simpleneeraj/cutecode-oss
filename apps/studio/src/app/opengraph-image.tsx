import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "CuteCode. Create beautiful images of your code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const mark = await readFile(join(process.cwd(), "public/brand/logo-mark.svg"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          background: "#16120d",
          color: "#ede8de",
        }}
      >
        <img src={`data:image/svg+xml;base64,${mark}`} width={200} height={200} alt="" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3 }}>CuteCode</div>
          <div style={{ fontSize: 40, opacity: 0.7 }}>Create beautiful images of your code</div>
        </div>
      </div>
    ),
    size,
  );
}
