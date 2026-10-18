import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../init";
import { brandRequestSchema } from "@/lib/brand-presets";
import { brandRequestRateLimit, checkRateLimit } from "@/lib/in-memory-store";
import { sendBrandRequestEmail } from "@/lib/ses";

export const brandRouter = router({
  request: publicProcedure.input(brandRequestSchema).mutation(async ({ ctx, input }) => {
    const [byIp, byEmail] = await Promise.all([
      checkRateLimit(brandRequestRateLimit, `ip:${ctx.ip}`),
      checkRateLimit(brandRequestRateLimit, `email:${input.email}`),
    ]);
    if (!byIp.success || !byEmail.success) {
      throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests. Please try again later." });
    }

    await sendBrandRequestEmail(input);
    return { ok: true };
  }),
});
