const tone = {
  keyword: "text-[hsl(14_78%_70%)]",
  fn: "text-[hsl(40_88%_70%)]",
  param: "text-[hsl(30_40%_88%)]",
  type: "text-[hsl(190_45%_72%)]",
  string: "text-[hsl(90_38%_70%)]",
  punct: "text-[hsl(35_14%_62%)]",
};

const lines: [string, keyof typeof tone][][] = [
  [
    ["export function ", "keyword"],
    ["greet", "fn"],
    ["(", "punct"],
    ["name", "param"],
    [": ", "punct"],
    ["string", "type"],
    [") {", "punct"],
  ],
  [
    ["  return ", "keyword"],
    ["`Hello, ${", "string"],
    ["name", "param"],
    ["}`", "string"],
    [";", "punct"],
  ],
  [["}", "punct"]],
];

export function AuthShowcase() {
  return (
    <aside className="hidden p-2 lg:flex">
      <div className="relative flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden rounded-3xl bg-[hsl(28_36%_11%)] px-12 dark:bg-[hsl(30_22%_10%)] dark:ring-1 dark:ring-white/6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,hsl(32_85%_58%/0.22),transparent_70%)]" />

        <figure aria-hidden="true" className="relative w-full max-w-md motion-safe:animate-slideUpAndFade">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-linear-to-br from-[hsl(38_92%_62%)] via-[hsl(18_82%_58%)] to-[hsl(340_70%_60%)] opacity-30 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl bg-[hsl(30_18%_8%)] shadow-2xl ring-1 ring-white/10">
            <div className="relative flex h-10 items-center gap-2 px-4">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="absolute inset-x-0 text-center font-mono text-xs text-white/40">greet.ts</span>
            </div>
            <pre className="px-6 pt-2 pb-6 font-mono text-[13px] leading-6">
              <code>
                {lines.map((tokens, row) => (
                  <div key={row}>
                    {tokens.map(([text, kind], col) => (
                      <span key={col} className={tone[kind]}>
                        {text}
                      </span>
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </figure>

        <p className="relative max-w-sm text-center font-heading text-2xl font-semibold tracking-tight text-balance text-[hsl(40_30%_94%)]">
          Beautiful code, ready to share in seconds.
        </p>
      </div>
    </aside>
  );
}
