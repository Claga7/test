
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

  const yearCountryGroups = d3.group(startups, d => `${d.country}-${d.foundingYear}`);
  const processedData: ProcessedStartup[] = [];

  yearCountryGroups.forEach((startupGroup, key) => {
    const [country, year] = key.split('-');
    const yearNum = parseInt(year);
    const angle = countryAngles.get(country);
    
    const yearDistance = ((2025 - yearNum) / 30) * radius;
    const distance = Math.max(60, Math.min(radius * 0.9, yearDistance));
    
    startupGroup.forEach((startup, index) => {
      const offsetAngle = angle + (index - (startupGroup.length - 1) / 2) * 0.05;
      const offsetDistance = distance + (index - (startupGroup.length - 1) / 2) * 15;
      
      processedData.push({
        ...startup,
        x: centerX + Math.cos(offsetAngle - Math.PI/2) * offsetDistance,
        y: centerY + Math.sin(offsetAngle - Math.PI/2) * offsetDistance,
        groupSize: startupGroup.length
      });
    });
  });

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
