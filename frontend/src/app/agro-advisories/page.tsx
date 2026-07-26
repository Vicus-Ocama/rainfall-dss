"use client";

import { useForecast } from "@/lib/useForecast";
import { ForecastError, ForecastLoading, StationSelector, formatDate } from "@/components/ForecastWidgets";
import AdvisoryPanel from "@/components/AdvisoryPanel";
import PageHeader from "@/components/PageHeader";

export default function AgroAdvisoriesPage() {
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
        title="Agro-Advisories"
        description={`Actionable guidance for ${forecastRes.station.name}, generated from each day's forecast.`}
      />

      <div className="max-w-sm">
        <StationSelector value={stationId} onChange={setStationId} updating={updating} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {forecastRes.forecast.map((day) => (
          <div key={day.date}>
            <div className="pb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {formatDate(day.date)}
            </div>
            <AdvisoryPanel advisory={day.advisory} predictedLabel={day.predicted_label} />
          </div>
        ))}
      </div>
    </main>
  );
}
