"use client";

import { useForecast } from "@/lib/useForecast";
import { ForecastError, ForecastLoading, StationSelector, formatDate } from "@/components/ForecastWidgets";
import ShapPanel from "@/components/ShapPanel";
import PageHeader from "@/components/PageHeader";

export default function ShapExplanationsPage() {
  const {
    stationId, setStationId, forecastRes, error, loading, updating, retry,
  } = useForecast(1);

  if (loading) return <ForecastLoading />;
  if (error || !forecastRes || forecastRes.forecast.length === 0) {
    return <ForecastError error={error} onRetry={retry} />;
  }

  return (
    <main className="flex-1 space-y-4 overflow-y-auto p-6">
      <PageHeader
        title="SHAP Explanations"
        description={`Feature contributions behind each forecast day's prediction, for ${forecastRes.station.name}.`}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <StationSelector value={stationId} onChange={setStationId} updating={updating} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {forecastRes.forecast.map((day) => (
          <div key={day.date}>
            <div className="pb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {formatDate(day.date)}
            </div>
            <ShapPanel data={day} />
          </div>
        ))}
      </div>
    </main>
  );
}
