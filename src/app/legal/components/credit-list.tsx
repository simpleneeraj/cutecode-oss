export type Credit = {
  name: string;
  href: string;
  license: string;
  by?: string;
};

type CreditListProps = {
  credits: Credit[];
};

export default function CreditList({ credits }: CreditListProps) {
  return (
    <ul className="not-prose divide-y overflow-hidden rounded-xl border">
      {credits.map((credit) => (
        <li key={credit.href} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
          <span className="min-w-0 truncate">
            <a href={credit.href} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:underline">
              {credit.name}
            </a>
            {credit.by && <span className="text-muted-foreground"> by {credit.by}</span>}
          </span>
          <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{credit.license}</span>
        </li>
      ))}
    </ul>
  );
}
