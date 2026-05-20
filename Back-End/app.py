from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load trained pipeline model
model = joblib.load("model.pkl")


@app.route("/")
def home():
    return {"message": "House Price Prediction API Running"}


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        features = pd.DataFrame(
            [
                {
                    "bedrooms": data["bedrooms"],
                    "bathrooms": data["bathrooms"],
                    "sqft_living": data["sqft_living"],
                    "sqft_lot": data["sqft_lot"],
                    "yr_built": data["yr_built"],
                    "yr_renovated": data["yr_renovated"]
                }
            ]
        )

        prediction = model.predict(features)

        return jsonify({"predicted_price": round(float(prediction[0]), 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
