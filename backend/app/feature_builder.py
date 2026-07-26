"""
Feature builder (Step 10b): constructs the exact 33-feature vector for
a forecast day, replicating the thesis feature-engineering notebook
definition-for-definition:
  - rolling windows INCLUDE the current day (min_periods=1 semantics)
  - humidity_trend3 = RH[t] - RH[t-3]
  - pressure_drop3  = pressure[t-3] - pressure[t]
  - solar_anomaly7  = solar[t] - mean(solar[t-6..t])
  - wind_u_nasa = WS2M*cos(rad WD2M); wind_v_nasa = WS2M*sin(rad WD2M)
  - wind_speed_era5 = sqrt(u10^2 + v10^2)
  - doy_sin/cos use 365
  - all values rounded to 4 dp

Lag features for forecast days beyond day+1 use Open-Meteo's own
precipitation forecast for intermediate days (documented in thesis
limitations).
"""

import math

import numpy as np
import pandas as pd

from app.weather_service import classify_rain


def build_feature_vector(daily: pd.DataFrame, target_idx: int,
                         station_id: int) -> dict:
    """
    daily      : output of fetch_station_weather (chronological rows).
    target_idx : row index of the forecast day to build features for.
    """
    if target_idx < 7:
        raise ValueError("Need at least 7 days of history before target.")

    row = daily.iloc[target_idx]
    date = pd.Timestamp(row["date"])

    def past(offset: int, col: str) -> float:
        return float(daily.iloc[target_idx - offset][col])

    def window_mean(col: str, window: int) -> float:
        # Includes the current day, matching rolling(...).mean() training
        return float(
            daily.iloc[target_idx - window + 1: target_idx + 1][col].mean()
        )

    t2m = float(row["T2M"])
    ws2m = float(row["WS2M"])
    wd2m = float(row["WD2M"])
    u10 = float(row["u10"])
    v10 = float(row["v10"])
    dew = float(row["dew_point_c"])
    doy = date.dayofyear

    features = {
        # Direct meteorological variables (forecast day)
        "T2M": t2m,
        "T2M_MAX": float(row["T2M_MAX"]),
        "T2M_MIN": float(row["T2M_MIN"]),
        "RH2M": float(row["RH2M"]),
        "WS2M": ws2m,
        "WD2M": wd2m,
        "ALLSKY_SFC_SW_DWN": float(row["ALLSKY_SFC_SW_DWN"]),
        "dew_point_c": dew,
        "pressure_hpa": float(row["pressure_hpa"]),
        "u10": u10,
        "v10": v10,
        # Lag features
        "lag1_class": classify_rain(past(1, "rain_mm")),
        "lag2_class": classify_rain(past(2, "rain_mm")),
        "lag1_rain_mm": past(1, "rain_mm"),
        # Rolling windows (current day included)
        "roll3_humidity": window_mean("RH2M", 3),
        "roll7_humidity": window_mean("RH2M", 7),
        "roll3_temp": window_mean("T2M", 3),
        "roll3_pressure": window_mean("pressure_hpa", 3),
        "roll3_dewpoint": window_mean("dew_point_c", 3),
        # Seasonal indicators
        "month": int(date.month),
        "is_MAM": 1 if date.month in (3, 4, 5) else 0,
        "is_OND": 1 if date.month in (10, 11, 12) else 0,
        # Wind features (training formulas, verbatim)
        "wind_speed_era5": math.sqrt(u10 ** 2 + v10 ** 2),
        "wind_u_nasa": ws2m * math.cos(math.radians(wd2m)),
        "wind_v_nasa": ws2m * math.sin(math.radians(wd2m)),
        # Pressure tendency
        "pressure_drop3": past(3, "pressure_hpa") - float(row["pressure_hpa"]),
        # Physics-based features
        "dewpoint_depression": t2m - dew,
        "humidity_trend3": float(row["RH2M"]) - past(3, "RH2M"),
        "solar_anomaly7": float(row["ALLSKY_SFC_SW_DWN"])
        - window_mean("ALLSKY_SFC_SW_DWN", 7),
        "doy_sin": math.sin(2 * math.pi * doy / 365),
        "doy_cos": math.cos(2 * math.pi * doy / 365),
        "lag3_class": classify_rain(past(3, "rain_mm")),
        "station_id": station_id,
    }
    return {k: (round(v, 4) if isinstance(v, float) else v)
            for k, v in features.items()}


def forecast_days_for_station(daily: pd.DataFrame, station_id: int,
                              n_days: int = 3) -> list[dict]:
    """
    Identify the first n_days forecast rows (dates after today) and
    return (date, features) for each.
    """
    today = pd.Timestamp.now(tz="Africa/Kampala").date()
    out = []
    for idx in range(len(daily)):
        if daily.iloc[idx]["date"] > today and len(out) < n_days:
            out.append({
                "date": str(daily.iloc[idx]["date"]),
                "features": build_feature_vector(daily, idx, station_id),
            })
    return out