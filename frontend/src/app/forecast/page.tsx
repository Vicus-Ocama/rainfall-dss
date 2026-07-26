"use client";

import dynamic from "next/dynamic";
import { useForecast } from "@/lib/useForecast";
import {
  ForecastError, ForecastLoading, ForecastTable, LEGEND, OutlookCard,
  StationSelector,
} from "@/components/ForecastWidgets";
import PageHeader from "@/components/PageHeader";

const DistrictMap = dynamic(() => import("@/components/DistrictMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center text-sm text-ink-muted">
      Loading map…
    </div>
  ),
});

export default function ForecastPage() {
  const {
    stationId, setStationId, forecastRes, stations, error, loading, updating, retry,
  } = useForecast(1);

  if (loading) return <ForecastLoading />;
  if (error || !forecastRes || forecastRes.forecast.length === 0) {
    return <ForecastError error={error} onRetry={retry} />;
  }

  const day1 = forecastRes.forecast[0];
  const stationName = forecastRes.station.name;

  return (
    <main className="flex-1 space-y-4 overflow-y-auto p-6">
      <PageHeader
        title="Forecast"
        description="Detailed rainfall outlook and station map for the selected location."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-1">
          <StationSelector value={stationId} onChange={setStationId} updating={updating} />
          <OutlookCard day={day1} station={stationName} />
          <ForecastTable forecast={forecastRes.forecast} />
        </div>
        <div className="card p-4 xl:col-span-2">
          <div className="flex items-center justify-between pb-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Station Forecast Map (Tomorrow)
            </div>
            <div className="flex gap-3">
              {LEGEND.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-ink-secondary">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <DistrictMap stations={stations} />
        </div>
      </div>
    </main>
  );
}
