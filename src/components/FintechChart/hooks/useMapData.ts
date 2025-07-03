import { useMemo } from 'react';
import { FintechStartup } from '@/types/fintech';
import { processMapData } from '../utils/mapUtils';

export const useMapData = (startups: FintechStartup[]) => {
  const countryData = useMemo(() => processMapData(startups), [startups]);

  return { countryData };
};