
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
        
        if (file.name.endsWith('.json')) {
          data = JSON.parse(text);
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          data = lines.slice(1).filter(line => line.trim()).map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const obj: any = { id: index + 1 };
            headers.forEach((header, i) => {
              if (header.toLowerCase().includes('funding') || header.toLowerCase().includes('year')) {
                obj[header] = parseInt(values[i]) || 0;
              } else {
                obj[header] = values[i] || '';
              }
            });
            return obj;
          });
        } else {
          throw new Error('Formato file non supportato');
        }

        const mappedData: FintechStartup[] = data.map((item, index) => ({
          id: item.id || index + 1,
          name: item.name || item.Name || item.Company || `Startup ${index + 1}`,
          country: item['HQ Country/Territory/Region'] || item.country || item.Country || 'Unknown',
          foundingYear: parseInt(item['Year Founded']) || item.foundingYear || item.year || 2020,
          funding: parseFloat(item['Total Raised']?.replace(/[$,]/g, '')) || item.funding || 100
        }));

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
