from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)
# Enable CORS for the React frontend
CORS(app)

# Load the comprehensive model payload
try:
    payload = joblib.load("model.pkl")
    model = payload["model"]
    FEATURES = payload["features"]
    city_median = payload["city_median"]
    global_median = payload["global_median"]
except Exception as e:
    print(f"Error loading model. Ensure model.pkl exists. Details: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # 1. Extract base user inputs
        city = data.get('city', '').strip().title()
        yr_built = int(data.get('yr_built', 1990))
        yr_renovated = int(data.get('yr_renovated', 0))
        sqft_living = float(data.get('sqft_living', 0))
        sqft_lot = float(data.get('sqft_lot', 0))
        bedrooms = float(data.get('bedrooms', 0))
        bathrooms = float(data.get('bathrooms', 0))
        
        # 2. Recreate Feature Engineering exactly as in train_model.py
        house_age = 2015 - yr_built
        was_renovated = 1 if yr_renovated > 0 else 0
        years_since_reno = (2015 - yr_renovated) if yr_renovated > 0 else house_age
        total_sqft = sqft_living + sqft_lot
        sqft_per_room = sqft_living / (bedrooms + bathrooms + 1)
        log_sqft = np.log1p(sqft_living)
        bed_bath_ratio = bedrooms / (bathrooms + 1)
        
        # Apply target-encoded city median
        city_median_price = city_median.get(city, global_median)

        # 3. Assemble the raw row data
        row = {
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "sqft_living": sqft_living,
            "sqft_lot": sqft_lot,
            "floors": float(data.get('floors', 1)),
            "waterfront": float(data.get('waterfront', 0)),
            "view": float(data.get('view', 0)),
            "condition": float(data.get('condition', 3)),
            "sqft_above": float(data.get('sqft_above', sqft_living)), # Default to sqft_living if not provided
            "sqft_basement": float(data.get('sqft_basement', 0)),
            "house_age": house_age,
            "was_renovated": was_renovated,
            "years_since_reno": years_since_reno,
            "total_sqft": total_sqft,
            "sqft_per_room": sqft_per_room,
            "log_sqft": log_sqft,
            "bed_bath_ratio": bed_bath_ratio,
            "city_median_price": city_median_price
        }
        
        # 4. Convert to DataFrame and align columns with training data
        df_pred = pd.DataFrame([row])
        df_pred = df_pred[FEATURES] 
        
        # 5. Predict and convert from log scale
        log_preds = model.predict(df_pred)
        predicted_price = np.expm1(log_preds)[0]
        
        return jsonify({
            'success': True,
            'predicted_price': round(float(predicted_price), 2)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)