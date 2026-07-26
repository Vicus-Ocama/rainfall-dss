"""
Step 4 verification: run one synthetic prediction and print the full
bilingual advisory. Run from backend/ with:  python test_advisory.py
"""

import numpy as np

from app.advisory import generate_advisory
from app.features import FEATURE_NAMES
from app.inference import predict_with_explanation

rng = np.random.default_rng(7)
fake_input = {name: float(rng.normal(0, 1)) for name in FEATURE_NAMES}

result = predict_with_explanation(fake_input)
advisory = generate_advisory(
    result["predicted_label"],
    result["shap_values"][result["predicted_label"]],
)

print()
print("Prediction :", result["predicted_label"],
      result["probabilities"])
print()
print("Drivers    :")
for d in advisory["drivers"]:
    print(f"  {d['feature']:22s} ({d['group']:12s}) {d['shap_value']:+.4f}")
print()
for lang, label in (("en", "ENGLISH"), ("lg", "LUGANDA (draft)")):
    print(f"── {label} ──")
    print("Explanation:", advisory[lang]["explanation"])
    for action in advisory[lang]["actions"]:
        print("  •", action)
    print()