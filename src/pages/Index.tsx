
import RadialChart from "@/components/RadialChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            The Nobel Prize in Physics 2021
          </h1>
          <h2 className="text-2xl text-slate-600 mb-4">
            Statistics of Nobel Prizes in Physics 1901-2021
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Half of this year's Nobel Prize in Physics was awarded to Syukuro Manabe and 
            Klaus Hasselmann for their physical modelling of Earth's climate, quantifying 
            variability and reliably predicting global warming.
          </p>
        </div>
        <RadialChart />
      </div>
    </div>
  );
};

export default Index;
