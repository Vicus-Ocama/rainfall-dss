"""
Advisory engine (thesis Sections: Class-Specific Advisory Logic and
Integration of SHAP Explanations).

Two responsibilities:
1. Map each predicted rainfall class to recommended farm actions
   (thesis Table 4.7).
2. Translate the top SHAP attributions for the predicted class into a
   plain-language explanatory sentence (rule-based translation layer),
   in English and Luganda.

NOTE: All Luganda strings are drafts and must be verified by a native
speaker before deployment/defence.
"""

from app.features import FEATURE_NAMES

# ─────────────────────────────────────────────────────────────────
# 1. Class headlines
# ─────────────────────────────────────────────────────────────────
HEADLINES = {
    "No Rain": {
        "en": "No rain is expected",
        "lg": "Enkuba tesuubirwa",  # Luganda - verify
    },
    "Moderate Rain": {
        "en": "Moderate rain is expected",
        "lg": "Enkuba ya wakati esuubirwa",  # Luganda - verify
    },
    "Heavy Rain": {
        "en": "Heavy rain is expected",
        "lg": "Enkuba ey'amaanyi esuubirwa",  # Luganda - verify
    },
}

# ─────────────────────────────────────────────────────────────────
# 2. Class-specific farm actions (thesis Table 4.7, verbatim in EN)
# ─────────────────────────────────────────────────────────────────
ACTIONS = {
    "No Rain": {
        "en": [
            "Safe for planting, fertiliser application, spraying, and harvesting.",
            "Irrigation may be required.",
        ],
        "lg": [  # Luganda - verify
            "Kirungi okusimba, okuteeka ebigimusa, okufuuyira, n'okukungula.",
            "Okufukirira kuyinza okwetaagisa.",
        ],
    },
    "Moderate Rain": {
        "en": [
            "Favourable for planting and seedbed preparation.",
            "Defer fertiliser application to avoid leaching.",
            "Light field operations feasible.",
        ],
        "lg": [  # Luganda - verify
            "Kirungi okusimba n'okutegeka ennimiro.",
            "Lindako okuteeka ebigimusa bireme okutwalibwa amazzi.",
            "Emirimu emyangu mu nnimiro gisoboka.",
        ],
    },
    "Heavy Rain": {
        "en": [
            "Postpone all non-essential field operations.",
            "Clear and reinforce drainage channels.",
            "Secure harvested produce under cover.",
            "Delay fertiliser and pesticide application.",
        ],
        "lg": [  # Luganda - verify
            "Lindako emirimu gyonna egitali gya bwetaavu mu nnimiro.",
            "Ggyamu era onyweze emikutu gy'amazzi.",
            "Kuuma ebikungule mu kifo ekibikkiddwa.",
            "Lindako okuteeka ebigimusa n'eddagala ly'ebiwuka.",
        ],
    },
}

# ─────────────────────────────────────────────────────────────────
# 3. SHAP-to-language translation layer
#    Each feature belongs to a physical concept group; each group has
#    one clause per class, phrased for the condition that pushes the
#    model TOWARD that class.
# ─────────────────────────────────────────────────────────────────
FEATURE_GROUPS = {
    "RH2M": "humidity", "roll3_humidity": "humidity",
    "roll7_humidity": "humidity", "humidity_trend3": "humidity",
    "dew_point_c": "moisture", "roll3_dewpoint": "moisture",
    "dewpoint_depression": "moisture",
    "ALLSKY_SFC_SW_DWN": "solar", "solar_anomaly7": "solar",
    "pressure_hpa": "pressure", "roll3_pressure": "pressure",
    "pressure_drop3": "pressure",
    "WS2M": "wind", "WD2M": "wind", "u10": "wind", "v10": "wind",
    "wind_speed_era5": "wind", "wind_u_nasa": "wind", "wind_v_nasa": "wind",
    "lag1_class": "recent_rain", "lag2_class": "recent_rain",
    "lag3_class": "recent_rain", "lag1_rain_mm": "recent_rain",
    "T2M": "temperature", "T2M_MAX": "temperature",
    "T2M_MIN": "temperature", "roll3_temp": "temperature",
    "month": "season", "is_MAM": "season", "is_OND": "season",
    "doy_sin": "season", "doy_cos": "season",
    # station_id intentionally has no clause - not meaningful to farmers
}

