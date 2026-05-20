import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

# Load dataset
df = pd.read_csv("../Dataset/data.csv")

# Select features
features = [
    "bedrooms",
    "bathrooms",
    "sqft_living",
    "sqft_lot",
    "yr_built",
    "yr_renovated"
]


target = "price"

X = df[features]
y = df[target]


# Full pipeline
model = Pipeline([
    ("imputer",SimpleImputer(strategy="median")),
    ("scaler",StandardScaler()),
    ("regressor",LinearRegression())
])


# Train test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model.fit(X_train, y_train)

# Predictions
predictions = model.predict(X_test)

# Evaluation
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print(f"Mean Absolute Error: {mae}")
print(f"R2 Score: {r2}")

# Save model
joblib.dump(model, "model.pkl")

print("Model saved successfully")
