import { useEffect, useState } from 'react';
import { fetchOpenMeteoForecast } from '../services/weatherService.js';

export function useTripWeather(location, timezone = 'Europe/Zurich') {
  const [state, setState] = useState({ status: 'idle', days: [], updated: null, error: null });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setState(current => ({ ...current, status: 'loading' }));
      try {
        const days = await fetchOpenMeteoForecast({
          latitude: location.latitude,
          longitude: location.longitude,
          timezone,
          signal: controller.signal
        });
        setState({ status: 'ready', days, updated: new Date().toISOString(), error: null });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setState({ status: 'error', days: [], updated: null, error: err.message });
        }
      }
    }

    load();
    return () => controller.abort();
  }, [location.latitude, location.longitude, timezone]);

  return state;
}
