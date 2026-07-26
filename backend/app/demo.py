"""
Demo feature generator: one plausible Lake Victoria Basin weather day,
in the raw units the scaler was fitted on. Used by the /demo endpoint
until the live data service is built.
"""

import math
from datetime import date

import numpy as np


def generate_demo_features() -> dict:
    rng = np.random.default_rng()
    today = date.today()
    doy = today.timetuple().tm_yday
    month = today.month

    t2m = rng.normal(23.5, 1.8)
    rh2m = float(np.clip(rng.normal(78, 9), 45, 100))
    dew_point = t2m - max(0.5, (100 - rh2m) / 5.0)
    pressure = rng.normal(881, 3.0)
    ws2m = max(0.3, rng.normal(2.8, 1.0))

    return {
        "T2M": round(t2m, 2),
        "T2M_MAX": round(t2m + rng.uniform(3, 6), 2),
        "T2M_MIN": round(t2m - rng.uniform(4, 6), 2),
        "RH2M": round(rh2m, 2),
        "WS2M": round(ws2m, 2),
        "WD2M": round(rng.uniform(0, 360), 1),
        "ALLSKY_SFC_SW_DWN": round(float(np.clip(rng.normal(18, 4), 8, 28)), 2),
        "dew_point_c": round(dew_point, 2),
        "pressure_hpa": round(pressure, 2),
        "u10": round(rng.normal(0, 1.5), 2),
        "v10": round(rng.normal(0, 1.5), 2),
        "lag1_class": int(rng.choice([0, 1, 2], p=[0.37, 0.53, 0.10])),
        "lag2_class": int(rng.choice([0, 1, 2], p=[0.37, 0.53, 0.10])),
        "lag1_rain_mm": round(float(rng.exponential(3.0)), 2),
        "roll3_humidity": round(float(np.clip(rh2m + rng.normal(0, 4), 45, 100)), 2),
        "roll7_humidity": round(float(np.clip(rh2m + rng.normal(0, 5), 45, 100)), 2),
        "roll3_temp": round(t2m + rng.normal(0, 0.8), 2),
        "roll3_pressure": round(pressure + rng.normal(0, 1.0), 2),
        "roll3_dewpoint": round(dew_point + rng.normal(0, 0.8), 2),
        "month": month,
        "is_MAM": 1 if month in (3, 4, 5) else 0,
        "is_OND": 1 if month in (10, 11, 12) else 0,
        "wind_speed_era5": round(ws2m + rng.normal(0, 0.5), 2),
        "wind_u_nasa": round(rng.normal(0, 1.5), 2),
        "wind_v_nasa": round(rng.normal(0, 1.5), 2),
        "pressure_drop3": round(rng.normal(0, 1.5), 2),
        "dewpoint_depression": round(t2m - dew_point, 2),
        "humidity_trend3": round(rng.normal(0, 4), 2),
        "solar_anomaly7": round(rng.normal(0, 3), 2),
        "doy_sin": round(math.sin(2 * math.pi * doy / 365.25), 4),
        "doy_cos": round(math.cos(2 * math.pi * doy / 365.25), 4),
        "lag3_class": int(rng.choice([0, 1, 2], p=[0.37, 0.53, 0.10])),
        "station_id": int(rng.integers(0, 4)),
    }
    

# Station coordinates and IDs exactly as in the thesis appendix
# (Table: Station Coordinates).
STATIONS = [
    {"station_id": 0, "name": "Entebbe", "lat": 0.0667, "lon": 32.4667},
    {"station_id": 1, "name": "Kampala", "lat": 0.3156, "lon": 32.5825},
    {"station_id": 2, "name": "Jinja", "lat": 0.4244, "lon": 33.2042},
    {"station_id": 3, "name": "Masaka", "lat": -0.3333, "lon": 31.7333},
]