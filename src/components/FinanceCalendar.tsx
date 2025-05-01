
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/fireCalculations';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface TransactionsByDate {
  [date: string]: {
    income: number;
    expense: number;
  };
}

interface FinanceCalendarProps {
  transactions: Transaction[];
}

const FinanceCalendar: React.FC<FinanceCalendarProps> = ({ transactions }) => {
  const [date, setDate] = useState<Date>(new Date());
  
  // Group transactions by date
  const transactionsByDate: TransactionsByDate = transactions.reduce((acc, transaction) => {
    const dateKey = format(new Date(transaction.date), 'yyyy-MM-dd');
    
    if (!acc[dateKey]) {
      acc[dateKey] = { income: 0, expense: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[dateKey].income += transaction.amount;
    } else {
      acc[dateKey].expense += transaction.amount;
    }
    
    return acc;
  }, {} as TransactionsByDate);
  
  // Get transactions for the selected date
  const selectedDateKey = format(date, 'yyyy-MM-dd');
  const selectedTransactions = transactions.filter(t => 
    format(new Date(t.date), 'yyyy-MM-dd') === selectedDateKey
  );
  
  // Custom day render function to show transaction indicators
  const dayRender = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayTransactions = transactionsByDate[dateKey];
    
    if (!dayTransactions) return null;
    
    const net = dayTransactions.income - dayTransactions.expense;
    const isPositive = net >= 0;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className={cn(
          "absolute -bottom-1 left-0 right-0 h-1 rounded-sm", 
          isPositive ? "bg-fire-green" : "bg-fire-red"
        )} />
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Financial Calendar</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border shadow pointer-events-auto"
              components={{
                DayContent: ({ date }) => (
                  <>
                    <div>{format(date, 'd')}</div>
                    {dayRender(date)}
                  </>
                )
              }}
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <h3 className="font-medium text-lg">
              {format(date, 'MMMM d, yyyy')}
            </h3>
            
            {selectedTransactions.length > 0 ? (
              <div className="space-y-2">
                {selectedTransactions.map(transaction => (
                  <div 
                    key={transaction.id}
                    className={cn(
                      "p-3 rounded-md flex items-center justify-between",
                      transaction.type === 'income' ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                    )}
                  >
                    <div>
                      <Badge variant={transaction.type === 'income' ? "outline" : "destructive"}>
                        {transaction.category}
                      </Badge>
                    </div>
                    <div className={cn(
                      "font-medium",
                      transaction.type === 'income' ? "text-fire-green" : "text-fire-red"
                    )}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No transactions on this date
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceCalendar;
