
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { FireInputs, FireResult, generateTips } from '@/utils/fireCalculations';

interface AiTipsProps {
  inputs?: FireInputs;
  result?: FireResult;
}

const AiTips: React.FC<AiTipsProps> = ({ inputs, result }) => {
  // Default tips when no calculation has been performed
  const defaultTips = [
    "Increase your savings rate to accelerate your path to FIRE.",
    "Consider low-cost index funds for long-term wealth building.",
    "Track your spending to identify areas where you can cut expenses.",
    "Reassess your FIRE plan annually to stay on track.",
    "Remember that the 4% withdrawal rule is a guideline, not a guarantee.",
  ];

  const tips = inputs && result ? generateTips(inputs, result) : defaultTips;
  
  return (
    <Card>
      <CardHeader className="bg-fire-light-purple/30">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-fire-purple h-5 w-5" />
          <span>AI FIRE Tips</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-fire-purple text-xs font-medium text-fire-purple">
                {index + 1}
              </span>
              <p className="text-gray-700">{tip}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AiTips;
