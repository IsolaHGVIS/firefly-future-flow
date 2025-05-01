
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/utils/fireCalculations';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChartBar, LineChart as LineChartIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface MonthlyFinanceChartProps {
  transactions: Transaction[];
  month?: Date;
}

const MonthlyFinanceChart: React.FC<MonthlyFinanceChartProps> = ({ 
  transactions,
  month = new Date() 
}) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'growth'>('bar');
  const monthName = month.toLocaleString('default', { month: 'long' });
  const yearNumber = month.getFullYear();
  
  const monthlyData = useMemo(() => {
    const currentMonth = month.getMonth();
    const currentYear = month.getFullYear();
    
    // Filter transactions for the current month
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    // Group transactions by day of month
    const byDay: Record<number, { day: number, income: number, expense: number, net: number }> = {};
    
    // Initialize all days of the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      byDay[i] = { day: i, income: 0, expense: 0, net: 0 };
    }
    
    // Sum transactions by day
    monthTransactions.forEach(t => {
      const day = new Date(t.date).getDate();
      if (t.type === 'income') {
        byDay[day].income += t.amount;
      } else {
        byDay[day].expense += t.amount;
      }
      byDay[day].net = byDay[day].income - byDay[day].expense;
    });
    
    return Object.values(byDay);
  }, [transactions, month]);

  // Generate growth data with cumulative totals
  const growthData = useMemo(() => {
    let cumulativeNet = 0;
    return monthlyData.map(day => {
      cumulativeNet += day.net;
      return {
        ...day,
        cumulativeNet
      };
    });
  }, [monthlyData]);

  // Get total values
  const totals = useMemo(() => {
    const totalIncome = monthlyData.reduce((sum, day) => sum + day.income, 0);
    const totalExpense = monthlyData.reduce((sum, day) => sum + day.expense, 0);
    const netTotal = totalIncome - totalExpense;
    const netTrend = netTotal > 0 ? 'positive' : netTotal < 0 ? 'negative' : 'neutral';
    
    return { totalIncome, totalExpense, netTotal, netTrend };
  }, [monthlyData]);

  const chartConfig = {
    income: { theme: { light: "#10B981", dark: "#10B981" }, label: "Income" },
    expense: { theme: { light: "#ef4444", dark: "#ef4444" }, label: "Expenses" },
    net: { theme: { light: "#0EA5E9", dark: "#0EA5E9" }, label: "Net" },
    cumulativeNet: { theme: { light: "#7E69AB", dark: "#9b87f5" }, label: "Growth" }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <CardTitle className="text-xl font-bold">
              Financial Overview: {monthName} {yearNumber}
            </CardTitle>
            <CardDescription>
              Daily cash flow and monthly growth tracking
            </CardDescription>
          </div>
          <div className="space-x-2">
            <Button 
              variant={chartType === 'bar' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setChartType('bar')}
              className="h-8"
            >
              <ChartBar className="h-4 w-4 mr-2" />
              Bar
            </Button>
            <Button 
              variant={chartType === 'line' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('line')}
              className="h-8"
            >
              <LineChartIcon className="h-4 w-4 mr-2" />
              Line
            </Button>
            <Button 
              variant={chartType === 'growth' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('growth')}
              className="h-8"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Growth
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="bg-muted/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-fire-green">{formatCurrency(totals.totalIncome)}</p>
              </div>
              <ArrowUp className="h-8 w-8 text-fire-green" />
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-fire-red">{formatCurrency(totals.totalExpense)}</p>
              </div>
              <ArrowDown className="h-8 w-8 text-fire-red" />
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Balance</p>
                <p className={`text-2xl font-bold ${totals.netTrend === 'positive' ? 'text-fire-green' : 'text-fire-red'}`}>
                  {formatCurrency(totals.netTotal)}
                </p>
              </div>
              {totals.netTrend === 'positive' ? (
                <ArrowUp className="h-8 w-8 text-fire-green" />
              ) : (
                <ArrowDown className="h-8 w-8 text-fire-red" />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="h-96 w-full">
          <ChartContainer 
            config={chartConfig} 
            className="h-full w-full rounded-lg border border-border overflow-hidden"
          >
            {chartType === 'bar' && (
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="day" 
                  tickFormatter={(day) => `${day}`}
                  className="text-xs text-muted-foreground fill-muted-foreground"
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, '')} 
                  className="text-xs text-muted-foreground fill-muted-foreground"
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent 
                          formatter={(value, name) => [formatCurrency(value as number), name]}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net" name="Net" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
            
            {chartType === 'line' && (
              <LineChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="day" 
                  tickFormatter={(day) => `${day}`}
                  className="text-xs text-muted-foreground fill-muted-foreground"
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, '')} 
                  className="text-xs text-muted-foreground fill-muted-foreground"
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent 
                          formatter={(value, name) => [formatCurrency(value as number), name]}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="net" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            )}
            
            {chartType === 'growth' && (
              <LineChart
                data={growthData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="day" 
                  tickFormatter={(day) => `${day}`}
                  className="text-xs text-muted-foreground fill-muted-foreground"
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, '')} 
                  className="text-xs text-muted-foreground fill-muted-foreground"
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent 
                          formatter={(value, name) => [formatCurrency(value as number), name]}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeNet" 
                  name="Monthly Growth" 
                  stroke="#7E69AB" 
                  strokeWidth={3} 
                  dot={{ r: 3 }} 
                  activeDot={{ r: 6 }} 
                  fill="url(#colorGrowth)" 
                />
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7E69AB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7E69AB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </LineChart>
            )}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyFinanceChart;
