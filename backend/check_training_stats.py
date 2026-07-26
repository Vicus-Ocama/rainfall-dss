"""
Prints training-data means so we can align the live service's units.
Adjust CSV_PATH to where your features_engineered.csv actually lives.
"""

import pandas as pd

CSV_PATH = "/Users/vicus/Desktop/rainfall_thesis/data/processed/features_engineered.csv"

df = pd.read_csv(CSV_PATH)
cols = ["pressure_hpa", "dew_point_c", "u10", "v10", "WS2M",
        "ALLSKY_SFC_SW_DWN", "RH2M", "T2M"]
print(df.groupby("station")[cols].mean().round(2).to_string())