import { BadgeVariant } from "@/typings/editor";

const siteConfig = {
  name: "CuteCode",
  version: "1.0.0",
  logo: "/favicon.png",
  tabs: [
    { label: "Create", value: "Create", href: "/", tags: [] },
    { label: "Snippets", value: "Snippets", href: "/snippets", tags: [BadgeVariant.PREMIUM] },  ],
};

export default siteConfig;
