/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState} from 'react';
import {Flower, AlertCircle, Loader2} from 'lucide-react';

type PredictionResult = {
  codigo: number;
  predicao: string;
};

export default function App() {
  const [formData, setFormData] = useState({
    sepal_length: '',
    sepal_width: '',
    petal_length: '',
    petal_width: '',
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://mlteste-a5akend9ach6c3h0.westus3-01.azurewebsites.net/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sepal_length: parseFloat(formData.sepal_length),
          sepal_width: parseFloat(formData.sepal_width),
          petal_length: parseFloat(formData.petal_length),
          petal_width: parseFloat(formData.petal_width),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('An error occurred while fetching the prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Flower className="text-emerald-500 w-8 h-8" />
            <h1 className="text-2xl font-bold text-gray-900">Iris Predictor</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace('_', ' ')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2.5 border"
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Predict'}
            </button>
          </form>

          {error && (
            <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-6 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
              <p className="text-sm text-emerald-800 font-medium">Species Predicted</p>
              <p className="text-4xl font-extrabold text-emerald-900 mt-2">{result.predicao}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
