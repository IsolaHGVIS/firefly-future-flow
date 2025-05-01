
export interface FinancialCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export const incomeCategories: FinancialCategory[] = [
  { id: 'salary', name: 'Salary', color: '#10B981' },
  { id: 'investment', name: 'Investment Returns', color: '#0EA5E9' },
  { id: 'side-hustle', name: 'Side Hustle', color: '#F97316' },
  { id: 'freelance', name: 'Freelance Work', color: '#8B5CF6' },
  { id: 'rental', name: 'Rental Income', color: '#EC4899' },
  { id: 'dividend', name: 'Dividends', color: '#14B8A6' },
  { id: 'gift', name: 'Gifts', color: '#F59E0B' },
  { id: 'tax-refund', name: 'Tax Refund', color: '#6366F1' },
  { id: 'sale', name: 'Sale of Assets', color: '#D946EF' },
  { id: 'other-income', name: 'Other Income', color: '#64748B' },
];

export const expenseCategories: FinancialCategory[] = [
  { id: 'housing', name: 'Housing/Rent', color: '#ef4444' },
  { id: 'utilities', name: 'Utilities', color: '#f97316' },
  { id: 'groceries', name: 'Groceries', color: '#84cc16' },
  { id: 'transportation', name: 'Transportation', color: '#06b6d4' },
  { id: 'dining', name: 'Dining Out', color: '#8b5cf6' },
  { id: 'entertainment', name: 'Entertainment', color: '#ec4899' },
  { id: 'health', name: 'Healthcare', color: '#14b8a6' },
  { id: 'insurance', name: 'Insurance', color: '#f59e0b' },
  { id: 'debt', name: 'Debt Payment', color: '#dc2626' },
  { id: 'education', name: 'Education', color: '#6366f1' },
  { id: 'clothing', name: 'Clothing', color: '#d946ef' },
  { id: 'personal', name: 'Personal Care', color: '#0ea5e9' },
  { id: 'subscriptions', name: 'Subscriptions', color: '#8b5cf6' },
  { id: 'gifts', name: 'Gifts/Donations', color: '#f43f5e' },
  { id: 'phone', name: 'Phone Bill', color: '#0284c7' },
  { id: 'internet', name: 'Internet/WiFi', color: '#2563eb' },
  { id: 'shopping', name: 'Shopping', color: '#c026d3' },
  { id: 'travel', name: 'Travel', color: '#15803d' },
  { id: 'other-expense', name: 'Other Expenses', color: '#64748b' },
];

export const getIncomeCategory = (id: string): FinancialCategory => {
  return incomeCategories.find(cat => cat.id === id) || 
    { id: 'unknown', name: 'Unknown', color: '#64748B' };
};

export const getExpenseCategory = (id: string): FinancialCategory => {
  return expenseCategories.find(cat => cat.id === id) || 
    { id: 'unknown', name: 'Unknown', color: '#64748B' };
};
