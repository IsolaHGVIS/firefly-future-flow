
export interface FireInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedAnnualReturn: number;
  annualExpenses: number;
  withdrawalRate: number;
}

export interface FireResult {
  fireNumber: number;
  yearsToFire: number;
  retirementAge: number;
  projectedSavings: number;
  monthlyPassiveIncome: number;
  isOnTrack: boolean;
}

export const calculateFireNumber = (annualExpenses: number, withdrawalRate: number): number => {
  return (annualExpenses * 100) / withdrawalRate;
};

export const calculateYearsToFire = (inputs: FireInputs): number => {
  const { 
    currentSavings, 
    monthlyContribution, 
    expectedAnnualReturn,
    annualExpenses,
    withdrawalRate
  } = inputs;
  
  const fireNumber = calculateFireNumber(annualExpenses, withdrawalRate);
  const monthlyReturn = expectedAnnualReturn / 100 / 12;
  
  let currentBalance = currentSavings;
  let years = 0;
  
  while (currentBalance < fireNumber && years < 100) {
    currentBalance = currentBalance * (1 + monthlyReturn) + monthlyContribution;
    
    if (years % 12 === 0) {
      // Log progress every year
    }
    
    years++;
    
    if (years > 1200) { // 100 years max
      return -1; // Not achievable
    }
  }
  
  return parseFloat((years / 12).toFixed(1));
};

export const calculateFireResult = (inputs: FireInputs): FireResult => {
  const fireNumber = calculateFireNumber(inputs.annualExpenses, inputs.withdrawalRate);
  const yearsToFire = calculateYearsToFire(inputs);
  const retirementAge = inputs.currentAge + yearsToFire;
  
  // Calculate projected savings at retirement
  const monthlyReturn = inputs.expectedAnnualReturn / 100 / 12;
  let projectedSavings = inputs.currentSavings;
  
  for (let i = 0; i < yearsToFire * 12; i++) {
    projectedSavings = projectedSavings * (1 + monthlyReturn) + inputs.monthlyContribution;
  }
  
  const monthlyPassiveIncome = (projectedSavings * (inputs.withdrawalRate / 100)) / 12;
  const isOnTrack = yearsToFire > 0 && retirementAge <= inputs.retirementAge;
  
  return {
    fireNumber,
    yearsToFire,
    retirementAge,
    projectedSavings,
    monthlyPassiveIncome,
    isOnTrack
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const calculateSavingsRate = (monthlyIncome: number, monthlyExpenses: number): number => {
  if (monthlyIncome <= 0) return 0;
  return ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
};

export const getDefaultInputs = (): FireInputs => {
  return {
    currentAge: 30,
    retirementAge: 45,
    currentSavings: 50000,
    monthlyContribution: 2000,
    expectedAnnualReturn: 7,
    annualExpenses: 40000,
    withdrawalRate: 4
  };
};

export const generateTips = (inputs: FireInputs, result: FireResult): string[] => {
  const tips: string[] = [];
  
  // General tips
  tips.push("Consider increasing your savings rate to accelerate your path to FIRE.");
  
  // Specific tips based on inputs
  if (inputs.withdrawalRate > 4) {
    tips.push("A withdrawal rate above 4% may be risky for long-term retirement. Consider a more conservative approach.");
  }
  
  if (inputs.monthlyContribution < inputs.annualExpenses / 24) {
    tips.push("Your monthly contribution is less than half your monthly expenses. Increasing this could significantly speed up your timeline.");
  }
  
  if (!result.isOnTrack) {
    tips.push(`Based on your current plan, you'll reach financial independence at age ${Math.round(result.retirementAge)}, which is later than your target retirement age.`);
    tips.push("Consider increasing your monthly contributions or finding ways to reduce your planned retirement expenses.");
  }
  
  return tips;
};
