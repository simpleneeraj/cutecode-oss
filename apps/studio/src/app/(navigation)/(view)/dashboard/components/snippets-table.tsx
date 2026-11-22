import { Fragment } from "react";
import Link from "next/link";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@cutecode/ui/components/card";
import { Badge } from "@cutecode/ui/components/badge";
import { GlobalIcon } from "@solar-icons/react/linear/global";
import { LockPasswordIcon } from "@solar-icons/react/linear/lock-password";
import { Button } from "@cutecode/ui/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@cutecode/ui/components/table";
import { getShareUrl } from "@/lib/share/urls";
import { useSubscription } from "@/hooks/use-subscription";
import { CopyLinkButton } from "./copy-link-button";
import { tableStyles } from "./style";

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

const styles = tableStyles();

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

function SnippetTitle({ title, slug }: { title: string | null; slug: string | null }) {
  const label = title || "Untitled snippet";
  if (!slug) return <span className={styles.titleText()}>{label}</span>;

  return (
    <div className={styles.titleCell()}>
      <Link href={getShareUrl(slug)} target="_blank" className={styles.titleLink()}>
        {label}
      </Link>
      <span className={styles.slug()}>{slug}</span>
    </div>
  );
}

function VisibilityBadge({ isPublic }: { isPublic: boolean }) {
  if (!isPublic) {
    return (
      <Badge variant="outline" size="sm">
        <LockPasswordIcon aria-hidden="true" />
        Private
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" size="sm">
      <GlobalIcon aria-hidden="true" />
      Public
    </Badge>
  );
}

export function SnippetsTable({ snippets }: { snippets: DashboardSnippet[] }) {
  const { can } = useSubscription();
  const hasFullAnalytics = can("fullAnalytics");

  return (
    <Card className={styles.root()}>
      <CardHeader className={styles.header()}>
        <CardTitle className={styles.title()}>Your snippets</CardTitle>
        <CardDescription className={styles.description()}>{snippets.length} total, newest first</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" className={styles.action()} render={<Link href="/snippets" />}>
            View all
          </Button>
        </CardAction>
      </CardHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {hasFullAnalytics && (
              <Fragment>
                <TableHead className={styles.numericHead()}>Views</TableHead>
                <TableHead className={styles.numericHead()}>Upvotes</TableHead>
                <TableHead className={styles.numericHead()}>Comments</TableHead>
              </Fragment>
            )}
            <TableHead>Visibility</TableHead>
            <TableHead className={styles.numericHead()}>Created</TableHead>
            <TableHead className={styles.copyHead()} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {snippets.map((snippet) => (
            <TableRow key={snippet.id}>
              <TableCell>
                <SnippetTitle title={snippet.title} slug={snippet.slug} />
              </TableCell>
              {hasFullAnalytics && (
                <Fragment>
                  <TableCell className={styles.numeric()}>{snippet.views}</TableCell>
                  <TableCell className={styles.numeric()}>{snippet.upvotes}</TableCell>
                  <TableCell className={styles.numeric()}>{snippet.comments}</TableCell>
                </Fragment>
              )}
              <TableCell>
                <VisibilityBadge isPublic={snippet.isPublic} />
              </TableCell>
              <TableCell className={styles.date()}>{formatDate(snippet.createdAt)}</TableCell>
              <TableCell>{snippet.slug && <CopyLinkButton slug={snippet.slug} />}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