CLAUSES = {
    "humidity": {
        "No Rain": {"en": "the air is relatively dry",
                    "lg": "empewo nkalu"},  # verify
        "Moderate Rain": {"en": "the air is fairly humid",
                          "lg": "empewo erimu obunnyogovu"},  # verify
        "Heavy Rain": {"en": "the air is very humid",
                       "lg": "empewo erimu obunnyogovu bungi nnyo"},  # verify
    },
    "moisture": {
        "No Rain": {"en": "there is little moisture near the ground",
                    "lg": "wansi ku ttaka tewali bunnyogovu bungi"},  # verify
        "Moderate Rain": {"en": "moisture has built up near the ground",
                          "lg": "obunnyogovu bweyongedde okumpi n'ettaka"},  # verify
        "Heavy Rain": {"en": "the air is close to saturation",
                       "lg": "empewo ejjudde obunnyogovu okumpi okutuuka ku kkomo"},  # verify
    },
    "solar": {
        "No Rain": {"en": "skies have been clear and sunny",
                    "lg": "eggulu libadde lyeru era nga waliwo omusana"},  # verify
        "Moderate Rain": {"en": "cloud cover has been increasing",
                          "lg": "ebire byeyongedde ku ggulu"},  # verify
        "Heavy Rain": {"en": "cloud cover has increased strongly over recent days",
                       "lg": "ebire byeyongedde nnyo mu nnaku eziyise"},  # verify
    },
    "pressure": {
        "No Rain": {"en": "air pressure is steady",
                    "lg": "puleesa y'empewo nywevu"},  # verify
        "Moderate Rain": {"en": "air pressure has been falling",
                          "lg": "puleesa y'empewo ekendedde"},  # verify
        "Heavy Rain": {"en": "air pressure has dropped noticeably",
                       "lg": "puleesa y'empewo ekendedde nnyo"},  # verify
    },
    "wind": {
        "No Rain": {"en": "winds are calm",
                    "lg": "empewo mpoomu"},  # verify
        "Moderate Rain": {"en": "moist wind is blowing in from the lake",
                          "lg": "empewo ennyogovu eva ku nnyanja"},  # verify
        "Heavy Rain": {"en": "strong moist wind is blowing in from the lake",
                       "lg": "empewo ey'amaanyi ennyogovu eva ku nnyanja"},  # verify
    },
    "recent_rain": {
        "No Rain": {"en": "recent days have been dry",
                    "lg": "ennaku eziyise zibadde nkalu"},  # verify
        "Moderate Rain": {"en": "it has rained in recent days",
                          "lg": "enkuba etonnye mu nnaku eziyise"},  # verify
        "Heavy Rain": {"en": "it has already been raining in recent days",
                       "lg": "enkuba ebadde etonnya mu nnaku eziyise"},  # verify
    },
    "temperature": {
        "No Rain": {"en": "temperatures are high and stable",
                    "lg": "ebbugumu liri waggulu era nywevu"},  # verify
        "Moderate Rain": {"en": "temperatures have shifted",
                          "lg": "ebbugumu likyuse"},  # verify
        "Heavy Rain": {"en": "temperatures favour storm development",
                       "lg": "ebbugumu lisobozesa enkuba ey'amaanyi okukola"},  # verify
    },
    "season": {
        "No Rain": {"en": "this is typically a dry time of year",
                    "lg": "kino kiseera kya kyeya"},  # verify
        "Moderate Rain": {"en": "this is within the rainy season",
                          "lg": "kino kiseera kya nkuba"},  # verify
        "Heavy Rain": {"en": "this is the peak of the rainy season",
                       "lg": "kino kye kiseera enkuba w'esinga okutonnya"},  # verify
    },
}

_JOINERS = {"en": (", ", ", and "), "lg": (", ", ", era ")}  # verify 'era'
_BECAUSE = {"en": "because", "lg": "kubanga"}  # verify


def generate_advisory(predicted_label: str, shap_for_class: dict,
                      top_k: int = 3) -> dict:
    """
    Build the bilingual advisory for one prediction.

    Parameters
    ----------
    predicted_label : e.g. "Heavy Rain"
    shap_for_class  : {feature_name: shap_value} for the PREDICTED class
                      (as returned by predict_with_explanation).
    top_k           : number of explanatory clauses to include.

    Returns
    -------
    {"en": {...}, "lg": {...}} each with headline, explanation, actions,
    plus the drivers list used to build the sentence.
    """
    # Features pushing TOWARD the predicted class, strongest first
    positive = sorted(
        ((f, v) for f, v in shap_for_class.items() if v > 0),
        key=lambda kv: kv[1],
        reverse=True,
    )

    # Map to concept groups, keeping first (strongest) hit per group
    drivers, seen_groups = [], set()
    for feature, value in positive:
        group = FEATURE_GROUPS.get(feature)
        if group is None or group in seen_groups:
            continue
        seen_groups.add(group)
        drivers.append({"feature": feature, "group": group,
                        "shap_value": value})
        if len(drivers) == top_k:
            break

    advisory = {}
    for lang in ("en", "lg"):
        clauses = [CLAUSES[d["group"]][predicted_label][lang]
                   for d in drivers]
        if clauses:
            sep, last_sep = _JOINERS[lang]
            joined = (last_sep.join([sep.join(clauses[:-1]), clauses[-1]])
                      if len(clauses) > 1 else clauses[0])
            explanation = (f"{HEADLINES[predicted_label][lang]} "
                           f"{_BECAUSE[lang]} {joined}.")
        else:
            explanation = f"{HEADLINES[predicted_label][lang]}."
        advisory[lang] = {
            "headline": HEADLINES[predicted_label][lang],
            "explanation": explanation,
            "actions": ACTIONS[predicted_label][lang],
        }

    advisory["drivers"] = drivers
    return advisory 