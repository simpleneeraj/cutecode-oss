import { createAvatarSvg } from "@/lib/avatar";

export async function GET(_request: Request, ctx: RouteContext<"/api/avatar/[seed]">) {
  const { seed } = await ctx.params;

  return new Response(createAvatarSvg(decodeURIComponent(seed)), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
