"use client";

import dynamic from "next/dynamic";
import { Droplets, Gauge, Thermometer, Wind } from "lucide-react";
import { useForecast } from "@/lib/useForecast";
import AdvisoryPanel from "@/components/AdvisoryPanel";
import ShapPanel from "@/components/ShapPanel";
import {
  ConditionCard, ForecastError, ForecastLoading, ForecastTable,
  LEGEND, OutlookCard, StationSelector,
} from "@/components/ForecastWidgets";

const DistrictMap = dynamic(() => import("@/components/DistrictMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center text-sm text-ink-muted">
      Loading map…
    </div>
  ),
});

export default function DashboardContent() {
  const {
    stationId, setStationId, forecastRes, stations, error, loading, updating, retry,
  } = useForecast(1); // Kampala default

  if (loading) return <ForecastLoading />;

  if (error || !forecastRes || forecastRes.forecast.length === 0) {
    return <ForecastError error={error} onRetry={retry} />;
  }

  const day1 = forecastRes.forecast[0];
  const f = day1.features;
  const stationName = forecastRes.station.name;

  return (
    <main className="flex-1 space-y-4 overflow-y-auto p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <OutlookCard day={day1} station={stationName} />
        <ConditionCard icon={Thermometer} label="Temperature" value={f.T2M} unit="°C" />
        <ConditionCard icon={Droplets} label="Humidity" value={f.RH2M} unit="%" />
        <ConditionCard icon={Gauge} label="Pressure" value={f.pressure_hpa} unit="hPa" />
        <ConditionCard icon={Wind} label="Wind Speed" value={f.WS2M * 3.6} unit="km/h" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
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
        <div className="space-y-4">
          <StationSelector
            value={stationId}
            onChange={setStationId}
            updating={updating}
          />
          <ForecastTable forecast={forecastRes.forecast} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdvisoryPanel
            advisory={day1.advisory}
            predictedLabel={day1.predicted_label}
          />
        </div>
        <ShapPanel data={day1} />
      </div>

      <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
        This is a prototype system for decision support. Always combine with
        local knowledge and continuous updates.
      </div>
    </main>
  );
}
