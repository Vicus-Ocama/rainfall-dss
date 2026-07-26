"use client";

import { Droplets, Gauge, Sun, Thermometer, Wind } from "lucide-react";
import { useForecast } from "@/lib/useForecast";
import { ConditionCard, ForecastError, ForecastLoading, StationSelector } from "@/components/ForecastWidgets";
import PageHeader from "@/components/PageHeader";

export default function WeatherConditionsPage() {
  const {
    stationId, setStationId, forecastRes, error, loading, updating, retry,
  } = useForecast(1);

  if (loading) return <ForecastLoading />;
  if (error || !forecastRes || forecastRes.forecast.length === 0) {
    return <ForecastError error={error} onRetry={retry} />;
  }

  const f = forecastRes.forecast[0].features;

  return (
    <main className="flex-1 space-y-4 overflow-y-auto p-6">
      <PageHeader
        title="Weather Conditions"
        description={`Live atmospheric readings for ${forecastRes.station.name} used as model inputs.`}
      />

      <div className="max-w-sm">
        <StationSelector value={stationId} onChange={setStationId} updating={updating} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <ConditionCard icon={Thermometer} label="Temperature" value={f.T2M} unit="°C" />
        <ConditionCard icon={Droplets} label="Humidity" value={f.RH2M} unit="%" />
        <ConditionCard icon={Gauge} label="Pressure" value={f.pressure_hpa} unit="hPa" />
        <ConditionCard icon={Wind} label="Wind Speed" value={f.WS2M * 3.6} unit="km/h" />
        <ConditionCard icon={Thermometer} label="Dew Point" value={f.dew_point_c} unit="°C" />
        <ConditionCard icon={Sun} label="Solar Radiation" value={f.ALLSKY_SFC_SW_DWN} unit="kWh/m²" />
      </div>
    </main>
  );
}
