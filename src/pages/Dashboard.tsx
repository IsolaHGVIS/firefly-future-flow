
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FireResult, formatCurrency } from '@/utils/fireCalculations';
import AiTips from '@/components/AiTips';
import ProgressChart from '@/components/ProgressChart';
import { Lightbulb, TrendingUp, Wallet, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  initialFireResult?: FireResult;
}

// Sample data for the dashboard when no calculations have been done yet
const sampleFireResult: FireResult = {
  fireNumber: 1000000,
  yearsToFire: 15,
  retirementAge: 45,
  projectedSavings: 1100000,
  monthlyPassiveIncome: 3333,
  isOnTrack: true
};

const Dashboard: React.FC<DashboardProps> = ({ initialFireResult }) => {
  const [fireResult, setFireResult] = useState<FireResult>(initialFireResult || sampleFireResult);
  const [savingsRate, setSavingsRate] = useState<number>(30); // Default savings rate
  
  return (
    <div className="container max-w-6xl mx-auto p-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your FIRE Dashboard</h1>
          <p className="text-gray-600">Track your journey to financial independence</p>
        </div>
        <Link 
          to="/calculator" 
          className="flex items-center gap-2 bg-fire-orange text-white px-4 py-2 rounded-md hover:bg-fire-orange/90 transition-colors"
        >
          Update Your FIRE Plan
          <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">FIRE Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(fireResult.fireNumber)}</div>
            <p className="text-sm text-gray-500">Target Net Worth</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Years to FIRE</CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{fireResult.yearsToFire.toFixed(1)}</div>
            <p className="text-sm text-gray-500">Years Left</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{savingsRate}%</div>
            <p className="text-sm text-gray-500">Of Income</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Monthly Passive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(fireResult.monthlyPassiveIncome)}</div>
            <p className="text-sm text-gray-500">In Retirement</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="tips">FIRE Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Progress to FIRE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Current progress</span>
                      <span className="text-sm font-medium">{Math.round((fireResult.projectedSavings / fireResult.fireNumber) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-fire-blue h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (fireResult.projectedSavings / fireResult.fireNumber) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Savings:</span>
                      <span className="font-medium">{formatCurrency(fireResult.projectedSavings / 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">FIRE Target:</span>
                      <span className="font-medium">{formatCurrency(fireResult.fireNumber)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Retirement Age:</span>
                      <span className="font-medium">{fireResult.retirementAge}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Key Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative pl-6 border-l border-gray-200">
                      <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-fire-purple"></div>
                      <p className="text-sm font-medium">25% Complete</p>
                      <p className="text-xs text-gray-500">In {Math.round(fireResult.yearsToFire * 0.25)} years</p>
                    </div>
                    
                    <div className="relative pl-6 border-l border-gray-200">
                      <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-fire-blue"></div>
                      <p className="text-sm font-medium">50% Complete</p>
                      <p className="text-xs text-gray-500">In {Math.round(fireResult.yearsToFire * 0.5)} years</p>
                    </div>
                    
                    <div className="relative pl-6 border-l border-gray-200">
                      <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-fire-orange"></div>
                      <p className="text-sm font-medium">75% Complete</p>
                      <p className="text-xs text-gray-500">In {Math.round(fireResult.yearsToFire * 0.75)} years</p>
                    </div>
                    
                    <div className="relative pl-6">
                      <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-fire-green"></div>
                      <p className="text-sm font-medium">FIRE Achieved</p>
                      <p className="text-xs text-gray-500">In {Math.round(fireResult.yearsToFire)} years</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Monthly Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-2">Income & Savings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Income:</span>
                      <span className="font-medium">{formatCurrency(5000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Expenses:</span>
                      <span className="font-medium">{formatCurrency(3500)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-600">Monthly Savings:</span>
                      <span className="font-medium text-fire-green">{formatCurrency(1500)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Savings Rate:</span>
                      <span className="font-medium text-fire-green">{savingsRate}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Recommended Actions</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-fire-orange mt-0.5" />
                      <span className="text-sm">
                        Increasing your savings rate by 5% could help you reach FIRE {Math.round(fireResult.yearsToFire * 0.1)} years earlier.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-fire-orange mt-0.5" />
                      <span className="text-sm">
                        Consider reviewing your investment strategy to optimize returns.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-fire-orange mt-0.5" />
                      <span className="text-sm">
                        Set up an automatic monthly transfer to your investment accounts.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projections">
          <Card>
            <CardHeader>
              <CardTitle>Savings Projection</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-96">
                <ProgressChart 
                  inputs={{
                    currentAge: fireResult.retirementAge - fireResult.yearsToFire,
                    retirementAge: fireResult.retirementAge,
                    currentSavings: fireResult.projectedSavings / 2,
                    monthlyContribution: 1500,
                    expectedAnnualReturn: 7,
                    annualExpenses: fireResult.monthlyPassiveIncome * 12,
                    withdrawalRate: 4
                  }}
                  result={fireResult}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips">
          <AiTips />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
