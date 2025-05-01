
import React from 'react';
import FireCalculator from '@/components/FireCalculator';
import { FireResult } from '@/utils/fireCalculations';
import { useToast } from '@/hooks/use-toast';

const Calculator = () => {
  const { toast } = useToast();
  
  const handleResultsCalculated = (result: FireResult) => {
    toast({
      title: "FIRE Calculator Results",
      description: `Based on your inputs, you'll reach financial independence in ${result.yearsToFire.toFixed(1)} years at age ${Math.round(result.retirementAge)}.`,
      duration: 5000,
    });
  };
  
  return (
    <div className="container max-w-6xl mx-auto p-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">FIRE Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Estimate your Financial Independence and Retire Early timeline based on your current savings,
          investment strategy, and retirement goals.
        </p>
      </div>
      
      <FireCalculator onResultsCalculated={handleResultsCalculated} />
      
      <div className="mt-12 bg-gray-50 rounded-lg p-6 text-sm text-gray-600">
        <h3 className="font-semibold text-gray-900 mb-2">About the FIRE Calculator</h3>
        <p className="mb-4">
          This calculator uses the principles of the FIRE (Financial Independence, Retire Early) movement to estimate how long it will take you to reach financial independence. It assumes:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Consistent monthly contributions throughout your accumulation phase</li>
          <li>A stable annual return on investments over time (though actual market returns will vary)</li>
          <li>The "4% rule" (or your selected Safe Withdrawal Rate) for sustainable retirement income</li>
          <li>Inflation-adjusted spending (your specified Annual Expenses are in today's dollars)</li>
        </ul>
        <p className="mt-4 italic">
          Remember that this is a projection based on the information you provide. Actual results will vary based on market performance, life changes, and other factors.
        </p>
      </div>
    </div>
  );
};

export default Calculator;
