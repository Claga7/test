
import FintechChart from "@/components/FintechChart";
import WorldMap from "@/components/FintechChart/components/WorldMap";
import { useMapData } from "@/components/FintechChart/hooks/useMapData";
import { useState } from "react";
import { FintechStartup } from "@/types/fintech";
import { defaultStartups } from "@/components/FintechChart/data/defaultStartups";

const Index = () => {
  const [startups] = useState<FintechStartup[]>(defaultStartups);
  const { countryData } = useMapData(startups);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Startup Fintech Globali
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto mb-6">
            Due visualizzazioni complementari dei dati fintech globali: grafico radiale e mappa mondiale interattiva.
          </p>
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-700 mb-4 text-center">
              Visualizzazione Radiale
            </h2>
            <p className="text-sm text-slate-600 text-center mb-4">
              La distanza dal centro rappresenta l'anno di fondazione (2025 al centro), mentre la dimensione delle bolle rappresenta il funding totale.
            </p>
            <FintechChart />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-700 mb-4 text-center">
              Mappa Mondiale
            </h2>
            <p className="text-sm text-slate-600 text-center mb-4">
              Le dimensioni dei paesi sono proporzionali al funding totale, l'intensità del colore rappresenta il numero di startup.
            </p>
            <div className="flex justify-center">
              <WorldMap countryData={countryData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
