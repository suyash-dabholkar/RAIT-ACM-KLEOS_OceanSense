import { useState } from 'react';
import LocationPicker from './components/LocationPicker';
import SoilUpload from './components/SoilUpload';
import Recommendation from './components/Recommendation';
import translations from './data/translations.json';
import './App.css';

function App() {
  const [lang, setLang] = useState('en');
  const [screen, setScreen] = useState('home');
  const [result, setResult] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [soilData, setSoilData] = useState(null);

  const t = translations[lang];

  const toggleLang = () => setLang(lang === 'en' ? 'hi' : 'en');

  // Step 1: Location selected → go to soil upload
  const handleLocationSelected = (district) => {
    setSelectedDistrict(district);
    setScreen('soil-upload');
  };

  // Step 2a: Soil report parsed → fetch recommendations with soil data
  const handleSoilResult = async (parsedSoil) => {
    setSoilData(parsedSoil);
    await fetchRecommendations(selectedDistrict, parsedSoil);
  };

  // Step 2b: Skipped soil upload → fetch generic recommendations
  const handleSkipSoil = async () => {
    setSoilData(null);
    await fetchRecommendations(selectedDistrict, null);
  };

  // Fetch recommendations from your Spring Boot backend
  const fetchRecommendations = async (district, soil) => {
    const cropDetails = {
      'Soybean': { inputCost: 12000, mandiPrice: 4200, waterReq: '450mm', scheme: 'PM-KISAN' },
      'Tur (Pigeon Pea)': { inputCost: 10000, mandiPrice: 6800, waterReq: '350mm', scheme: null },
      'Bajra (Pearl Millet)': { inputCost: 8500, mandiPrice: 2100, waterReq: '200mm', scheme: 'Millet Mission' },
      'Chickpea (Chana)': { inputCost: 11000, mandiPrice: 5200, waterReq: '300mm', scheme: 'PM-KISAN' },
      'Groundnut': { inputCost: 14000, mandiPrice: 5500, waterReq: '400mm', scheme: null },
      'Jowar (Sorghum)': { inputCost: 9000, mandiPrice: 2800, waterReq: '350mm', scheme: 'Millet Mission' },
      'Sunflower': { inputCost: 13000, mandiPrice: 5000, waterReq: '400mm', scheme: null },
      'Cotton': { inputCost: 18000, mandiPrice: 6200, waterReq: '800mm', scheme: null },
      'Wheat': { inputCost: 15000, mandiPrice: 2200, waterReq: '500mm', scheme: null },
      'Paddy (Rice)': { inputCost: 16000, mandiPrice: 1900, waterReq: '1200mm', scheme: null },
    };

    // If we have soil data, build result directly from soil parser
    if (soil && soil.recommendations) {
      setResult({
        groundwaterLevel: 'Semi-Critical',
        currentDepth: 14.5,
        recommendations: soil.top_3.map((crop) => {
          const details = cropDetails[crop.crop] || { inputCost: 10000, mandiPrice: 3000, waterReq: '400mm', scheme: null };
          const waterScore = crop.water_need === 'Very Low' ? 95 : crop.water_need === 'Low' ? 80 : crop.water_need === 'Medium' ? 45 : 20;
          const profitScore = Math.min(crop.score, 85);
          return {
            crop: crop.crop,
            profitScore: profitScore,
            waterScore: waterScore,
            inputCost: details.inputCost,
            mandiPrice: details.mandiPrice,
            expectedProfit: details.mandiPrice * 8 - details.inputCost,
            waterRequirement: details.waterReq,
            scheme: details.scheme,
          };
        }),
        projection: {
          years: [2024, 2025, 2026, 2027, 2028],
          currentCrop: [14.5, 16.2, 18.0, 20.1, 22.5],
          recommended: [14.5, 14.8, 15.0, 15.1, 15.2],
        },
        soilData: soil.soil_parameters,
        farmerInfo: soil.farmer_info,
        personalized: true,
      });
      setScreen('result');
      return;
    }

    // No soil data (skipped) — try Spring Boot backend
    try {
      let url = `http://localhost:8080/api/recommend?district=${encodeURIComponent(district)}`;
      const res = await fetch(url);
      const data = await res.json();
      setResult(data);
      setScreen('result');
    } catch (err) {
      console.error('Backend also unavailable:', err);
    }
  };

  // Old showResult for backward compatibility (if LocationPicker still calls it)
  const showResult = (district, data) => {
    setSelectedDistrict(district);
    setResult(data);
    setScreen('result');
  };

  const goBack = () => {
    setScreen('home');
    setResult(null);
    setSoilData(null);
  };

  const goBackToSoil = () => {
    setScreen('soil-upload');
    setResult(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t.appName}</h1>
        <button className="lang-btn" onClick={toggleLang}>{t.language}</button>
      </header>

      {screen === 'home' && (
        <LocationPicker t={t} onResult={showResult} onDistrictSelected={handleLocationSelected} />
      )}

      {screen === 'soil-upload' && (
        <SoilUpload
          t={t}
          district={selectedDistrict}
          onResult={handleSoilResult}
          onSkip={handleSkipSoil}
        />
      )}

      {screen === 'result' && result && (
        <Recommendation t={t} data={result} district={selectedDistrict} onBack={goBack} />
      )}
    </div>
  );
}

export default App;
