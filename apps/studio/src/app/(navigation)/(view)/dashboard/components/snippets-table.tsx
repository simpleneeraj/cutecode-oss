import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getShareUrl } from "@/lib/share/urls";
import { useSubscription } from "@/hooks/use-subscription";
import { CopyLinkButton } from "./copy-link-button";

export type DashboardSnippet = {
  id: string;
  title: string | null;
  isPublic: boolean;
  createdAt: string;
  views: number | null;
  upvotes: number | null;
  comments: number | null;
  bookmarks: number | null;
  slug: string | null;
  visibility: string | null;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

function SnippetTitle({ title, slug }: { title: string | null; slug: string | null }) {
  const label = title || "Untitled snippet";
  if (!slug) return <span className="block truncate font-medium text-foreground">{label}</span>;

  return (
    <div className="flex min-w-0 flex-col">
      <Link href={getShareUrl(slug)} target="_blank" className="truncate font-medium text-foreground hover:underline">
        {label}
      </Link>
      <span className="truncate font-mono text-xs text-muted-foreground">{slug}</span>
    </div>
  );
}

function VisibilityBadge({ isPublic }: { isPublic: boolean }) {
  return (
    <Badge variant={isPublic ? "secondary" : "outline"}>
      <Icon icon={isPublic ? "solar:global-linear" : "solar:lock-password-linear"} className="size-3" aria-hidden="true" />
      {isPublic ? "Public" : "Private"}
    </Badge>
  );
}

export function SnippetsTable({ snippets }: { snippets: DashboardSnippet[] }) {
  const { can } = useSubscription();
  const hasFullAnalytics = can("fullAnalytics");

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-2 border-b px-5 py-4">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-foreground">Your snippets</h2>
          <p className="text-xs text-muted-foreground">{snippets.length} total, newest first</p>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/snippets" />}>
          View all
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              {hasFullAnalytics && (
                <>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Upvotes</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                </>
              )}
              <TableHead>Visibility</TableHead>
              <TableHead className="text-right">Created</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {snippets.map((snippet) => (
              <TableRow key={snippet.id}>
                <TableCell className="max-w-56">
                  <SnippetTitle title={snippet.title} slug={snippet.slug} />
                </TableCell>
                {hasFullAnalytics && (
                  <>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{snippet.views}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{snippet.upvotes}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{snippet.comments}</TableCell>
                  </>
                )}
                <TableCell>
                  <VisibilityBadge isPublic={snippet.isPublic} />
                </TableCell>
                <TableCell className="text-right whitespace-nowrap text-xs text-muted-foreground">
                  {formatDate(snippet.createdAt)}
                </TableCell>
                <TableCell>{snippet.slug && <CopyLinkButton slug={snippet.slug} />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
