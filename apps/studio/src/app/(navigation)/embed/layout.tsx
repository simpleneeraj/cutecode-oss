export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-slot="embed" className="layout-fill">
      {children}
    </div>
  );
}
