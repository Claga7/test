
import React from 'react';

const Legend = () => {
  return (
    <div className="mt-8 flex justify-center space-x-12 text-sm text-slate-600">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
        <span>High Impact (80-100)</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
        <span>Medium Impact (60-79)</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-yellow-500"></div>
        <span>Standard Impact (40-59)</span>
      </div>
    </div>
  );
};

export default Legend;
