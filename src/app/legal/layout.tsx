export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-muted px-4 py-16 md:px-8">
      <div className="mx-auto max-w-4xl prose dark:prose-invert">{children}</div>
    </div>
  );
}
