
import { useCallback } from 'react';
import { FintechStartup } from '@/types/fintech';

export const useFileUpload = (onDataLoaded: (data: FintechStartup[]) => void) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        let data: any[];
        
        console.log('File loaded, parsing...', file.name);
        
        if (file.name.endsWith('.json')) {
          data = JSON.parse(text);
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split('\n');
          const headers = lines[0].split(';').map(h => h.trim().replace(/"/g, ''));
          console.log('CSV Headers:', headers);
          
          data = lines.slice(1).filter(line => line.trim()).map((line, index) => {
            const values = line.split(';').map(v => v.trim().replace(/"/g, ''));
            const obj: any = { id: index + 1 };
            headers.forEach((header, i) => {
              obj[header] = values[i] || '';
            });
            return obj;
          });
          console.log('Parsed CSV data sample:', data.slice(0, 3));
        } else {
          throw new Error('Formato file non supportato');
        }

        const mappedData: FintechStartup[] = data.map((item, index) => {
          const fundingString = item['Total Raised'] || '';
          let funding = 0;
          
          // Parse funding amount from various formats
          if (typeof fundingString === 'string') {
            const cleanFunding = fundingString.replace(/[$,\s]/g, '').replace(/[MmKk]/g, '');
            funding = parseFloat(cleanFunding) || 0;
            
            // Handle M (millions) and K (thousands) suffixes
            if (fundingString.toLowerCase().includes('m')) {
              funding = funding; // Already in millions
            } else if (fundingString.toLowerCase().includes('k')) {
              funding = funding / 1000; // Convert to millions
            } else if (funding > 1000000) {
              funding = funding / 1000000; // Convert large numbers to millions
            }
          }
          
          const result = {
            id: item.id || index + 1,
            name: item.name || item.Name || item.Company || item['Company Name'] || `Startup ${index + 1}`,
            country: item['HQ Country/Territory/Region'] || item.country || item.Country || 'Unknown',
            foundingYear: parseInt(item['Year Founded']) || parseInt(item.foundingYear) || parseInt(item.year) || 2020,
            funding: funding
          };
          
          console.log('Mapped startup:', result);
          return result;
        });

        console.log('Final mapped data:', mappedData.slice(0, 5));
        onDataLoaded(mappedData);
      } catch (error) {
        console.error('Errore nel caricamento del file:', error);
        alert('Errore nel caricamento del file. Assicurati che sia un JSON o CSV valido.');
      }
    };
    reader.readAsText(file);
  }, [onDataLoaded]);

  return { handleFileUpload };
};
