"""
Live weather data service (Step 10a).
Fetches hourly data from the Open-Meteo forecast API - which, via
past_days, returns recent observed conditions AND the coming days'
forecast in one request - and aggregates it to the daily variables
the model was trained on.

Units are aligned with training: wind in m/s, pressure is STATION-LEVEL
surface pressure (~875-885 hPa in the basin, confirmed against
features_engineered.csv), solar converted to MJ/m2/day.
"""

import math

import pandas as pd
import requests

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

HOURLY_VARS = [
    "temperature_2m",
    "relative_humidity_2m",
    "dew_point_2m",
    "surface_pressure",
    "wind_speed_10m",
    "wind_direction_10m",
    "shortwave_radiation",
    "precipitation",
]


def fetch_station_weather(lat: float, lon: float,
                          past_days: int = 10,
                          forecast_days: int = 4) -> pd.DataFrame:
    """
    Return one row per day (past_days of history + forecast_days ahead)
    with columns named to match the model's raw meteorological features.
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": ",".join(HOURLY_VARS),
        "wind_speed_unit": "ms",
        "timezone": "Africa/Kampala",
        "past_days": past_days,
        "forecast_days": forecast_days,
    }
    response = requests.get(OPEN_METEO_URL, params=params, timeout=30)
    response.raise_for_status()
    payload = response.json()

    hourly = pd.DataFrame(payload["hourly"])
    hourly["time"] = pd.to_datetime(hourly["time"])
    hourly["date"] = hourly["time"].dt.date

    # Wind as vector components (ERA5 convention), so the daily
    # direction is a proper circular average, not a naive mean.
    rad = hourly["wind_direction_10m"] * math.pi / 180.0
    hourly["u"] = -hourly["wind_speed_10m"] * rad.map(math.sin)
    hourly["v"] = -hourly["wind_speed_10m"] * rad.map(math.cos)

    daily = hourly.groupby("date").agg(
        T2M=("temperature_2m", "mean"),
        T2M_MAX=("temperature_2m", "max"),
        T2M_MIN=("temperature_2m", "min"),
        RH2M=("relative_humidity_2m", "mean"),
        dew_point_c=("dew_point_2m", "mean"),
        pressure_hpa=("surface_pressure", "mean"),
        WS2M=("wind_speed_10m", "mean"),
        u10=("u", "mean"),
        v10=("v", "mean"),
        solar_wh=("shortwave_radiation", "sum"),
        rain_mm=("precipitation", "sum"),
        n_hours=("time", "count"),
    ).reset_index()

    # Daily dominant wind direction from the mean wind vector
    daily["WD2M"] = (
        (180.0 / math.pi)
        * daily.apply(lambda r: math.atan2(-r["u10"], -r["v10"]), axis=1)
    ) % 360.0

    # Hourly W/m2 summed over the day -> MJ/m2/day
    daily["ALLSKY_SFC_SW_DWN"] = daily["solar_wh"] * 3600.0 / 1e6

    daily = daily.drop(columns=["solar_wh"])
    daily = daily.round(3)
    return daily


def classify_rain(rain_mm: float) -> int:
    """Thesis three-class scheme: <1mm -> 0, 1-10mm -> 1, >10mm -> 2."""
    if rain_mm < 1.0:
        return 0
    if rain_mm <= 10.0:
        return 1
    return 2