import { useState } from "react";
import axios from "axios";

function PredictionForm() {
  const [formData, setFormData] = useState({
    bedrooms: "",
    bathrooms: "",
    sqft_living: "",
    sqft_lot: "",
    floors: "",
    waterfront: "",
    view: "",
    condition: "",
    sqft_above: "",
    sqft_basement: "",
    yr_built: "",
    yr_renovated: "",
    city: ""
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        {
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          sqft_living: Number(formData.sqft_living),
          sqft_lot: Number(formData.sqft_lot),
          floors: Number(formData.floors),
          waterfront: Number(formData.waterfront),
          view: Number(formData.view),
          condition: Number(formData.condition),
          sqft_above: Number(formData.sqft_above),
          sqft_basement: Number(formData.sqft_basement),
          yr_built: Number(formData.yr_built),
          yr_renovated: Number(formData.yr_renovated),
          city: formData.city
        }
      );

      setPrediction(response.data.predicted_price);
    } catch (error) {
      console.error(error);
      alert("Prediction failed");
    }
  };

  return (
    <div className="card">
      <h1>House Price Predictor</h1>

      <form onSubmit={handleSubmit}>
        <input type="number" name="bedrooms" placeholder="Bedrooms" onChange={handleChange} />
        <input type="number" name="bathrooms" placeholder="Bathrooms" onChange={handleChange} />
        <input type="number" name="sqft_living" placeholder="Living Area" onChange={handleChange} />
        <input type="number" name="sqft_lot" placeholder="Lot Size" onChange={handleChange} />
        <input type="number" name="floors" placeholder="Floors" onChange={handleChange} />
        <input type="number" name="waterfront" placeholder="Waterfront (0 or 1)" onChange={handleChange} />
        <input type="number" name="view" placeholder="View Score" onChange={handleChange} />
        <input type="number" name="condition" placeholder="Condition" onChange={handleChange} />
        <input type="number" name="sqft_above" placeholder="Sqft Above" onChange={handleChange} />
        <input type="number" name="sqft_basement" placeholder="Basement Sqft" onChange={handleChange} />
        <input type="number" name="yr_built" placeholder="Year Built" onChange={handleChange} />
        <input type="number" name="yr_renovated" placeholder="Year Renovated" onChange={handleChange} />
        <input type="text" name="city" placeholder="City" onChange={handleChange} />

        <button type="submit">
          Predict Price
        </button>
      </form>

      {prediction && (
        <div className="result">
          Predicted Price: ${prediction}
        </div>
      )}
    </div>
  );
}

export default PredictionForm;