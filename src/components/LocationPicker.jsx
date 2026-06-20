import { useState } from 'react';
import districts from '../data/districts.json';
import { getRecommendation } from '../utils/api';

function LocationPicker({ t, onResult, onDistrictSelected }) {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    onDistrictSelected(selected);
  };

  const handleLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      // Find nearest district from our list
      const { latitude, longitude } = pos.coords;
      let nearest = districts[0];
      let minDist = Infinity;
      districts.forEach((d) => {
        const dist = Math.sqrt((d.lat - latitude) ** 2 + (d.lng - longitude) ** 2);
        if (dist < minDist) {
          minDist = dist;
          nearest = d;
        }
      });
      setSelected(nearest.name);
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: 16, color: 'var(--text-mid)' }}>
          {t.appName}...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 20px' }}>

      {/* Hero section */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🌾💧</div>
        <h2 style={{ fontSize: 20, color: 'var(--text-dark)', marginBottom: 6 }}>
          {t.tagline}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-light)' }}>
          {t.appName}
        </p>
      </div>

      {/* District selector */}
      <div className="card">
        <p className="section-title">{t.selectDistrict}</p>
        <div className="select-wrapper">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">{t.selectDistrict}...</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}, {d.state}
              </option>
            ))}
          </select>
        </div>

        <div style={{ margin: '12px 0', textAlign: 'center', color: 'var(--text-light)', fontSize: 13 }}>
          ── or ──
        </div>

        <button className="btn-secondary" onClick={handleLocation}>
          📍 {t.useLocation}
        </button>
      </div>

      {/* Submit */}
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!selected}
        style={{ marginTop: 16, opacity: selected ? 1 : 0.5 }}
      >
        {t.getRecommendation} →
      </button>
    </div>
  );
}

export default LocationPicker;