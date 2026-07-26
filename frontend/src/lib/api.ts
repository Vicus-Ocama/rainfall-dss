const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

export interface AdvisoryLang {
  headline: string;
  explanation: string;
  actions: string[];
}

export interface Driver {
  feature: string;
  group: string;
  shap_value: number;
}

export interface Advisory {
  en: AdvisoryLang;
  lg: AdvisoryLang;
  drivers: Driver[];
}

export interface PredictionResult {
  predicted_class: number;
  predicted_label: string;
  probabilities: Record<string, number>;
  shap_values: Record<string, Record<string, number>>;
  advisory: Advisory;
  features: Record<string, number>;
}

export async function fetchDemo(): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/demo`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export interface StationPrediction {
  station_id: number;
  name: string;
  lat: number;
  lon: number;
  predicted_label: string;
  probabilities: Record<string, number>;
}

export async function fetchStations(): Promise<{
  stations: StationPrediction[];
}> {
  const res = await fetch(`${API_BASE}/demo/stations`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export interface ForecastDay extends PredictionResult {
  date: string;
}

export interface ForecastResponse {
  station: { station_id: number; name: string; lat: number; lon: number };
  forecast: ForecastDay[];
}

export async function fetchForecast(
  stationId: number,
): Promise<ForecastResponse> {
  const res = await fetch(`${API_BASE}/forecast/${stationId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function fetchLiveStations(): Promise<{
  stations: StationPrediction[];
}> {
  const res = await fetch(`${API_BASE}/live/stations`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}