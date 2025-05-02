
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MonthlyTracker from '@/components/MonthlyTracker';
import AiTips from '@/components/AiTips';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FireResult, formatCurrency } from '@/utils/fireCalculations';
import { ThemeToggle } from '@/components/ThemeToggle';
import MonthlyFinanceChart from '@/components/MonthlyFinanceChart';
import FinanceCalendar from '@/components/FinanceCalendar';
import { ChartBar, Calendar } from "lucide-react";
import { useAuth } from '@/components/AuthProvider';
import { getProfile, saveFinancialData } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Sample transactions for demonstration
const sampleTransactions = [
  { id: '1', amount: 5000, category: 'Salary', date: '2025-05-01', type: 'income' as const },
  { id: '2', amount: 1200, category: 'Housing', date: '2025-05-01', type: 'expense' as const },
  { id: '3', amount: 200, category: 'Utilities', date: '2025-05-02', type: 'expense' as const },
  { id: '4', amount: 350, category: 'Groceries', date: '2025-05-03', type: 'expense' as const },
  { id: '5', amount: 800, category: 'Investment', date: '2025-05-05', type: 'income' as const },
  { id: '6', amount: 150, category: 'Dining Out', date: '2025-05-08', type: 'expense' as const },
  { id: '7', amount: 1000, category: 'Side Hustle', date: '2025-05-15', type: 'income' as const },
  { id: '8', amount: 500, category: 'Shopping', date: '2025-05-15', type: 'expense' as const },
  { id: '9', amount: 100, category: 'Subscriptions', date: '2025-05-20', type: 'expense' as const },
  { id: '10', amount: 300, category: 'Transportation', date: '2025-05-25', type: 'expense' as const },
];

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentSavings, setCurrentSavings] = useState<number>(250000);
  const [savingsRate, setSavingsRate] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [fireResult, setFireResult] = useState<FireResult>({
    fireNumber: 1000000,
    yearsToFire: 15,
    retirementAge: 45,
    projectedSavings: 250000, // 25% of the way there
    monthlyPassiveIncome: 3333,
    isOnTrack: true
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        setLoading(true);
        const { profile, error } = await getProfile(user.id);
        if (profile && !error) {
          setCurrentSavings(profile.savings || 250000);
          setSavingsRate(30); // Default if not available
          setFireResult(prev => ({
            ...prev,
            fireNumber: profile.fire_goal || 1000000,
            projectedSavings: profile.savings || 250000
          }));
        }
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfileData();
    } else {
      // Make sure loading state is reset for demo mode
      setLoading(false);
    }
  }, [user]);

  // Calculate total income, expenses, and net balance from transactions
  const totalIncome = sampleTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = sampleTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const totalBalance = currentSavings + netBalance;
  const firePercentage = (totalBalance / fireResult.fireNumber) * 100;

  const handleMonthlyUpdate = (savings: number, savingsRate: number) => {
    setSavingsRate(savingsRate);
    
    // Save data to Supabase if user is logged in
    if (user?.id) {
      saveFinancialData(user.id, {
        savingsRate,
        monthlyIncome: totalIncome,
        monthlyExpenses: totalExpenses,
        netBalance
      }).then(() => {
        toast({
          title: "Data saved",
          description: "Your financial data has been updated successfully",
        });
      }).catch(() => {
        toast({
          title: "Error saving data",
          description: "There was a problem updating your financial data",
          variant: "destructive",
        });
      });
    } else {
      // Just show a demo message if not logged in
      toast({
        title: "Demo mode",
        description: "Sign in to save your financial data",
      });
    }
  };

  // Guest view for profile page with demo data
  const renderGuestProfileView = () => (
    <div className="container max-w-6xl mx-auto p-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Demo Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This is a demo of the financial tracker. <Button 
              onClick={() => navigate('/signin')}
              variant="link"
              className="p-0 h-auto text-fire-purple"
            >
              Sign in
            </Button> or <Button 
              onClick={() => navigate('/signup')}
              variant="link"
              className="p-0 h-auto text-fire-purple"
            >
              create an account
            </Button> to save your data.
          </p>
        </div>
        <ThemeToggle />
      </div>
      
      {/* Show the same content as if user was logged in, but with demo data */}
      {renderProfileContent()}
      
      <div className="fixed bottom-4 right-4 bg-fire-purple text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <span>Create an account to save your data</span>
        <Button 
          onClick={() => navigate('/signup')}
          variant="secondary"
          size="sm"
          className="bg-white text-fire-purple hover:bg-gray-100"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
  
  // Loading state
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading your profile...</div>
      </div>
    );
  }

  // Profile content that's shown regardless of auth state
  const renderProfileContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Current Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentSavings)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total investment portfolio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Net Balance (Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-fire-green' : 'text-fire-red'}`}>
              {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Income minus expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">Savings + current month net</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">FIRE Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(firePercentage)}%</div>
            <Progress value={firePercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Progress to Financial Independence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between mb-2 items-center">
            <span className="text-gray-600 dark:text-gray-400">Current net worth: {formatCurrency(totalBalance)}</span>
            <span className="font-medium">{Math.round((totalBalance / fireResult.fireNumber) * 100)}%</span>
          </div>
          <Progress 
            value={(totalBalance / fireResult.fireNumber) * 100} 
            className="h-3 bg-gray-100 dark:bg-gray-800" 
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>$0</span>
            <span>{formatCurrency(fireResult.fireNumber / 2)}</span>
            <span>{formatCurrency(fireResult.fireNumber)}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">FIRE Number</div>
              <div className="text-2xl font-bold text-fire-blue">
                {formatCurrency(fireResult.fireNumber)}
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Current Savings Rate</div>
              <div className="text-2xl font-bold text-fire-purple">{savingsRate}%</div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Est. Years to FIRE</div>
              <div className="text-2xl font-bold text-fire-orange">{fireResult.yearsToFire.toFixed(1)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="monthly-tracker" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly-tracker">Monthly Tracker</TabsTrigger>
          <TabsTrigger value="charts">
            <ChartBar className="mr-2 h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="fire-tips">FIRE Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly-tracker">
          <MonthlyTracker onUpdate={handleMonthlyUpdate} />
        </TabsContent>
        
        <TabsContent value="charts">
          <MonthlyFinanceChart transactions={sampleTransactions} />
        </TabsContent>
        
        <TabsContent value="calendar">
          <FinanceCalendar transactions={sampleTransactions} />
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
    </>
  );

  // Main render function
  if (!user) {
    return renderGuestProfileView();
  }

  return (
    <div className="container max-w-6xl mx-auto p-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Financial Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your monthly finances and progress toward FIRE</p>
        </div>
        <ThemeToggle />
      </div>
      
      {renderProfileContent()}
    </div>
  );
};

export default Profile;
