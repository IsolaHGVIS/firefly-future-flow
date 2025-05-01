
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FireInputs, FireResult, formatCurrency } from '@/utils/fireCalculations';

interface ProgressChartProps {
  inputs: FireInputs;
  result: FireResult;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ inputs, result }) => {
  const { currentAge, currentSavings, monthlyContribution, expectedAnnualReturn } = inputs;
  const { yearsToFire, fireNumber } = result;
  
  // Generate projection data
  const generateProjectionData = () => {
    const data = [];
    let savings = currentSavings;
    const monthlyReturn = expectedAnnualReturn / 100 / 12;
    
    for (let year = 0; year <= Math.ceil(yearsToFire); year++) {
      const age = currentAge + year;
      const firePercentage = (savings / fireNumber) * 100;
      
      data.push({
        age,
        savings: Math.round(savings),
        firePercentage: Math.min(100, firePercentage)
      });
      
      // Compound for 12 months
      for (let month = 0; month < 12; month++) {
        savings = savings * (1 + monthlyReturn) + monthlyContribution;
      }
    }
    
    return data;
  };
  
  const data = generateProjectionData();
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
          <p className="font-semibold">Age: {label}</p>
          <p className="text-fire-blue">
            Savings: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-fire-purple">
            FIRE Progress: {Math.round(payload[1].value)}%
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-72 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="age" 
            label={{ value: 'Age', position: 'insideBottomRight', offset: 0 }} 
          />
          <YAxis 
            yAxisId="left"
            label={{ value: 'Savings', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `${formatCurrency(value)}`}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={[0, 100]}
            label={{ value: 'FIRE %', angle: 90, position: 'insideRight' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="savings"
            name="Savings"
            stroke="#0EA5E9"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="firePercentage"
            name="FIRE Progress"
            stroke="#7E69AB"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
