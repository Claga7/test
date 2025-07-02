
import RadialChart from "@/components/RadialChart";
import FintechChart from "@/components/FintechChart";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeChart, setActiveChart] = useState<'nobel' | 'fintech'>('fintech');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Visualizzazioni Radiali
          </h1>
          <h2 className="text-2xl text-slate-600 mb-4">
            {activeChart === 'nobel' ? 'Nobel Prize in Physics 1901-2021' : 'Startup Fintech Globali'}
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto mb-6">
            {activeChart === 'nobel' 
              ? 'Half of this year\'s Nobel Prize in Physics was awarded to Syukuro Manabe and Klaus Hasselmann for their physical modelling of Earth\'s climate, quantifying variability and reliably predicting global warming.'
              : 'Visualizzazione radiale delle startup fintech per paese. La distanza dal centro rappresenta l\'anno di fondazione (2025 al centro), mentre la dimensione delle bolle può rappresentare il numero di startup o il funding totale.'
            }
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => setActiveChart('fintech')}
              variant={activeChart === 'fintech' ? 'default' : 'outline'}
            >
              Fintech Startup
            </Button>
            <Button 
              onClick={() => setActiveChart('nobel')}
              variant={activeChart === 'nobel' ? 'default' : 'outline'}
            >
              Nobel Physics
            </Button>
          </div>
        </div>
        
        {activeChart === 'nobel' ? <RadialChart /> : <FintechChart />}
      </div>
    </div>
  );
};

export default Index;
