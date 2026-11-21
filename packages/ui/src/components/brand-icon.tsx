import type { SVGProps } from "react";

export enum Brand {
  X = "x",
  LinkedIn = "linkedin",
  Facebook = "facebook",
}

const brandPaths = {
  [Brand.X]:
    "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z",
  [Brand.LinkedIn]:
    "M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z",
  [Brand.Facebook]:
    "M12 2C6.477 2 2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10Z",
};

type BrandIconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  brand: Brand;
};

export function BrandIcon({ brand, ...props }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d={brandPaths[brand]} />
    </svg>
  );
}
