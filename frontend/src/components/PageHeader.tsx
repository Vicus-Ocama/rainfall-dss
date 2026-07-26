export default function PageHeader({
  title, description,
}: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-lg font-bold tracking-tight text-ink">{title}</h1>
      <p className="text-sm text-ink-secondary">{description}</p>
    </div>
  );
}
