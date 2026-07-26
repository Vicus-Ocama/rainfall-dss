"""
Writes sample_request.json - a valid /predict request body with
synthetic values, for testing the API without a frontend.
Run from backend/ with:  python make_sample.py
"""

import json

import numpy as np

from app.features import FEATURE_NAMES

rng = np.random.default_rng(7)
body = {"features": {name: round(float(rng.normal(0, 1)), 3)
                     for name in FEATURE_NAMES}}

with open("sample_request.json", "w") as f:
    json.dump(body, f, indent=2)

print("Wrote sample_request.json with", len(FEATURE_NAMES), "features.")