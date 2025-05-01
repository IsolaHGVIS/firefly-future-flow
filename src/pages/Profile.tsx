
import React, { useState } from 'react';
import MonthlyTracker from '@/components/MonthlyTracker';
import AiTips from '@/components/AiTips';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FireResult, formatCurrency } from '@/utils/fireCalculations';

// Sample data for demonstration
const sampleFireResult: FireResult = {
  fireNumber: 1000000,
  yearsToFire: 15,
  retirementAge: 45,
  projectedSavings: 250000, // 25% of the way there
  monthlyPassiveIncome: 3333,
  isOnTrack: true
};

const Profile = () => {
  const [currentSavings, setCurrentSavings] = useState<number>(250000);
  const [savingsRate, setSavingsRate] = useState<number>(30);
  const [fireResult] = useState<FireResult>(sampleFireResult);

  const handleMonthlyUpdate = (savings: number, savingsRate: number) => {
    // This would typically update state or be passed to a parent component
    setSavingsRate(savingsRate);
  };

  return (
    <div className="container max-w-6xl mx-auto p-4 py-8 space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Your Financial Profile</h1>
        <p className="text-gray-600">Track your monthly finances and progress toward FIRE</p>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Progress to Financial Independence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between mb-2 items-center">
            <span className="text-gray-600">Current savings: {formatCurrency(currentSavings)}</span>
            <span className="font-medium">{Math.round((currentSavings / fireResult.fireNumber) * 100)}%</span>
          </div>
          <Progress 
            value={(currentSavings / fireResult.fireNumber) * 100} 
            className="h-3 bg-gray-100" 
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>$0</span>
            <span>{formatCurrency(fireResult.fireNumber / 2)}</span>
            <span>{formatCurrency(fireResult.fireNumber)}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <div className="text-sm text-gray-500">FIRE Number</div>
              <div className="text-2xl font-bold text-fire-blue">
                {formatCurrency(fireResult.fireNumber)}
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <div className="text-sm text-gray-500">Current Savings Rate</div>
              <div className="text-2xl font-bold text-fire-purple">{savingsRate}%</div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <div className="text-sm text-gray-500">Est. Years to FIRE</div>
              <div className="text-2xl font-bold text-fire-orange">{fireResult.yearsToFire.toFixed(1)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="monthly-tracker" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly-tracker">Monthly Tracker</TabsTrigger>
          <TabsTrigger value="fire-tips">FIRE Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly-tracker">
          <MonthlyTracker onUpdate={handleMonthlyUpdate} />
        </TabsContent>
        
        <TabsContent value="fire-tips">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AiTips />
            
            <Card>
              <CardHeader className="bg-fire-blue/10">
                <CardTitle>Personal Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" id="task-1" />
                      <label htmlFor="task-1" className="ml-2 text-sm font-medium">Review monthly subscriptions</label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" id="task-2" />
                      <label htmlFor="task-2" className="ml-2 text-sm font-medium">Increase 401(k) contribution</label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" id="task-3" />
                      <label htmlFor="task-3" className="ml-2 text-sm font-medium">Open a Roth IRA account</label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" id="task-4" />
                      <label htmlFor="task-4" className="ml-2 text-sm font-medium">Set up auto-investments</label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" id="task-5" />
                      <label htmlFor="task-5" className="ml-2 text-sm font-medium">Research tax optimization strategies</label>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
