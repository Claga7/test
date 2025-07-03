
import FintechChart from "@/components/FintechChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Startup Fintech Globali
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto mb-6">
            Visualizzazione radiale delle startup fintech per paese. La distanza dal centro rappresenta l'anno di fondazione (2025 al centro), mentre la dimensione delle bolle rappresenta il funding totale.
          </p>
        </div>
        
        <FintechChart />
      </div>
    </div>
  );
};

export default Index;
