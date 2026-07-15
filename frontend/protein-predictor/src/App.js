import { useState } from 'react';

import leftImage from './left.png';
import rightImage from './right.png';

function App() {

  const [hours, setHours] = useState('');
  const [intensity, setIntensity] = useState('');
  const [core, setCore] = useState('');

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);


  const [error, setError] = useState('');

  async function handlePredict() {


    if (!hours || !intensity || !core) {
      setError('Please fill in all 3 fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hours: parseFloat(hours),
          intensity: parseFloat(intensity),
          core: parseFloat(core)
        })
      });

      const data = await response.json();

      setResult(data);

    } catch (err) {
      setError('Could not connect to server. Make sure Flask is running.');
    }

    setLoading(false);
  }

  return (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
    
    {/* Left image */}
    <img src={leftImage} alt="left" style={{ width: '180px', height: 'auto' }} />

    {/* Your existing form div goes here untouched */}
    <div style={{ maxWidth: '480px', margin: '0 40px', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h2>Protein Recovery Predictor</h2>

      <label>Hours slept</label>
      <br />
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        placeholder="e.g. 7.5"
        style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
      />

      <br />
      <label>Workout intensity (1–10)</label>
      <br />
      <input
        type="number"
        value={intensity}
        onChange={(e) => setIntensity(e.target.value)}
        placeholder="e.g. 8"
        style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
      />

      <br />
      <label>Core minutes</label>
      <br />
      <input
        type="number"
        value={core}
        onChange={(e) => setCore(e.target.value)}
        placeholder="e.g. 20"
        style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
      />

      <br /><br />

      {error && (
        <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>
      )}

      <button
        onClick={handlePredict}
        style={{ width: '100%', padding: '10px', fontSize: '16px', cursor: 'pointer' }}
      >
        {loading ? 'Calculating...' : 'Predict'}
      </button>

      {result && (
        <div style={{ marginTop: '32px' }}>

          {/* Linear Regression result */}
          <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '12px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888' }}>Linear Regression</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              Protein needed: {result.protein}g
            </p>
          </div>

          {/* Decision Tree result */}
          <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '12px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888' }}>Decision Tree</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              Tomorrow: {result.decision_tree}
            </p>
          </div>

          {/* Logistic Regression result */}
          <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888' }}>Logistic Regression</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              Tomorrow: {result.logistic_regression}
            </p>
          </div>

        </div>
      )}

    </div>

      {/* Right image */}
    <img src={rightImage} alt="right" style={{ width: '180px', height: 'auto' }} />
  </div>
  );
}

export default App;