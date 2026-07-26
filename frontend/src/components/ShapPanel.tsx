"use client";

import { useState } from "react";
import {
  Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import type { PredictionResult } from "@/lib/api";

// Human-readable labels for the 33 model features
const FEATURE_LABELS: Record<string, string> = {
  T2M: "Temperature",
  T2M_MAX: "Max Temperature",
  T2M_MIN: "Min Temperature",
  RH2M: "Relative Humidity",
  WS2M: "Wind Speed",
  WD2M: "Wind Direction",
  ALLSKY_SFC_SW_DWN: "Solar Radiation",
  dew_point_c: "Dew Point",
  pressure_hpa: "Pressure",
  u10: "Zonal Wind (ERA5)",
  v10: "Meridional Wind (ERA5)",
  lag1_class: "Yesterday's Rain Class",
  lag2_class: "Rain Class (2 Days Ago)",
  lag3_class: "Rain Class (3 Days Ago)",
  lag1_rain_mm: "Yesterday's Rainfall",
  roll3_humidity: "3-Day Avg Humidity",
  roll7_humidity: "7-Day Avg Humidity",
  roll3_temp: "3-Day Avg Temperature",
  roll3_pressure: "3-Day Avg Pressure",
  roll3_dewpoint: "3-Day Avg Dew Point",
  month: "Month",
  is_MAM: "MAM Season",
  is_OND: "OND Season",
  wind_speed_era5: "Wind Speed (ERA5)",
  wind_u_nasa: "Zonal Wind (NASA)",
  wind_v_nasa: "Meridional Wind (NASA)",
  pressure_drop3: "3-Day Pressure Drop",
  dewpoint_depression: "Dewpoint Depression",
  humidity_trend3: "3-Day Humidity Trend",
  solar_anomaly7: "7-Day Solar Anomaly",
  doy_sin: "Season Cycle (sin)",
  doy_cos: "Season Cycle (cos)",
  station_id: "Station",
};

const POSITIVE = "#e34948"; // pushes toward the class
const NEGATIVE = "#2a78d6"; // pushes away from the class

export default function ShapPanel({ data }: { data: PredictionResult }) {
  const classNames = Object.keys(data.shap_values);
  const [selected, setSelected] = useState(data.predicted_label);

  const rows = Object.entries(data.shap_values[selected])
    .map(([feature, value]) => ({
      name: FEATURE_LABELS[feature] ?? feature,
      value,
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 8);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between pb-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          SHAP Explanation
        </div>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-lg border border-line bg-page px-2 py-1 text-sm text-ink-secondary focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          {classNames.map((c) => (
            <option key={c} value={c}>
              Explain: {c}
            </option>
          ))}
        </select>
      </div>
      <div className="pb-2 text-xs text-ink-muted">
        Top feature contributions for “{selected}”
        {selected === data.predicted_label ? " (predicted class)" : ""}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis type="number" tick={{ fontSize: 11, fill: "#8b8f98" }} stroke="#e4e4e0" />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fontSize: 11, fill: "#52565f" }}
            stroke="#e4e4e0"
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8, border: "1px solid #e4e4e0", fontSize: 12,
              boxShadow: "0 4px 12px rgba(16,17,20,0.08)",
            }}
            formatter={(value) => [
              `${Number(value) >= 0 ? "+" : ""}${Number(value).toFixed(3)}`,
              "SHAP value",
            ]}
          />
          <ReferenceLine x={0} stroke="#c3c2b7" />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {rows.map((row) => (
              <Cell
                key={row.name}
                fill={row.value >= 0 ? POSITIVE : NEGATIVE}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex gap-4 pt-1 text-xs text-ink-secondary">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: POSITIVE }} />
          Increases likelihood
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: NEGATIVE }} />
          Decreases likelihood
        </span>
      </div>
    </div>
  );
}