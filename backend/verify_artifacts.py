"""
Step 1 verification: confirm the trained model and scaler load correctly
and report what the model expects as input.
Run from backend/ with:  python verify_artifacts.py
"""

import joblib
from pathlib import Path

MODELS_DIR = Path(__file__).parent / "models"

# ── Adjust these two filenames to match your actual files ──
MODEL_FILE = MODELS_DIR / "xgboost_final.pkl"
SCALER_FILE = MODELS_DIR / "feature_scaler.pkl"

print("Looking in:", MODELS_DIR.resolve())
print("Files found:", [f.name for f in MODELS_DIR.iterdir()])
print()

model = joblib.load(MODEL_FILE)
print("✅ Model loaded:", type(model).__name__)

n_features = getattr(model, "n_features_in_", None)
print("   Expects", n_features, "input features")

feature_names = getattr(model, "feature_names_in_", None)
if feature_names is not None:
    print("   Feature names stored in model:")
    for i, name in enumerate(feature_names):
        print(f"     {i+1:2d}. {name}")
else:
    print("   ⚠️  No feature names stored — we'll need your feature list from the thesis appendix.")

print("   Classes:", getattr(model, "classes_", "n/a"))
print()

scaler = joblib.load(SCALER_FILE)
print("✅ Scaler loaded:", type(scaler).__name__)
print("   Fitted on", getattr(scaler, "n_features_in_", "?"), "features")