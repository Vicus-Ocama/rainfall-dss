"use client";

import { Calendar, MapPin } from "lucide-react";

export default function TopBar() {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface/95 px-6 py-3.5 backdrop-blur-sm">
      <div className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-ink">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <MapPin size={17} strokeWidth={2.25} />
        </span>
        Lake Victoria Basin, Uganda
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-line bg-page px-3 py-1.5 text-sm font-medium text-ink-secondary">
        <Calendar size={15} className="text-ink-muted" />
        <span className="tabular-figure">{today}</span>
      </div>
    </header>
  );
}
