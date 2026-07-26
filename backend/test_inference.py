"""
Step 2 verification. Feeds one synthetic feature vector through the
full pipeline. The prediction itself is meaningless (random inputs) -
we are testing that the plumbing works end to end.
Run from backend/ with:  python test_inference.py
"""

import numpy as np

from app.features import FEATURE_NAMES
from app.inference import predict_with_explanation

rng = np.random.default_rng(42)
fake_input = {name: float(rng.normal(0, 1)) for name in FEATURE_NAMES}

result = predict_with_explanation(fake_input)

print()
print("Predicted class :", result["predicted_class"],
      "->", result["predicted_label"])
print("Probabilities   :", result["probabilities"])
print()

label = result["predicted_label"]
top5 = sorted(
    result["shap_values"][label].items(),
    key=lambda kv: abs(kv[1]),
    reverse=True,
)[:5]
print(f"Top 5 SHAP contributions for '{label}':")
for feature, value in top5:
    print(f"  {feature:22s} {value:+.4f}")