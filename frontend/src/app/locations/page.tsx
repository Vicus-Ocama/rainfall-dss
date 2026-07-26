"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { fetchLiveStations, type StationPrediction } from "@/lib/api";
import { CLASS_STYLES } from "@/components/ForecastWidgets";
import PageHeader from "@/components/PageHeader";

export default function LocationsPage() {
  const [stations, setStations] = useState<StationPrediction[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveStations()
      .then((res) => setStations(res.stations))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <main className="flex-1 space-y-4 overflow-y-auto p-6">
      <PageHeader
        title="Locations"
        description="Monitored stations across the Lake Victoria Basin and their current forecast."
      />

      {error && (
        <div className="rounded-lg border border-rain-heavy-border bg-rain-heavy-bg px-4 py-3 text-sm text-rain-heavy">
          Could not load stations. Is the backend running? ({error})
        </div>
      )}

      {!error && !stations && (
        <div className="text-sm text-ink-secondary">Loading stations…</div>
      )}

      {stations && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((s) => {
            const style = CLASS_STYLES[s.predicted_label];
            return (
              <div key={s.station_id} className="card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <MapPin size={15} strokeWidth={2.25} />
                  </span>
                  {s.name}
                </div>
                <div className="tabular-figure pt-2 text-xs text-ink-muted">
                  {s.lat.toFixed(3)}, {s.lon.toFixed(3)}
                </div>
                <div className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${style.bg} ${style.text}`}>
                  {s.predicted_label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
