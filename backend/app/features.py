"""
Canonical feature order and class labels.
The order below is exactly the order presented to the models during
training, as recorded in the thesis appendix (Complete Feature List).
NEVER reorder this list - the scaler and model both depend on it.
"""

FEATURE_NAMES = [
    "T2M", "T2M_MAX", "T2M_MIN", "RH2M", "WS2M", "WD2M",
    "ALLSKY_SFC_SW_DWN", "dew_point_c", "pressure_hpa", "u10", "v10",
    "lag1_class", "lag2_class", "lag1_rain_mm",
    "roll3_humidity", "roll7_humidity", "roll3_temp",
    "roll3_pressure", "roll3_dewpoint",
    "month", "is_MAM", "is_OND",
    "wind_speed_era5", "wind_u_nasa", "wind_v_nasa",
    "pressure_drop3", "dewpoint_depression", "humidity_trend3",
    "solar_anomaly7", "doy_sin", "doy_cos", "lag3_class", "station_id",
]

CLASS_NAMES = {0: "No Rain", 1: "Moderate Rain", 2: "Heavy Rain"}