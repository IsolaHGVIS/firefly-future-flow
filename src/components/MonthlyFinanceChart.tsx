
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/fireCalculations';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Cash Flow</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
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
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="net" name="Net" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyFinanceChart;
