import { useState } from "react";
import axios from "axios";
import { Home, BedDouble, Bath, Sparkles } from "lucide-react";

function PredictionForm() {
  const [formData, setFormData] = useState({
    city: '',
    bedrooms: '',
    bathrooms: '',
    sqft_living: '',
    sqft_lot: '',
    sqft_above: '',
    sqft_basement: '',
    floors: '',
    waterfront: '',
    view: '',
    condition: '',
    yr_built: '',
    yr_renovated: ''
  })

  const [predictedPrice, setPredictedPrice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setPredictedPrice(null)
    
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData)
      if (response.data.success) {
        setPredictedPrice(response.data.predicted_price)
      } else {
        setError(response.data.error)
      }
    } catch (err) {
      setError('Failed to connect to the backend server. Ensure Flask is running on port 5000.')
    }
    setLoading(false)
  }

  return (
    <div className="app-container">
      <div className="glass-card">
        
        <div className="card-header">
          <h1 className="card-title">Real Estate Evaluation Model</h1>
          <p className="card-subtitle">Enter property details to generate a dynamic prediction.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form-grid">
          
          <div className="input-group col-span-3">
            <label className="input-label">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g., Seattle" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Bedrooms</label>
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="e.g., 3" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Bathrooms</label>
            <input type="number" step="0.25" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="e.g., 2.5" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Floors</label>
            <input type="number" step="0.5" name="floors" value={formData.floors} onChange={handleChange} placeholder="e.g., 2" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Living Area (sqft)</label>
            <input type="number" name="sqft_living" value={formData.sqft_living} onChange={handleChange} placeholder="e.g., 2000" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Lot Size (sqft)</label>
            <input type="number" name="sqft_lot" value={formData.sqft_lot} onChange={handleChange} placeholder="e.g., 5000" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Sqft Above</label>
            <input type="number" name="sqft_above" value={formData.sqft_above} onChange={handleChange} placeholder="e.g., 1500" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Sqft Basement</label>
            <input type="number" name="sqft_basement" value={formData.sqft_basement} onChange={handleChange} placeholder="e.g., 500 (0 if none)" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Year Built</label>
            <input type="number" name="yr_built" value={formData.yr_built} onChange={handleChange} placeholder="e.g., 1995" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Year Renovated</label>
            <input type="number" name="yr_renovated" value={formData.yr_renovated} onChange={handleChange} placeholder="e.g., 2010 (0 if none)" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Condition (1-5)</label>
            <input type="number" min="1" max="5" name="condition" value={formData.condition} onChange={handleChange} placeholder="1 to 5" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">View (0-4)</label>
            <input type="number" min="0" max="4" name="view" value={formData.view} onChange={handleChange} placeholder="0 to 4" className="form-input" required />
          </div>

          <div className="input-group">
            <label className="input-label">Waterfront (0 or 1)</label>
            <input type="number" min="0" max="1" name="waterfront" value={formData.waterfront} onChange={handleChange} placeholder="0 = No, 1 = Yes" className="form-input" required />
          </div>

          <div className="col-span-3 submit-btn-container">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Running Gradient Boosting Regressor...' : 'Calculate Estimate'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {predictedPrice !== null && !error && (
          <div className="result-box">
            <p className="result-label">Model Prediction</p>
            <h2 className="result-value">
              ${predictedPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
          </div>
        )}
        
      </div>
    </div>
  );
}
export default PredictionForm;


