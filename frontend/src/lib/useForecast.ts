"use client";

import { useEffect, useState } from "react";
import {
  fetchForecast, fetchLiveStations,
  type ForecastResponse, type StationPrediction,
} from "@/lib/api";

export function useForecast(initialStationId = 1) {
  const [stationId, setStationIdState] = useState(initialStationId);
  const [forecastRes, setForecastRes] = useState<ForecastResponse | null>(null);
  const [stations, setStations] = useState<StationPrediction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    fetchLiveStations()
      .then((res) => setStations(res.stations))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchForecast(stationId)
      .then((res) => {
        if (cancelled) return;
        setForecastRes(res);
        setError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [stationId, attempt]);

  const loading = forecastRes === null && error === null;
  const updating =
    forecastRes !== null &&
    error === null &&
    forecastRes.station.station_id !== stationId;

  function setStationId(id: number) {
    setError(null);
    setStationIdState(id);
  }

  function retry() {
    setError(null);
    setAttempt((n) => n + 1);
  }

  return {
    stationId, setStationId, forecastRes, stations, error, loading, updating, retry,
  };
}
