export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { ensureRuntimeSecrets } = await import("@/lib/secrets");
  await ensureRuntimeSecrets();
}
