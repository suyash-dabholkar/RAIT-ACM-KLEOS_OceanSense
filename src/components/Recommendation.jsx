import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CropCard from './CropCard';

function Recommendation({ t, data, district, onBack }) {
  const chartData = data.projection.years.map((year, i) => ({
    year,
    current: data.projection.currentCrop[i],
    recommended: data.projection.recommended[i],
  }));

  const statusClass =
    data.groundwaterLevel === 'Critical' ? 'badge-critical' :
    data.groundwaterLevel === 'Overexploited' ? 'badge-overexploited' :
    'badge-semi-critical';

  const statusText =
    data.groundwaterLevel === 'Critical' ? t.critical :
    data.groundwaterLevel === 'Overexploited' ? t.overexploited :
    t.semiCritical;

  // Calculate water savings percentage
  const lastYear = data.projection.years.length - 1;
  const currentDrop = data.projection.currentCrop[lastYear] - data.projection.currentCrop[0];
  const recommendedDrop = data.projection.recommended[lastYear] - data.projection.recommended[0];
  const waterSaved = Math.round(((currentDrop - recommendedDrop) / currentDrop) * 100);

  const topCrop = data.recommendations[0];

  return (
    <div style={{ padding: '20px 16px' }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--blue-main)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 16,
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        ← {t.back}
      </button>

      {/* District info card */}
      <div className="card" style={{ background: 'var(--water-gradient)', color: 'white', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>📍 {district}</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
          <span className={`badge ${statusClass}`}>
            {t.groundwaterStatus}: {statusText}
          </span>
        </div>
        <p style={{ fontSize: 13, marginTop: 10, opacity: 0.9 }}>
          💧 {t.depthMetres}: {data.currentDepth}m
        </p>
      </div>

      {/* Water savings summary */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #e6f5ed 0%, #e3f2fd 100%)',
        border: '2px solid var(--green-main)',
        textAlign: 'center',
        marginBottom: 20,
        padding: '20px 16px'
      }}>
        <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 6 }}>
          💡 {t.recommended}
        </p>
        <h2 style={{ fontSize: 20, color: 'var(--green-dark)', marginBottom: 8 }}>
          🌱 {topCrop.crop}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-dark)', lineHeight: 1.5 }}>
          {t.waterSave || 'Save'} <span style={{ fontWeight: 700, color: 'var(--blue-dark)', fontSize: 22 }}>{waterSaved}%</span> {t.waterSaveEnd || 'groundwater'} 
          {' '}{t.whileEarning || 'while earning'}{' '}
          <span style={{ fontWeight: 700, color: 'var(--green-dark)', fontSize: 22 }}>₹{topCrop.expectedProfit.toLocaleString()}</span>/{t.perAcre || 'acre'}
        </p>
      </div>

      {/* Crop comparison */}
      <h3 className="section-title">{t.cropComparison}</h3>
      {data.recommendations.map((crop, i) => (
        <CropCard
          key={i}
          crop={crop}
          t={t}
          isRecommended={i === 0}
        />
      ))}

      {/* Water table projection graph */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="section-title">{t.waterTableProjection}</h3>
        <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 16 }}>
          ⚠️ {t.depthMetres} — ↑ = {t.notRecommended}
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: '#7a7a8a' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#7a7a8a' }}
              reversed={true}
              domain={['dataMin - 2', 'dataMax + 2']}
              label={{
                value: t.depthMetres,
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 11, fill: '#7a7a8a' }
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                fontSize: 13
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="current"
              name={t.currentCrop}
              stroke="#d32f2f"
              strokeWidth={3}
              dot={{ r: 4, fill: '#d32f2f' }}
            />
            <Line
              type="monotone"
              dataKey="recommended"
              name={t.recommendedCrop}
              stroke="#22905a"
              strokeWidth={3}
              dot={{ r: 4, fill: '#22905a' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default Recommendation;