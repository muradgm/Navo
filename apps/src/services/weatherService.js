const WEATHER_CODE_LABELS = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Cloudy',
  45: 'Fog',
  48: 'Fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm'
};

export function weatherCodeLabel(code) {
  return WEATHER_CODE_LABELS[code] ?? 'Weather';
}

export function weatherMood(maxTemp, precipitation) {
  if (Number(precipitation) >= 2) return 'rainy';
  if (Number(maxTemp) >= 28) return 'hot';
  if (Number(maxTemp) <= 7) return 'cold';
  return 'normal';
}

export async function fetchOpenMeteoForecast({ latitude, longitude, timezone = 'auto', signal } = {}) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Missing valid weather coordinates');
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone,
    forecast_days: '16'
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { signal });
  if (!response.ok) throw new Error('Weather request failed');

  const data = await response.json();
  const daily = data.daily ?? {};
  const times = daily.time ?? [];

  return times.map((date, index) => ({
    date,
    code: daily.weather_code?.[index],
    label: weatherCodeLabel(daily.weather_code?.[index]),
    max: Math.round(daily.temperature_2m_max?.[index]),
    min: Math.round(daily.temperature_2m_min?.[index]),
    precipitation: Number(daily.precipitation_sum?.[index] || 0),
    mood: weatherMood(daily.temperature_2m_max?.[index], daily.precipitation_sum?.[index])
  }));
}
