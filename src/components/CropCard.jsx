function CropCard({ crop, t, isRecommended }) {
    const waterColor = crop.waterScore > 70 ? 'water' : crop.waterScore > 40 ? 'profit' : 'danger';
    const jalScore = Math.round(crop.profitScore * 0.5 + crop.waterScore * 0.5);
    const isWarning = crop.waterScore < 30;
  
    return (
      <div className="card" style={{
        border: isRecommended ? '2px solid var(--green-main)' : isWarning ? '2px solid var(--red)' : '1px solid #e0e0e0',
        background: isWarning ? '#fff5f5' : 'var(--card-bg)',
        position: 'relative'
      }}>
        {/* Badge */}
        {isRecommended && (
          <span className="badge badge-recommended" style={{ marginBottom: 10 }}>
            ✅ {t.recommended}
          </span>
        )}
        {isWarning && (
          <span className="badge badge-critical" style={{ marginBottom: 10 }}>
            ⚠️ {t.notRecommended}
          </span>
        )}
  
        {/* Crop name + JalFasal Score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, color: 'var(--text-dark)' }}>
            🌱 {crop.crop}
          </h3>
          <div style={{
            background: jalScore > 70 ? 'var(--green-light)' : jalScore > 50 ? '#fff9c4' : '#fdecea',
            color: jalScore > 70 ? 'var(--green-dark)' : jalScore > 50 ? '#f9a825' : 'var(--red)',
            padding: '6px 12px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 700
          }}>
            {jalScore}/100
          </div>
        </div>
  
        {/* Profit score */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-mid)' }}>
            <span>{t.profit}</span>
            <span style={{ fontWeight: 600 }}>{crop.profitScore}/100</span>
          </div>
          <div className="score-bar-container">
            <div className="score-bar profit" style={{ width: `${crop.profitScore}%` }}></div>
          </div>
        </div>
  
        {/* Water score */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-mid)' }}>
            <span>{t.waterUse}</span>
            <span style={{ fontWeight: 600 }}>{crop.waterScore}/100</span>
          </div>
          <div className="score-bar-container">
            <div className={`score-bar ${waterColor}`} style={{ width: `${crop.waterScore}%` }}></div>
          </div>
        </div>
  
        {/* Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div style={{ background: isWarning ? '#fff0f0' : 'var(--bg)', padding: '8px 10px', borderRadius: 8 }}>
            <span style={{ color: 'var(--text-light)' }}>{t.inputCost}</span>
            <p style={{ fontWeight: 600, marginTop: 2 }}>₹{(crop.inputCost || 0).toLocaleString()}</p>
          </div>
          <div style={{ background: isWarning ? '#fff0f0' : 'var(--bg)', padding: '8px 10px', borderRadius: 8 }}>
            <span style={{ color: 'var(--text-light)' }}>{t.mandiPrice}</span>
            <p style={{ fontWeight: 600, marginTop: 2 }}>₹{(crop.mandiPrice || 0).toLocaleString()}/q</p>
          </div>
          <div style={{ background: isWarning ? '#fff0f0' : 'var(--bg)', padding: '8px 10px', borderRadius: 8 }}>
            <span style={{ color: 'var(--text-light)' }}>{t.expectedProfit}</span>
            <p style={{ fontWeight: 600, color: 'var(--green-dark)', marginTop: 2 }}>₹{(crop.expectedProfit || 0).toLocaleString()}</p>
          </div>
          <div style={{ background: isWarning ? '#fff0f0' : 'var(--bg)', padding: '8px 10px', borderRadius: 8 }}>
            <span style={{ color: 'var(--text-light)' }}>{t.waterRequirement}</span>
            <p style={{ fontWeight: 600, marginTop: 2 }}>{crop.waterRequirement}</p>
          </div>
        </div>
  
        {/* Scheme badge */}
        {crop.scheme && (
          <div style={{ marginTop: 12 }}>
            <span className="badge badge-scheme">🏛️ {t.govScheme}: {crop.scheme}</span>
          </div>
        )}
      </div>
    );
  }
  
  export default CropCard;