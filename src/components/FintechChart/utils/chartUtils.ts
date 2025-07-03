
import * as d3 from 'd3';
import { FintechStartup, ProcessedStartup } from '@/types/fintech';

export const processChartData = (startups: FintechStartup[]): ProcessedStartup[] => {
  const width = 900;
  const height = 900;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 350;

  const countries = Array.from(new Set(startups.map(d => d.country)));
  const angleStep = (2 * Math.PI) / countries.length;

  const countryAngles = new Map();
  countries.forEach((country, i) => {
    countryAngles.set(country, i * angleStep);
  });

  // Raggruppa per anno e paese, aggregando funding e contando le startup
  const yearCountryGroups = d3.group(startups, d => `${d.country}-${d.foundingYear}`);
  const processedData: ProcessedStartup[] = [];

  let groupId = 1;
  yearCountryGroups.forEach((startupGroup, key) => {
    const [country, year] = key.split('-');
    const yearNum = parseInt(year);
    const angle = countryAngles.get(country);
    
    // Calcola funding totale aggregato per il gruppo
    const totalFunding = d3.sum(startupGroup, d => d.funding);
    const startupCount = startupGroup.length;
    
    // Calcola la distanza dal centro basata sull'anno (2025 centro, 2021 bordi)
    const yearDistance = ((2025 - yearNum) / 4) * radius;
    const distance = Math.max(60, Math.min(radius * 0.9, yearDistance));
    
    // Crea un unico punto per il gruppo aggregato
    const groupName = `${country} ${yearNum} (${startupCount} startup)`;
    
    processedData.push({
      id: groupId++,
      name: groupName,
      country: country,
      foundingYear: yearNum,
      funding: totalFunding,
      x: centerX + Math.cos(angle - Math.PI/2) * distance,
      y: centerY + Math.sin(angle - Math.PI/2) * distance,
      groupSize: startupCount
    });
  });

  console.log('Processed aggregated data:', processedData.slice(0, 10));
  return processedData;
};

export const getChartDimensions = () => ({
  width: 900,
  height: 900,
  centerX: 450,
  centerY: 450,
  radius: 350
});

export const getCountryAngles = (countries: string[]) => {
  const angleStep = (2 * Math.PI) / countries.length;
  const countryAngles = new Map();
  countries.forEach((country, i) => {
    countryAngles.set(country, i * angleStep);
  });
  return countryAngles;
};
