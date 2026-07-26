"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { StationPrediction } from "@/lib/api";

export const CLASS_COLORS: Record<string, string> = {
  "No Rain": "#0ca30c",
  "Moderate Rain": "#fab219",
  "Heavy Rain": "#d03b3b",
};

export default function DistrictMap({
  stations,
}: {
  stations: StationPrediction[];
}) {
  return (
    <MapContainer
      center={[0.15, 32.6]}
      zoom={8}
      scrollWheelZoom={false}
      className="z-0 h-80 w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map((s) => (
        <CircleMarker
          key={s.station_id}
          center={[s.lat, s.lon]}
          radius={14}
          pathOptions={{
            color: "#ffffff",
            weight: 2,
            fillColor: CLASS_COLORS[s.predicted_label] ?? "#94a3b8",
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-bold">{s.name}</div>
              <div>{s.predicted_label}</div>
              <div className="pt-1 text-xs text-slate-500">
                {Object.entries(s.probabilities)
                  .map(([k, v]) => `${k}: ${Math.round(v * 100)}%`)
                  .join(" · ")}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}