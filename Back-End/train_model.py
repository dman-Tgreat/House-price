import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# ── 1. Load & clean ──────────────────────────────────────────────────────────
df = pd.read_csv("../Dataset/data.csv")

# Drop rows with no price (not useful for training)
df = df[df["price"] > 0].copy()

# ── 2. Feature engineering ───────────────────────────────────────────────────
df["house_age"] = 2015 - df["yr_built"]
df["was_renovated"] = (df["yr_renovated"] > 0).astype(int)
df["years_since_reno"] = df.apply(
    lambda r: 2015 - r["yr_renovated"] if r["yr_renovated"] > 0 else r["house_age"],
    axis=1,
)
df["total_sqft"] = df["sqft_living"] + df["sqft_lot"]
df["sqft_per_room"] = df["sqft_living"] / (df["bedrooms"] + df["bathrooms"] + 1)
df["log_sqft"] = np.log1p(df["sqft_living"])
df["bed_bath_ratio"] = df["bedrooms"] / (df["bathrooms"] + 1)

# ── 3. Target-encode city using training split only (prevents data leakage) ──
X_raw, X_test_raw = train_test_split(df, test_size=0.2, random_state=42)

global_median = X_raw["price"].median()
city_median = X_raw.groupby("city")["price"].median()

for frame in [X_raw, X_test_raw]:
    frame["city_median_price"] = frame["city"].map(city_median).fillna(global_median)

# ── 4. Select features ───────────────────────────────────────────────────────
FEATURES = [
    "bedrooms",
    "bathrooms",
    "sqft_living",
    "sqft_lot",
    "floors",
    "waterfront",
    "view",
    "condition",
    "sqft_above",
    "sqft_basement",
    "house_age",
    "was_renovated",
    "years_since_reno",
    "total_sqft",
    "sqft_per_room",
    "log_sqft",
    "bed_bath_ratio",
    "city_median_price",
]

X_train = X_raw[FEATURES]
X_test = X_test_raw[FEATURES]

# Log-transform the target — reduces the impact of extreme outliers
y_train = np.log1p(X_raw["price"])
y_test = np.log1p(X_test_raw["price"])

# ── 5. Pipeline ───────────────────────────────────────────────────────────────
model = Pipeline(
    [
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        (
            "regressor",
            GradientBoostingRegressor(
                n_estimators=600,
                max_depth=5,
                learning_rate=0.04,
                min_samples_leaf=5,
                subsample=0.8,
                random_state=42,
            ),
        ),
    ]
)

# ── 6. Train ─────────────────────────────────────────────────────────────────
print("Training model …")
model.fit(X_train, y_train)

# ── 7. Evaluate (convert back from log scale for interpretable metrics) ──────
log_preds = model.predict(X_test)
preds = np.expm1(log_preds)
actuals = np.expm1(y_test)

mae = mean_absolute_error(actuals, preds)
r2 = r2_score(actuals, preds)
mape = np.mean(np.abs((actuals - preds) / actuals)) * 100

print(f"\n{'=' * 35}")
print(f"  Mean Absolute Error : ${mae:,.0f}")
print(f"  R² Score            : {r2:.4f}")
print(f"  MAPE                : {mape:.1f}%")
print(f"{'=' * 35}\n")

# ── 8. Save ───────────────────────────────────────────────────────────────────
payload = {
    "model": model,
    "features": FEATURES,
    "city_median": city_median,
    "global_median": global_median,
}
joblib.dump(payload, "model.pkl")
print("Model saved to model.pkl")
