import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

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

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
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
