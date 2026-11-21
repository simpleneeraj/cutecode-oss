function hashSeed(seed: string) {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick(hash: number, shift: number, range: number) {
  return (hash >>> shift) % range;
}

export function createAvatarSvg(seed: string) {
  const hash = hashSeed(seed.trim().toLowerCase() || "user");
  const hue = pick(hash, 0, 360);
  const offset = 30 + pick(hash, 9, 50);
  const secondHue = (hue + (pick(hash, 15, 2) === 0 ? offset : 360 - offset)) % 360;
  const orbX = 92 + pick(hash, 17, 18);
  const orbY = 98 + pick(hash, 21, 16);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
<defs>
<linearGradient id="orb" x1="0" y1="0" x2="1" y2="1"><stop offset="0.15" stop-color="hsl(${hue} 85% 62%)"/><stop offset="0.85" stop-color="hsl(${secondHue} 82% 58%)"/></linearGradient>
<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
</defs>
<rect width="160" height="160" fill="hsl(${hue} 60% 87%)"/>
<circle cx="${orbX}" cy="${orbY}" r="58" fill="url(#orb)" filter="url(#blur)"/>
<rect width="160" height="160" filter="url(#grain)" opacity="0.14" style="mix-blend-mode:overlay"/>
</svg>`;
}

export function avatarUrl(seed: string) {
  return `/api/avatar/${encodeURIComponent(seed || "user")}`;
}
