
import { useMemo } from 'react';
import { FintechStartup } from '@/types/fintech';
import { processChartData } from '../utils/chartUtils';

export const useChartData = (startups: FintechStartup[]) => {
  const processedData = useMemo(() => processChartData(startups), [startups]);
  
  const countries = useMemo(() => 
    Array.from(new Set(startups.map(d => d.country))), 
    [startups]
  );

  return { processedData, countries };
};
