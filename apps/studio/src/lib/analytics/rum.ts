import type { AwsRum } from "aws-rum-web";

let client: AwsRum | undefined;

function rumConfig() {
  const applicationId = process.env.NEXT_PUBLIC_RUM_APP_MONITOR_ID;
  const identityPoolId = process.env.NEXT_PUBLIC_RUM_IDENTITY_POOL_ID;
  const region = process.env.NEXT_PUBLIC_RUM_REGION;
  if (!applicationId || !identityPoolId || !region) return null;
  const endpoint = process.env.NEXT_PUBLIC_RUM_ENDPOINT || `https://dataplane.rum.${region}.amazonaws.com`;
  return { applicationId, identityPoolId, region, endpoint };
}

export async function startRum(): Promise<void> {
  const config = rumConfig();
  if (client || !config) return;
  const { AwsRum } = await import("aws-rum-web");
  client = new AwsRum(config.applicationId, "1.0.0", config.region, {
    identityPoolId: config.identityPoolId,
    endpoint: config.endpoint,
    sessionSampleRate: 1,
    telemetries: ["errors", "performance", "http"],
  });
}

export function recordRumEvent(type: string, data: object): void {
  client?.recordEvent(type, data);
}
