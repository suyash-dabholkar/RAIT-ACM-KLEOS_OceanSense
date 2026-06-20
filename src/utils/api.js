import mockCrops from '../data/mockCrops.json';

// For now this returns mock data
// Later replace with real API call to Member 1's backend
export function getRecommendation(districtName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCrops[districtName] || null);
    }, 800); // fake loading delay so UI feels real
  });
}

// Uncomment this when Member 1's backend is ready:
// export async function getRecommendation(districtName) {
//   const res = await fetch(`http://localhost:8080/api/recommend?district=${districtName}`);
//   return res.json();
// }