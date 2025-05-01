
import React, { useState } from 'react';
import { 
  FireInputs, 
  FireResult, 
  calculateFireResult, 
  formatCurrency, 
  getDefaultInputs 
} from '@/utils/fireCalculations';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ProgressChart from './ProgressChart';

interface FireCalculatorProps {
  onResultsCalculated?: (result: FireResult) => void;
}

const FireCalculator: React.FC<FireCalculatorProps> = ({ onResultsCalculated }) => {
  const [inputs, setInputs] = useState<FireInputs>(getDefaultInputs());
  const [result, setResult] = useState<FireResult | null>(null);
  
  const handleInputChange = (field: keyof FireInputs, value: number) => {
    setInputs({
      ...inputs,
      [field]: value,
    });
  };
  
  const calculateResults = () => {
    const calculatedResult = calculateFireResult(inputs);
    setResult(calculatedResult);
    
    if (onResultsCalculated) {
      onResultsCalculated(calculatedResult);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Situation</CardTitle>
            <CardDescription>Tell us about your current financial situation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="currentAge">Current Age</Label>
                <span className="text-sm text-gray-500">{inputs.currentAge} years</span>
              </div>
              <Slider
                id="currentAge"
                min={18}
                max={70}
                step={1}
                value={[inputs.currentAge]}
                onValueChange={(value) => handleInputChange('currentAge', value[0])}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentSavings">Current Savings</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="currentSavings"
                  type="number"
                  value={inputs.currentSavings}
                  onChange={(e) => handleInputChange('currentSavings', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={inputs.monthlyContribution}
                  onChange={(e) => handleInputChange('monthlyContribution', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Retirement Goals</CardTitle>
            <CardDescription>Define your FIRE goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="retirementAge">Target Retirement Age</Label>
                <span className="text-sm text-gray-500">{inputs.retirementAge} years</span>
              </div>
              <Slider
                id="retirementAge"
                min={inputs.currentAge + 1}
                max={80}
                step={1}
                value={[inputs.retirementAge]}
                onValueChange={(value) => handleInputChange('retirementAge', value[0])}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annualExpenses">Annual Expenses in Retirement</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="annualExpenses"
                  type="number"
                  value={inputs.annualExpenses}
                  onChange={(e) => handleInputChange('annualExpenses', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="expectedReturn">Expected Annual Return</Label>
                <span className="text-sm text-gray-500">{inputs.expectedAnnualReturn}%</span>
              </div>
              <Slider
                id="expectedReturn"
                min={1}
                max={12}
                step={0.5}
                value={[inputs.expectedAnnualReturn]}
                onValueChange={(value) => handleInputChange('expectedAnnualReturn', value[0])}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="withdrawalRate">Safe Withdrawal Rate</Label>
                <span className="text-sm text-gray-500">{inputs.withdrawalRate}%</span>
              </div>
              <Slider
                id="withdrawalRate"
                min={2}
                max={6}
                step={0.1}
                value={[inputs.withdrawalRate]}
                onValueChange={(value) => handleInputChange('withdrawalRate', value[0])}
                className="py-4"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={calculateResults} 
          className="bg-fire-orange hover:bg-fire-orange/90 text-white px-8 py-2"
          size="lg"
        >
          Calculate My FIRE Journey
        </Button>
      </div>
      
      {result && (
        <Card className="mt-8 animate-fade-in">
          <CardHeader>
            <CardTitle>Your FIRE Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-fire-blue/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">FIRE Number</p>
                <p className="text-2xl font-bold text-fire-blue">
                  {formatCurrency(result.fireNumber)}
                </p>
                <p className="text-xs text-gray-500">Target Net Worth</p>
              </div>
              
              <div className={`p-4 rounded-lg text-center ${result.isOnTrack ? 'bg-fire-green/10' : 'bg-fire-orange/10'}`}>
                <p className="text-sm text-gray-600">Years to FIRE</p>
                <p className="text-2xl font-bold">
                  {result.yearsToFire.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">You'll be {Math.round(result.retirementAge)} years old</p>
              </div>
              
              <div className="bg-fire-purple/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Monthly Passive Income</p>
                <p className="text-2xl font-bold text-fire-purple">
                  {formatCurrency(result.monthlyPassiveIncome)}
                </p>
                <p className="text-xs text-gray-500">In Retirement</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Projected Savings Growth</h3>
              <ProgressChart inputs={inputs} result={result} />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500 italic">
              These projections are based on consistent returns and contributions. Actual results may vary.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FireCalculator;
