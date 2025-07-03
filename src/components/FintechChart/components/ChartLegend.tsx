
import React from 'react';

interface ChartLegendProps {
  startupCount: number;
}

const ChartLegend: React.FC<ChartLegendProps> = ({ startupCount }) => {
  return (
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">
        Startup Fintech Globali - Dati Aggregati per Anno e Paese
      </h3>
      <div className="flex justify-center space-x-8 text-sm text-slate-600 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Centro = 2025</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Esterno = 2000</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-800"></div>
          <span>Colore = N° Startup nel Gruppo</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          </div>
          <span>Dimensione = Funding Aggregato</span>
        </div>
      </div>
      <div className="text-sm text-slate-600">
        <p>Ogni pallino rappresenta un gruppo di startup dello stesso paese e anno di fondazione</p>
        <p className="text-xs text-gray-500 mt-1">
          Startup totali caricate: {startupCount} | Carica un file JSON o CSV con campi: name, country, foundingYear, funding
        </p>
      </div>
    </div>
  );
};

export default ChartLegend;
