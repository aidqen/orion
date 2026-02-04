// weatherService.js

export async function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        }),
        (error) => reject(error)
      );
    });
  }
  
  export async function getCityName(lat: number, lon: number) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    return data.address?.city || data.address?.town || data.address?.village || 'Unknown';
  }
  
  export async function getWeather(lat: number, lon: number) {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    return res.json();
  }
  
  export async function fetchUserWeather() {
    const { lat, lon } = await getUserLocation() as { lat: number, lon: number };
    
    const [weather, city] = await Promise.all([
      getWeather(lat, lon),
      getCityName(lat, lon)
    ]);
  
    return {
      city,
      temperature: Math.round(weather.current.temperature_2m),
      conditionCode: weather.current.weather_code,
      high: Math.round(weather.daily.temperature_2m_max[0]),
      low: Math.round(weather.daily.temperature_2m_min[0])
    };
  }

  export function getConditionText(code: number): string {
    if (code === 0) return "Sunny";
    if (code <= 3) return "Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 57) return "Drizzle";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Showers";
    if (code <= 99) return "Stormy";
    return "Unknown";
  }