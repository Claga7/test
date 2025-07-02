
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FintechStartup } from '@/types/fintech';
import { useFileUpload } from './hooks/useFileUpload';
import { useChartData } from './hooks/useChartData';
import ChartSVG from './components/ChartSVG';
import ChartLegend from './components/ChartLegend';
import { defaultStartups } from './data/defaultStartups';

const FintechChart = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [startups, setStartups] = useState<FintechStartup[]>(defaultStartups);
  
  const { handleFileUpload } = useFileUpload(setStartups);
  const { processedData, countries } = useChartData(startups);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 flex gap-4 items-center">
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
        >
          Carica Dati
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv"
          onChange={handleFileUpload}
          className="hidden"
        />
        <span className="text-sm text-gray-600">
          Startup caricate: {startups.length}
        </span>
      </div>
      
      <div className="bg-white rounded-lg shadow-xl p-8">
        <ChartSVG processedData={processedData} countries={countries} />
        <ChartLegend startupCount={startups.length} />
      </div>
    </div>
  );
};

export default FintechChart;
