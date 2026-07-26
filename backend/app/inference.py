"""
Machine learning layer (thesis Section: System Architecture).
Loads the serialised XGBoost model and StandardScaler, constructs a
SHAP TreeExplainer at startup, and exposes predict_with_explanation(),
which returns the three outputs specified in the thesis:
  1. class probabilities for all three rainfall categories,
  2. the predicted class label,
  3. the per-class SHAP attribution vector.
"""

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap

from app.features import FEATURE_NAMES, CLASS_NAMES

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

# ── Loaded ONCE at import time (service start-up), not per request ──
print("Loading model artifacts...")
model = joblib.load(MODELS_DIR / "xgboost_final.pkl")
scaler = joblib.load(MODELS_DIR / "feature_scaler.pkl")
explainer = shap.TreeExplainer(model)
print("Model, scaler, and SHAP TreeExplainer ready.")


def _shap_matrix(shap_output: object) -> np.ndarray:
    """
    Normalise SHAP output for one sample to shape (3 classes, 33 features).
    Different shap versions return different shapes; this handles both.
    """
    if isinstance(shap_output, list):
        # Older shap: list of 3 arrays, each (1, 33)
        return np.array([cls_vals[0] for cls_vals in shap_output])
    arr = np.array(shap_output)
    if arr.ndim == 3:
        # Newer shap: (1 sample, 33 features, 3 classes) -> (3, 33)
        return arr[0].T
    raise ValueError(f"Unexpected SHAP output shape: {arr.shape}")


def predict_with_explanation(features: dict) -> dict:
    """
    Run one forecast.

    Parameters
    ----------
    features : dict mapping every name in FEATURE_NAMES to a number.

    Returns
    -------
    dict with predicted class, label, probabilities, and SHAP values.
    """
    missing = [name for name in FEATURE_NAMES if name not in features]
    if missing:
        raise ValueError(f"Missing features: {missing}")

    # 1. Assemble the row in canonical order and scale it
    row = pd.DataFrame(
        [[float(features[name]) for name in FEATURE_NAMES]],
        columns=FEATURE_NAMES,
    )
    X = scaler.transform(row)

    # 2. Class probabilities and predicted label
    probabilities = model.predict_proba(X)[0]
    predicted_class = int(np.argmax(probabilities))

    # 3. Per-class SHAP attributions
    shap_values = _shap_matrix(explainer.shap_values(X))

    return {
        "predicted_class": predicted_class,
        "predicted_label": CLASS_NAMES[predicted_class],
        "probabilities": {
            CLASS_NAMES[i]: round(float(p), 4)
            for i, p in enumerate(probabilities)
        },
        "shap_values": {
            CLASS_NAMES[c]: {
                feature: round(float(shap_values[c, f]), 4)
                for f, feature in enumerate(FEATURE_NAMES)
            }
            for c in range(len(CLASS_NAMES))
        },
    }