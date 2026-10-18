export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CuteCode",
    url: "https://cutecode.app",
    description:
      "Create beautiful code screenshots in seconds. Pick a theme, export HD images, share instantly. CuteCode is the best alternative to ray.so and Carbon for developers.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    inLanguage: "en",
    isAccessibleForFree: true,
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Free Plan",
        description: "Core code screenshot features and 3 publishes a day with up to 25 live snippets. No credit card required.",
      },
      {
        "@type": "Offer",
        price: "5",
        priceCurrency: "USD",
        name: "Pro Plan",
        description: "Premium themes and fonts, 3x image export, no watermark and 30 publishes a day. $48 billed yearly.",
      },
      {
        "@type": "Offer",
        price: "12",
        priceCurrency: "USD",
        name: "Premium Plan",
        description: "Everything in Pro plus 4x and 6x export, HD video exports, private shares, per-snippet analytics and 100 publishes a day. $120 billed yearly.",
      },
    ],
    featureList: [
      "Beautiful code screenshots",
      "Syntax highlighting for 100+ languages",
      "Custom themes and fonts",
      "Export as PNG or copy to clipboard",
      "Share code snippets via URL",
      "Dark and light mode support",
      "Embed snippets anywhere",
    ],
    screenshot: "https://cutecode.app/og-image.png",
    author: {
      "@type": "Organization",
      name: "CuteCode",
      url: "https://cutecode.app",
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
