
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateSavingsRate, formatCurrency } from '@/utils/fireCalculations';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { CalendarIcon, Plus, Trash } from 'lucide-react';

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface MonthlyTrackerProps {
  onUpdate?: (savings: number, savingsRate: number) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Healthcare',
  'Entertainment',
  'Personal',
  'Other'
];

const MonthlyTracker: React.FC<MonthlyTrackerProps> = ({ onUpdate }) => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [newExpenseName, setNewExpenseName] = useState<string>('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number>(0);
  const [newExpenseCategory, setNewExpenseCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  
  // Calculate totals
  const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlySavings = monthlyIncome - totalExpenses;
  const savingsRate = calculateSavingsRate(monthlyIncome, totalExpenses);
  
  // Prepare chart data
  const getChartData = () => {
    const categoryMap = new Map<string, number>();
    
    // Group expenses by category
    expenseItems.forEach((item) => {
      const currentAmount = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, currentAmount + item.amount);
    });
    
    // Add savings as a category
    if (monthlySavings > 0) {
      categoryMap.set('Savings', monthlySavings);
    }
    
    // Convert map to array for chart
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  const addExpenseItem = () => {
    if (!newExpenseName || newExpenseAmount <= 0) return;
    
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      name: newExpenseName,
      amount: newExpenseAmount,
      category: newExpenseCategory
    };
    
    setExpenseItems([...expenseItems, newItem]);
    setNewExpenseName('');
    setNewExpenseAmount(0);
    
    if (onUpdate) {
      onUpdate(monthlyIncome - (totalExpenses + newExpenseAmount), 
        calculateSavingsRate(monthlyIncome, totalExpenses + newExpenseAmount));
    }
  };
  
  const removeExpenseItem = (id: string) => {
    const updatedItems = expenseItems.filter(item => item.id !== id);
    setExpenseItems(updatedItems);
    
    const newTotalExpenses = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    if (onUpdate) {
      onUpdate(monthlyIncome - newTotalExpenses, 
        calculateSavingsRate(monthlyIncome, newTotalExpenses));
    }
  };
  
  const updateIncome = (value: number) => {
    setMonthlyIncome(value);
    
    if (onUpdate) {
      onUpdate(value - totalExpenses, calculateSavingsRate(value, totalExpenses));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income & Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => updateIncome(parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Total Expenses:</p>
                <p className="font-semibold">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Monthly Savings:</p>
                <p className={`font-semibold ${monthlySavings >= 0 ? 'text-fire-green' : 'text-fire-red'}`}>
                  {formatCurrency(monthlySavings)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Savings Rate:</p>
                <p className={`font-semibold ${savingsRate >= 0 ? 'text-fire-green' : 'text-fire-red'}`}>
                  {savingsRate.toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-medium mb-3">Add New Expense</h3>
              <div className="grid grid-cols-1 gap-3">
                <Input
                  placeholder="Expense name"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                />
                
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newExpenseAmount || ''}
                    onChange={(e) => setNewExpenseAmount(parseFloat(e.target.value) || 0)}
                    className="pl-8"
                  />
                </div>
                
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value)}
                >
                  {EXPENSE_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <Button 
                  onClick={addExpenseItem} 
                  className="flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Expense
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {expenseItems.length > 0 || monthlySavings > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Savings' ? '#10B981' : COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Add expenses to see your spending breakdown
                </div>
              )}
            </div>
            
            <div className="mt-4 max-h-64 overflow-y-auto">
              <h3 className="font-medium mb-2">Expense List</h3>
              {expenseItems.length > 0 ? (
                <div className="space-y-2">
                  {expenseItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{formatCurrency(item.amount)}</span>
                        <button
                          onClick={() => removeExpenseItem(item.id)}
                          className="text-gray-400 hover:text-fire-red"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No expenses added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyTracker;
