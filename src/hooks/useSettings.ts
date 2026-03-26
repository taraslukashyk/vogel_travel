import { useState, useEffect } from 'react';
import { getSettings } from '../lib/queries/settings';
import type { SiteSettings } from '../lib/queries/settings';


export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error in useSettings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return { settings, loading };
}
