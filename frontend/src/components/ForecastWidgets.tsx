"use client";

import { CloudOff, CloudRain, MapPin, RefreshCw } from "lucide-react";
import type { ForecastDay } from "@/lib/api";

export const STATION_OPTIONS = [
  { id: 0, name: "Entebbe" },
  { id: 1, name: "Kampala" },
  { id: 2, name: "Jinja" },
  { id: 3, name: "Masaka" },
];

export const CLASS_STYLES: Record<
  string,
  { text: string; bg: string; border: string; bar: string; accent: string }
> = {
  "No Rain": {
    text: "text-rain-none", bg: "bg-rain-none-bg", border: "border-rain-none-border",
    bar: "bg-rain-none-accent", accent: "#0ca30c",
  },
  "Moderate Rain": {
    text: "text-rain-moderate", bg: "bg-rain-moderate-bg", border: "border-rain-moderate-border",
    bar: "bg-rain-moderate-accent", accent: "#fab219",
  },
  "Heavy Rain": {
    text: "text-rain-heavy", bg: "bg-rain-heavy-bg", border: "border-rain-heavy-border",
    bar: "bg-rain-heavy-accent", accent: "#d03b3b",
  },
};

export const LEGEND = [
  { label: "No Rain", color: "#0ca30c" },
  { label: "Moderate Rain", color: "#fab219" },
  { label: "Heavy Rain", color: "#d03b3b" },
];

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });
}

export function OutlookCard({ day, station }: { day: ForecastDay; station: string }) {
  const style = CLASS_STYLES[day.predicted_label];
  const confidence = Math.round(
    (day.probabilities[day.predicted_label] ?? 0) * 100,
  );
  return (
    <div className={`card flex flex-col justify-between border p-4 ${style.bg} ${style.border}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-secondary">
        <CloudRain size={15} /> Tomorrow — {station}
      </div>
      <div className={`py-1 text-2xl font-extrabold uppercase tracking-tight ${style.text}`}>
        {day.predicted_label}
      </div>
      <div className="text-sm font-medium text-ink-secondary">
        {formatDate(day.date)}
        <span className={`tabular-figure ml-2 font-bold ${style.text}`}>
          Confidence: {confidence}%
        </span>
      </div>
    </div>
  );
}

export function ConditionCard({
  icon: Icon, label, value, unit,
}: { icon: React.ElementType; label: string; value: number; unit: string }) {
  return (
    <div className="card flex flex-col justify-between p-4 transition-shadow hover:shadow-(--shadow-card-lg)">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon size={19} strokeWidth={2} />
      </span>
      <div className="tabular-figure pt-3 text-2xl font-bold text-ink">
        {value.toFixed(1)} <span className="text-base font-medium text-ink-secondary">{unit}</span>
      </div>
      <div className="text-sm text-ink-muted">{label}</div>
    </div>
  );
}

export function ForecastTable({ forecast }: { forecast: ForecastDay[] }) {
  return (
    <div className="card p-4">
      <div className="pb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        3-Day Rainfall Forecast
      </div>
      <div className="space-y-2.5">
        {forecast.map((day) => {
          const style = CLASS_STYLES[day.predicted_label];
          return (
            <div
              key={day.date}
              className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2.5 transition-colors hover:border-brand-200"
            >
              <div className="w-24 text-sm font-medium text-ink-secondary">
                {formatDate(day.date)}
              </div>
              <div className={`flex-1 text-sm font-bold ${style.text}`}>
                {day.predicted_label}
              </div>
              <div className="flex w-40 flex-col gap-1">
                {Object.entries(day.probabilities).map(([label, p]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="h-1.5 flex-1 rounded-full bg-page">
                      <div
                        className={`h-1.5 rounded-full ${CLASS_STYLES[label].bar}`}
                        style={{ width: `${Math.max(2, p * 100)}%` }}
                      />
                    </div>
                    <span className="tabular-figure w-8 text-right text-xs text-ink-muted">
                      {Math.round(p * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StationSelector({
  value, onChange, updating,
}: { value: number; onChange: (id: number) => void; updating: boolean }) {
  return (
    <div className="card p-4">
      <div className="pb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Select Location
      </div>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <MapPin size={16} strokeWidth={2.25} />
        </span>
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 rounded-lg border border-line bg-page px-3 py-2 text-sm font-medium text-ink focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          {STATION_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} District
            </option>
          ))}
        </select>
      </div>
      {updating && (
        <div className="flex items-center gap-1.5 pt-2 text-xs text-ink-muted">
          <RefreshCw size={12} className="animate-spin" />
          Fetching live forecast…
        </div>
      )}
    </div>
  );
}

export function ForecastLoading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 bg-page text-ink-secondary">
      <RefreshCw size={22} className="animate-spin text-brand-500" />
      Fetching live weather and running the model…
    </main>
  );
}

export function ForecastError({
  error, onRetry,
}: { error: string | null; onRetry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 bg-page text-center text-ink-secondary">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rain-heavy-bg text-rain-heavy">
        <CloudOff size={22} />
      </span>
      <div className="font-medium text-ink">Could not load the live forecast. Is the backend running?</div>
      <div className="max-w-sm text-xs text-ink-muted">{error}</div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-colors hover:bg-brand-600"
      >
        <RefreshCw size={15} /> Retry
      </button>
    </main>
  );
}
