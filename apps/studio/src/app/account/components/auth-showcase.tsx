import { Window } from "@cutecode/ui/tactile/window";
import { CodeTone, codeToneStyles, showcaseStyles } from "./style";

const lines: [string, CodeTone][][] = [
  [
    ["export function ", CodeTone.Keyword],
    ["greet", CodeTone.Function],
    ["(", CodeTone.Punctuation],
    ["name", CodeTone.Parameter],
    [": ", CodeTone.Punctuation],
    ["string", CodeTone.Type],
    [") {", CodeTone.Punctuation],
  ],
  [
    ["  return ", CodeTone.Keyword],
    ["`Hello, ${", CodeTone.String],
    ["name", CodeTone.Parameter],
    ["}`", CodeTone.String],
    [";", CodeTone.Punctuation],
  ],
  [["}", CodeTone.Punctuation]],
];

const styles = showcaseStyles();

export function AuthShowcase() {
  return (
    <aside className={styles.root()}>
      <div className={styles.stage()}>
        <figure aria-hidden="true" className={styles.figure()}>
          <Window title="greet.ts">
            <pre className={styles.code()}>
              <code>
                {lines.map((tokens, row) => (
                  <div key={row}>
                    {tokens.map(([text, tone], column) => (
                      <span key={column} className={codeToneStyles({ tone })}>
                        {text}
                      </span>
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          </Window>
        </figure>

        <p className={styles.caption()}>Beautiful code, ready to share in seconds.</p>
      </div>
    </aside>
  );
}
