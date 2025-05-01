
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { calculateSavingsRate, formatCurrency } from '@/utils/fireCalculations';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { CalendarIcon, Plus, Trash, DollarSign, Tag } from 'lucide-react';
import { incomeCategories, expenseCategories } from '@/utils/financialCategories';

interface MoneyItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface MonthlyTrackerProps {
  onUpdate?: (savings: number, savingsRate: number) => void;
}

const COLORS = ['#9b87f5', '#8B5CF6', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF'];

const MonthlyTracker: React.FC<MonthlyTrackerProps> = ({ onUpdate }) => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);
  // Start with itemized income as default (true instead of false)
  const [showIncomeItems, setShowIncomeItems] = useState<boolean>(true);
  const [incomeItems, setIncomeItems] = useState<MoneyItem[]>([
    {
      id: "default-salary",
      name: "Monthly Salary",
      amount: 5000,
      category: "salary"
    }
  ]);
  const [expenseItems, setExpenseItems] = useState<MoneyItem[]>([]);
  
  const [newIncomeName, setNewIncomeName] = useState<string>('');
  const [newIncomeAmount, setNewIncomeAmount] = useState<number>(0);
  const [newIncomeCategory, setNewIncomeCategory] = useState<string>(incomeCategories[0].id);
  
  const [newExpenseName, setNewExpenseName] = useState<string>('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number>(0);
  const [newExpenseCategory, setNewExpenseCategory] = useState<string>(expenseCategories[0].id);
  
  // Calculate totals
  const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0) || monthlyIncome;
  const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlySavings = totalIncome - totalExpenses;
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);
  
  // Prepare chart data for expenses
  const getExpenseChartData = () => {
    const categoryMap = new Map<string, { value: number, color: string, name: string }>();
    
    // Group expenses by category
    expenseItems.forEach((item) => {
      const category = expenseCategories.find(cat => cat.id === item.category);
      const currentAmount = categoryMap.get(item.category)?.value || 0;
      
      categoryMap.set(item.category, {
        value: currentAmount + item.amount,
        color: category?.color || '#7E69AB', // Updated default color to purple
        name: category?.name || item.category
      });
    });
    
    // Add savings as a category if positive
    if (monthlySavings > 0) {
      categoryMap.set('savings', {
        value: monthlySavings,
        color: '#9b87f5', // Updated to purple
        name: 'Savings'
      });
    }
    
    // Convert map to array for chart
    return Array.from(categoryMap.values());
  };
  
  // Prepare chart data for income
  const getIncomeChartData = () => {
    const categoryMap = new Map<string, { value: number, color: string, name: string }>();
    
    // Group income by category
    incomeItems.forEach((item) => {
      const category = incomeCategories.find(cat => cat.id === item.category);
      const currentAmount = categoryMap.get(item.category)?.value || 0;
      
      categoryMap.set(item.category, {
        value: currentAmount + item.amount,
        color: category?.color || '#7E69AB', // Updated default color to purple
        name: category?.name || item.category
      });
    });
    
    // If no income items but we have a monthly income, add a default
    if (incomeItems.length === 0 && monthlyIncome > 0) {
      categoryMap.set('default', {
        value: monthlyIncome,
        color: '#9b87f5', // Updated to purple
        name: 'Monthly Income'
      });
    }
    
    // Convert map to array for chart
    return Array.from(categoryMap.values());
  };
  
  const addIncomeItem = () => {
    if (!newIncomeName || newIncomeAmount <= 0) return;
    
    const newItem: MoneyItem = {
      id: Date.now().toString(),
      name: newIncomeName,
      amount: newIncomeAmount,
      category: newIncomeCategory
    };
    
    setIncomeItems([...incomeItems, newItem]);
    setNewIncomeName('');
    setNewIncomeAmount(0);
    
    // Update the internal state to use itemized income
    setShowIncomeItems(true);
    
    if (onUpdate) {
      const newTotalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0) + newIncomeAmount;
      onUpdate(newTotalIncome - totalExpenses, calculateSavingsRate(newTotalIncome, totalExpenses));
    }
  };
  
  const removeIncomeItem = (id: string) => {
    const updatedItems = incomeItems.filter(item => item.id !== id);
    setIncomeItems(updatedItems);
    
    // If no more income items, revert to simple income input
    if (updatedItems.length === 0) {
      setShowIncomeItems(false);
    }
    
    const newTotalIncome = updatedItems.reduce((sum, item) => sum + item.amount, 0) || monthlyIncome;
    if (onUpdate) {
      onUpdate(newTotalIncome - totalExpenses, calculateSavingsRate(newTotalIncome, totalExpenses));
    }
  };
  
  const addExpenseItem = () => {
    if (!newExpenseName || newExpenseAmount <= 0) return;
    
    const newItem: MoneyItem = {
      id: Date.now().toString(),
      name: newExpenseName,
      amount: newExpenseAmount,
      category: newExpenseCategory
    };
    
    setExpenseItems([...expenseItems, newItem]);
    setNewExpenseName('');
    setNewExpenseAmount(0);
    
    if (onUpdate) {
      onUpdate(totalIncome - (totalExpenses + newExpenseAmount), 
        calculateSavingsRate(totalIncome, totalExpenses + newExpenseAmount));
    }
  };
  
  const removeExpenseItem = (id: string) => {
    const updatedItems = expenseItems.filter(item => item.id !== id);
    setExpenseItems(updatedItems);
    
    const newTotalExpenses = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    if (onUpdate) {
      onUpdate(totalIncome - newTotalExpenses, calculateSavingsRate(totalIncome, newTotalExpenses));
    }
  };
  
  const updateIncome = (value: number) => {
    setMonthlyIncome(value);
    
    if (onUpdate) {
      // Only use this value if we're not using itemized income
      if (!showIncomeItems) {
        onUpdate(value - totalExpenses, calculateSavingsRate(value, totalExpenses));
      }
    }
  };
  
  const getCategoryName = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      return incomeCategories.find(cat => cat.id === id)?.name || id;
    } else {
      return expenseCategories.find(cat => cat.id === id)?.name || id;
    }
  };
  
  const getCategoryColor = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      return incomeCategories.find(cat => cat.id === id)?.color || '#7E69AB'; // Updated default color
    } else {
      return expenseCategories.find(cat => cat.id === id)?.color || '#7E69AB'; // Updated default color
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle>Income & Expenses</CardTitle>
            <CardDescription>Track your monthly cash flow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showIncomeItems ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="monthlyIncome">Monthly Income</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowIncomeItems(true)}
                    className="h-6 px-2 text-xs"
                  >
                    Itemize Income
                  </Button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => updateIncome(parseFloat(e.target.value) || 0)}
                    className="pl-9"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Income Items</Label>
                  <Badge variant="success" className="text-xs">
                    Total: {formatCurrency(totalIncome)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {incomeItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md group">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-8 rounded-full" 
                          style={{ backgroundColor: getCategoryColor(item.category, 'income') }}
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {getCategoryName(item.category, 'income')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-fire-green">{formatCurrency(item.amount)}</span>
                        <button
                          onClick={() => removeIncomeItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-fire-red transition-opacity"
                          title="Remove item"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 pb-4 border-b border-muted">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Income name"
                        value={newIncomeName}
                        onChange={(e) => setNewIncomeName(e.target.value)}
                        className="flex-1"
                      />
                      <div className="relative w-28">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                        </span>
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={newIncomeAmount || ''}
                          onChange={(e) => setNewIncomeAmount(parseFloat(e.target.value) || 0)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={newIncomeCategory}
                        onChange={(e) => setNewIncomeCategory(e.target.value)}
                      >
                        {incomeCategories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                      
                      <Button 
                        onClick={addIncomeItem} 
                        className="flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex justify-between mb-2">
                <p className="text-muted-foreground">Total Income:</p>
                <p className="font-semibold text-fire-green">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-muted-foreground">Total Expenses:</p>
                <p className="font-semibold text-fire-red">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-muted-foreground">Monthly Savings:</p>
                <p className={`font-semibold ${monthlySavings >= 0 ? 'text-fire-green' : 'text-fire-red'}`}>
                  {formatCurrency(monthlySavings)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Savings Rate:</p>
                <p className={`font-semibold ${savingsRate >= 0 ? 'text-fire-green' : 'text-fire-red'}`}>
                  {savingsRate.toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-muted space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Expenses</h3>
                <Badge variant="destructive" className="text-xs">
                  Total: {formatCurrency(totalExpenses)}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Expense name"
                    value={newExpenseName}
                    onChange={(e) => setNewExpenseName(e.target.value)}
                    className="flex-1"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newExpenseAmount || ''}
                      onChange={(e) => setNewExpenseAmount(parseFloat(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                  >
                    {expenseCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  
                  <Button 
                    onClick={addExpenseItem} 
                    className="flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <Plus size={16} />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle>Income Breakdown</CardTitle>
              <CardDescription>Source distribution of your income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60"> {/* Increased height to prevent text cutting off */}
                {totalIncome > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getIncomeChartData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70} {/* Reduced outer radius to prevent text cut-off */}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getIncomeChartData().map((entry, index) => (
                          <Cell key={`cell-income-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Add income items to see your breakdown
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle>Spending Breakdown</CardTitle>
              <CardDescription>Where your money is going</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60"> {/* Increased height to prevent text cutting off */}
                {expenseItems.length > 0 || monthlySavings > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getExpenseChartData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70} {/* Reduced outer radius to prevent text cut-off */}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getExpenseChartData().map((entry, index) => (
                          <Cell key={`cell-expense-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Add expenses to see your spending breakdown
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-4 max-h-64 overflow-y-auto">
        <h3 className="font-medium mb-2">Expense List</h3>
        {expenseItems.length > 0 ? (
          <div className="space-y-2">
            {expenseItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md group">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-8 rounded-full" 
                    style={{ backgroundColor: getCategoryColor(item.category, 'expense') }}
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getCategoryName(item.category, 'expense')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span>{formatCurrency(item.amount)}</span>
                  <button
                    onClick={() => removeExpenseItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-fire-red transition-opacity"
                    title="Remove expense"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No expenses added yet</p>
        )}
      </div>
    </div>
  );
};

export default MonthlyTracker;
