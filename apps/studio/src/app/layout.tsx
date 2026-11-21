import "@/styles/globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { BASE_URL } from "@/utils/common";
import { Toaster } from "@/components/toast";
import JsonLd from "@/components/seo/json-ld";
import RumMonitor from "@/components/rum-monitor";
import type { Metadata, Viewport } from "next";
import { TooltipProvider } from "@/components/tooltip";
import { ThemeProvider } from "@/components/theme-switch/theme-provider";
import SWRProvider from "@/providers/swr-provider";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const title = "CuteCode — Create beautiful images of your code";
const description =
  "Create beautiful code screenshots in seconds. Pick a theme, export HD images, share instantly. CuteCode is the best alternative to ray.so and Carbon for developers.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: title,
    template: "%s | CuteCode",
  },
  description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "code screenshot tool",
    "code image generator",
    "beautiful code screenshots",
    "ray.so alternative",
    "carbon alternative",
    "chalk.ist alternative",
    "code snippet to image",
    "syntax highlighting screenshot",
    "developer tools",
    "code export tool",
    "share code as image",
    "online code editor screenshot",
  ],
  openGraph: {
    type: "website",
    siteName: "CuteCode",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@iamsimpleneeraj",
    creator: "@iamsimpleneeraj",
    title,
    description,
  },
  applicationName: "CuteCode",
  category: "Developer Tools",
  authors: [{ name: "Neeraj", url: "https://x.com/iamsimpleneeraj" }],
  creator: "CuteCode",
  publisher: "CuteCode",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe8" },
    { media: "(prefers-color-scheme: dark)", color: "#16120d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="relative">
        <ThemeProvider>
          <SWRProvider>
            <TooltipProvider>
              <div className="isolate relative flex flex-col">{children}</div>
              <Toaster position="top-center" />
              <RumMonitor />
            </TooltipProvider>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
