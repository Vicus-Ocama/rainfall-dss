"""
Backend API layer (thesis Section: System Architecture).
Exposes the inference module as a RESTful interface.

Run from backend/ with:  uvicorn app.main:app --reload
Interactive docs:        http://127.0.0.1:8000/docs
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from app.advisory import generate_advisory 
from app.demo import generate_demo_features 
from app.demo import generate_demo_features, STATIONS
from app.feature_builder import forecast_days_for_station
from app.weather_service import fetch_station_weather

from app.features import CLASS_NAMES, FEATURE_NAMES
from app.inference import predict_with_explanation

app = FastAPI(
    title="Rainfall Forecast & Agricultural Decision Support API",
    description=(
        "Explainable ML rainfall occurrence forecasting for Uganda's "
        "Lake Victoria Basin. Serves XGBoost predictions with "
        "class-specific SHAP attributions."
    ),
    version="1.0.0",
)

# Allow the Next.js dev server and the deployed Vercel frontend to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    """A complete meteorological feature vector."""
    features: dict[str, float] = Field(
        ...,
        description=f"Mapping of all {len(FEATURE_NAMES)} feature names to values.",
    )


@app.get("/")
def health():
    """Service health check."""
    return {
        "status": "ok",
        "model": "XGBoost (3-class rainfall occurrence)",
        "classes": CLASS_NAMES,
        "expected_features": len(FEATURE_NAMES),
    }


@app.get("/features")
def list_features():
    """The canonical feature list, in required order."""
    return {"feature_names": FEATURE_NAMES}


@app.post("/predict")
def predict(request: PredictionRequest):
    """
    Prediction endpoint (thesis): predicted class, class probabilities,
    per-class SHAP attributions, and the bilingual advisory generated
    by the rule-based SHAP-to-language translation layer.
    """
    try:
        result = predict_with_explanation(request.features)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    result["advisory"] = generate_advisory(
        result["predicted_label"],
        result["shap_values"][result["predicted_label"]],
    )
    return result


@app.get("/demo")
def demo_prediction():
    """
    One plausible basin weather day run through the full pipeline.
    Returns prediction, SHAP values, advisory, and the raw features
    used - so the frontend can display current conditions.
    """
    features = generate_demo_features()
    result = predict_with_explanation(features)
    result["advisory"] = generate_advisory(
        result["predicted_label"],
        result["shap_values"][result["predicted_label"]],
    )
    result["features"] = features
    return result


@app.get("/demo/stations")
def demo_station_predictions():
    """
    One demo prediction per meteorological station, for the
    district-level forecast map (thesis frontend spec).
    """
    stations = []
    for station in STATIONS:
        features = generate_demo_features()
        features["station_id"] = station["station_id"]
        result = predict_with_explanation(features)
        stations.append({
            **station,
            "predicted_label": result["predicted_label"],
            "probabilities": result["probabilities"],
        })
    return {"stations": stations}



@app.get("/forecast/{station_id}")
def three_day_forecast(station_id: int, days: int = 3):
    """
    Three-day district forecast endpoint (thesis): live Open-Meteo
    data -> exact training feature construction -> prediction with
    SHAP attribution and advisory for each day.
    """
    station = next((s for s in STATIONS if s["station_id"] == station_id), None)
    if station is None:
        raise HTTPException(status_code=404, detail="Unknown station id")

    daily = fetch_station_weather(station["lat"], station["lon"])
    forecast = []
    for day in forecast_days_for_station(daily, station_id, n_days=days):
        result = predict_with_explanation(day["features"])
        result["advisory"] = generate_advisory(
            result["predicted_label"],
            result["shap_values"][result["predicted_label"]],
        )
        result["date"] = day["date"]
        result["features"] = day["features"]
        forecast.append(result)

    return {"station": station, "forecast": forecast}



@app.get("/live/stations")
def live_station_predictions():
    """Day-1 live forecast per station, for the map."""
    stations = []
    for station in STATIONS:
        daily = fetch_station_weather(station["lat"], station["lon"])
        days = forecast_days_for_station(daily, station["station_id"], n_days=1)
        if not days:
            continue
        result = predict_with_explanation(days[0]["features"])
        stations.append({
            **station,
            "date": days[0]["date"],
            "predicted_label": result["predicted_label"],
            "probabilities": result["probabilities"],
        })
    return {"stations": stations}





@app.post("/explain")
def explain(request: PredictionRequest):
    """
    Explanation endpoint (thesis): returns the full SHAP attribution
    decomposition for a prediction instance, without the probability
    payload - for clients that only need the explanation.
    """
    try:
        result = predict_with_explanation(request.features)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    return {
        "predicted_label": result["predicted_label"],
        "shap_values": result["shap_values"],
    }