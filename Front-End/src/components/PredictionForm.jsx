import { useState } from "react";
import axios from "axios";
import { Home, BedDouble, Bath, Sparkles } from "lucide-react";

function PredictionForm() {
  const [formData, setFormData] = useState({
    sqft_living: "",
    bedrooms: "",
    bathrooms: "",
    condition: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setPrediction(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        {
          sqft_living: Number(formData.sqft_living),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          condition: Number(formData.condition)
        }
      );

      setTimeout(() => {
        setPrediction(response.data.predicted_price);
        setLoading(false);
      }, 1200);

    } catch (error) {
      console.error(error);
      alert("Prediction failed");
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="background-glow"></div>
       <div className="card">
        <div className="title-section">
          <div className="icon-wrapper">
            <Home size={32} />
          </div>

          <h1>House Price Predictor</h1>

          <p>
            Predict modern housing prices using Machine Learning.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <BedDouble size={18} />
            <input
              type="number"
              name="bedrooms"
              placeholder="Bedrooms"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Bath size={18} />
            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Home size={18} />
            <input
              type="number"
              name="sqft_living"
              placeholder="Living Area (sqft)"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Sparkles size={18} />
            <input
              type="number"
              name="condition"
              placeholder="Condition (1-5)"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="predict-btn">
            {loading ? "Predicting..." : "Predict Price"}
          </button>
        </form>

        {prediction && (
          <div className="result">
            <p>Predicted Price: ${prediction.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionForm;


