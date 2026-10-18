import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { sponsorTier, sponsorTotal, type BrandRequest } from "@/lib/brand-presets";

export const SUPPORT_EMAIL = "support@cutecode.app";

let client: SESClient | null = null;

function getSesClient(): SESClient | null {
  if (!process.env.AWS_REGION || !process.env.SES_FROM_EMAIL) return null;
  if (!client) client = new SESClient({ region: process.env.AWS_REGION });
  return client;
}

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

function logDevLink(label: string, email: string, url: string) {
  if (process.env.NODE_ENV === "development") console.info(`[ses:dev] ${label} for ${email}: ${url}`);
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string): Promise<void> {
  const ses = getSesClient();
  const from = process.env.SES_FROM_EMAIL;

  if (!ses || !from) {
    console.info(`[ses:dev] (stub) ${subject} -> ${to}`);
    return;
  }

  await ses.send(
    new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: replyTo ? [replyTo] : undefined,
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: html } },
      },
    }),
  );
}

export async function sendVerificationEmail(params: { user: { email: string; name?: string | null }; url: string; token?: string }): Promise<void> {
  const { user, url } = params;
  logDevLink("verify email", user.email, url);
  await sendEmail(
    user.email,
    "Verify your email — CuteCode",
    `<p>Hi ${escapeHtml(user.name || "there")},</p><p>Verify your email by clicking the link below:</p><p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>`,
  );
}

export async function sendResetPassword(params: { user: { email: string; name?: string | null }; url: string; token?: string }): Promise<void> {
  const { user, url } = params;
  logDevLink("reset password", user.email, url);
  await sendEmail(
    user.email,
    "Reset your password — CuteCode",
    `<p>Hi ${escapeHtml(user.name || "there")},</p><p>Reset your password by clicking the link below:</p><p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>`,
  );
}

export async function sendBrandRequestEmail(request: BrandRequest): Promise<void> {
  const rows: [string, string][] = [
    ["Brand", request.brandName],
    ["Website", request.website],
    ["Email", request.email],
    ["Tier", sponsorTier(request.tier).name],
    ["Duration", `${request.months} mo`],
    ["Total", `$${sponsorTotal(request.tier, request.months)}`],
    ["Notes", request.notes || "None"],
  ];
  await sendEmail(
    SUPPORT_EMAIL,
    `Sponsor request: ${request.brandName}`,
    rows.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join(""),
    request.email,
  );
}
