"""
Step 10b verification: live 3-day forecast for each station.
Run from backend/ with:  python test_forecast.py
"""

from app.demo import STATIONS
from app.feature_builder import forecast_days_for_station
from app.inference import predict_with_explanation
from app.weather_service import fetch_station_weather

for station in STATIONS:
    daily = fetch_station_weather(station["lat"], station["lon"])
    print(f"\n── {station['name']} ──")
    for day in forecast_days_for_station(daily, station["station_id"]):
        result = predict_with_explanation(day["features"])
        probs = ", ".join(f"{k}: {v:.0%}"
                          for k, v in result["probabilities"].items())
        print(f"  {day['date']}: {result['predicted_label']:14s} ({probs})")