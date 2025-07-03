import { FintechStartup } from '@/types/fintech';

export interface CountryData {
  country: string;
  startupCount: number;
  totalFunding: number;
  averageFunding: number;
}

export const processMapData = (startups: FintechStartup[]): CountryData[] => {
  const countryGroups = new Map<string, FintechStartup[]>();
  
  // Group startups by country
  startups.forEach(startup => {
    const country = startup.country;
    if (!countryGroups.has(country)) {
      countryGroups.set(country, []);
    }
    countryGroups.get(country)!.push(startup);
  });

  // Process each country group
  const countryData: CountryData[] = [];
  countryGroups.forEach((startupGroup, country) => {
    const totalFunding = startupGroup.reduce((sum, startup) => sum + startup.funding, 0);
    const startupCount = startupGroup.length;
    const averageFunding = totalFunding / startupCount;

    countryData.push({
      country,
      startupCount,
      totalFunding,
      averageFunding
    });
  });

  return countryData.sort((a, b) => b.totalFunding - a.totalFunding);
};

// Country name mapping for consistent geography data
export const getCountryCode = (countryName: string): string => {
  const countryMapping: Record<string, string> = {
    'Stati Uniti': 'United States of America',
    'Regno Unito': 'United Kingdom',
    'Paesi Bassi': 'Netherlands',
    'Cina': 'China',
    'Brasile': 'Brazil',
    'Svezia': 'Sweden',
    'Germania': 'Germany',
    'Francia': 'France',
    'Italia': 'Italy',
    'Spagna': 'Spain',
    'Canada': 'Canada',
    'Australia': 'Australia',
    'Giappone': 'Japan',
    'Corea del Sud': 'South Korea',
    'India': 'India',
    'Singapore': 'Singapore',
    'Svizzera': 'Switzerland',
    'Norvegia': 'Norway',
    'Danimarca': 'Denmark',
    'Finlandia': 'Finland'
  };

  return countryMapping[countryName] || countryName;
};