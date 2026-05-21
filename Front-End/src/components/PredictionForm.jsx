import { useState } from "react";
import axios from "axios";
import {Home ,BedDouble ,Bath ,Sparkles } from "lucide-react";

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

  // Dynamically captures exactly what the user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Submits the user's data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setPredictedPrice(null)
    
    try {
      // Sends the user-inputted formData to your Flask API
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
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 text-[#c9d1d9] font-sans">
      
      <div className="bg-[#161b22]/90 backdrop-blur-md border border-[#30363d] shadow-2xl rounded-2xl p-8 max-w-4xl w-full">
        <div className="mb-8 border-b border-[#30363d] pb-4">
          <h1 className="text-3xl font-semibold text-white tracking-tight">Real Estate Evaluation Model</h1>
          <p className="text-[#8b949e] mt-2 text-sm">Enter property details to generate a dynamic prediction.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="flex flex-col md:col-span-3">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g., Seattle"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Bedrooms</label>
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="e.g., 3"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Bathrooms</label>
            <input type="number" step="0.25" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="e.g., 2.5"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Floors</label>
            <input type="number" step="0.5" name="floors" value={formData.floors} onChange={handleChange} placeholder="e.g., 2"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Living Area (sqft)</label>
            <input type="number" name="sqft_living" value={formData.sqft_living} onChange={handleChange} placeholder="e.g., 2000"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Lot Size (sqft)</label>
            <input type="number" name="sqft_lot" value={formData.sqft_lot} onChange={handleChange} placeholder="e.g., 5000"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Sqft Above</label>
            <input type="number" name="sqft_above" value={formData.sqft_above} onChange={handleChange} placeholder="e.g., 1500"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Sqft Basement</label>
            <input type="number" name="sqft_basement" value={formData.sqft_basement} onChange={handleChange} placeholder="e.g., 500 (0 if none)"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Year Built</label>
            <input type="number" name="yr_built" value={formData.yr_built} onChange={handleChange} placeholder="e.g., 1995"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Year Renovated</label>
            <input type="number" name="yr_renovated" value={formData.yr_renovated} onChange={handleChange} placeholder="e.g., 2010 (0 if none)"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Condition (1-5)</label>
            <input type="number" min="1" max="5" name="condition" value={formData.condition} onChange={handleChange} placeholder="1 to 5"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">View (0-4)</label>
            <input type="number" min="0" max="4" name="view" value={formData.view} onChange={handleChange} placeholder="0 to 4"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Waterfront (0 or 1)</label>
            <input type="number" min="0" max="1" name="waterfront" value={formData.waterfront} onChange={handleChange} placeholder="0 = No, 1 = Yes"
                   className="bg-[#0d1117] border border-[#30363d] rounded-md p-2.5 text-white outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all" required />
          </div>

          <div className="md:col-span-3 mt-6">
            <button type="submit" disabled={loading} 
                    className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2.5 px-4 rounded-md transition duration-200 ease-in-out border border-[rgba(240,246,252,0.1)] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Running Gradient Boosting Regressor...' : 'Calculate Estimate'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.4)] text-[#ff7b72] rounded-md text-sm">
            {error}
          </div>
        )}

        {predictedPrice !== null && !error && (
          <div className="mt-8 p-6 bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded-md text-center">
            <h2 className="text-xs text-[#58a6ff] font-semibold mb-2 uppercase tracking-wider">Model Prediction</h2>
            <p className="text-5xl font-bold text-white tracking-tight">
              ${predictedPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionForm;