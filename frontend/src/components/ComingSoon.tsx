import type { ReactNode } from "react";

export default function ComingSoon({
  icon, title, description,
}: { icon: ReactNode; title: string; description: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 bg-page p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        {icon}
      </div>
      <h1 className="text-lg font-bold tracking-tight text-ink">{title}</h1>
      <p className="max-w-sm text-sm text-ink-secondary">{description}</p>
      <div className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
        Coming soon
      </div>
    </main>
  );
}
