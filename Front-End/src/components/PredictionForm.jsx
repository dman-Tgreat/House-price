import { useState } from "react";
import axios from "axios";
import {Home ,BedDouble ,Bath ,Sparkles } from "lucide-react";

function PredictionForm() {
  const [formData, setFormData] = useState({
    bedrooms: "",
    bathrooms: "",
    sqft_living: "",
    sqft_lot: "",
    yr_built: "",
    yr_renovated: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading,setLoading] = useState(false);

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
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          sqft_living: Number(formData.sqft_living),
          sqft_lot: Number(formData.sqft_lot),
          yr_built: Number(formData.yr_built),
          yr_renovated: Number(formData.yr_renovated)
        }
      );

      setTimeout(() => {
        setPrediction(response.data.predicted_price);
        setLoading(false);
      },1200);

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
            <Home size = {32} />
          </div>
           <h1>House Price Predictor</h1>
           <p>Predict modern housing prices using Machine Learning.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <BedDouble size={18} />
            <input type="number" name="bedrooms" placeholder="Bedrooms" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <Bath size={18} />
            <input type="number" name="bathrooms" placeholder="Bathrooms" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <Home size={18} />
            <input type="number" name="sqft-living" placeholder="Living Area" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <Sparkles size={18} />
            <input type="number" name="sqft_lot" placeholder="Lot Size" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <Sparkles size={18} />
            <input type="number" name="yr_built" placeholder="Year Built" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <Sparkles size={18} />
            <input type="number" name="yr_renovated" placeholder="Year Renovated" onChange={handleChange} required />
          </div>
          <button type="submit">
            {loading ? (
              <div className="spinner"></div>
            ): (
                "Predict Price"
            )}
        </button>
        </form>
        {prediction && (
          <div className="result-animate-result">
            <h2>Estimated Price</h2>
            <p>${prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionForm;