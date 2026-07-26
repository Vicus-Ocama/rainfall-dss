"""
Step 10a verification: fetch real weather for Kampala and print the
daily table. Run from backend/ with:  python test_weather.py
"""

import pandas as pd

from app.demo import STATIONS
from app.weather_service import classify_rain, fetch_station_weather

pd.set_option("display.width", 160)
pd.set_option("display.max_columns", 20)

kampala = STATIONS[1]
daily = fetch_station_weather(kampala["lat"], kampala["lon"])
daily["rain_class"] = daily["rain_mm"].map(classify_rain)

print(f"\nDaily weather for {kampala['name']} "
      f"({len(daily)} days: ~10 past + 4 ahead):\n")
print(daily[["date", "T2M", "T2M_MAX", "T2M_MIN", "RH2M", "dew_point_c",
             "pressure_hpa", "WS2M", "WD2M", "ALLSKY_SFC_SW_DWN",
             "rain_mm", "rain_class", "n_hours"]].to_string(index=False))