/**
 * Retirement Calculation Utilities
 * Pure math functions for dynamic personalized advice
 */

/**
 * Calculate additional monthly savings needed to cover shortfall
 * Uses Future Value of Annuity formula solved for payment
 * FV = PMT × [((1 + r)^n - 1) / r]
 * Solving for PMT: PMT = FV / [((1 + r)^n - 1) / r]
 *
 * @param {number} shortfall - Amount needed at retirement
 * @param {number} yearsToRetirement - Years until retirement
 * @param {number} returnRate - Annual return rate (default 0.06)
 * @returns {number} Additional monthly savings needed
 */
export function calculateAdditionalSavingsNeeded(shortfall, yearsToRetirement, returnRate = 0.06) {
  if (shortfall <= 0 || yearsToRetirement <= 0) return 0;

  const monthlyRate = returnRate / 12;
  const months = yearsToRetirement * 12;

  const denominator = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

  if (denominator === 0 || isNaN(denominator)) return shortfall / months;

  return Math.round(shortfall / denominator);
}

/**
 * Calculate when retirement savings will run out
 * Simulates month-by-month withdrawal with returns and inflation
 *
 * @param {number} startingBalance - Savings at retirement
 * @param {number} retireAge - Age at retirement
 * @param {number} monthlyExpenses - Monthly retirement expenses
 * @param {number} returnRate - Annual return rate (default 0.04)
 * @param {number} inflationRate - Annual inflation rate (default 0.03)
 * @returns {number} Age when savings run out (or 120 if never)
 */
export function calculateRunOutAge(
  startingBalance,
  retireAge,
  monthlyExpenses,
  returnRate = 0.04,
  inflationRate = 0.03
) {
  if (startingBalance <= 0) return retireAge;

  let balance = startingBalance;
  let age = retireAge;

  // Real return adjusted for inflation
  const realAnnualReturn = (1 + returnRate) / (1 + inflationRate) - 1;
  const monthlyRealReturn = realAnnualReturn / 12;

  // Simulate month by month
  let monthCount = 0;
  const maxMonths = (120 - retireAge) * 12; // Max age 120

  while (balance > 0 && monthCount < maxMonths) {
    // Grow balance
    balance = balance * (1 + monthlyRealReturn);

    // Subtract expenses
    balance -= monthlyExpenses;

    // Check if balance went negative
    if (balance < 0) {
      // Calculate partial month
      const monthsThisYear = monthCount % 12;
      return Math.floor(age + monthsThisYear / 12);
    }

    monthCount++;
    if (monthCount % 12 === 0) {
      age++;
    }
  }

  return Math.floor(age);
}

/**
 * Calculate how many years to delay retirement to cover shortfall
 *
 * @param {number} shortfall - Amount needed at retirement
 * @param {number} currentMonthlySavings - Current monthly savings amount
 * @param {number} returnRate - Annual return rate (default 0.06)
 * @returns {number} Years to delay
 */
export function calculateDelayNeeded(shortfall, currentMonthlySavings, returnRate = 0.06) {
  if (shortfall <= 0 || currentMonthlySavings <= 0) return 0;

  const monthlyRate = returnRate / 12;

  let months = 0;
  let accumulated = 0;
  const maxMonths = 600; // Max 50 years

  // Using FV annuity formula with iteration
  while (accumulated < shortfall && months < maxMonths) {
    accumulated = accumulated * (1 + monthlyRate) + currentMonthlySavings;
    months++;
  }

  return Math.ceil(months / 12);
}

/**
 * Calculate monthly expense reduction needed to cover shortfall
 * Uses present value of growing annuity formula
 *
 * @param {number} shortfall - Amount needed at retirement
 * @param {number} retirementYears - Years in retirement
 * @param {number} returnRate - Annual return rate (default 0.04)
 * @param {number} inflationRate - Annual inflation rate (default 0.03)
 * @returns {number} Monthly expense reduction needed
 */
export function calculateExpenseReduction(
  shortfall,
  retirementYears,
  returnRate = 0.04,
  inflationRate = 0.03
) {
  if (shortfall <= 0 || retirementYears <= 0) return 0;

  // Real return adjusted for inflation
  const realAnnualReturn = (1 + returnRate) / (1 + inflationRate) - 1;
  const monthlyRate = realAnnualReturn / 12;
  const months = retirementYears * 12;

  // PV of annuity factor: [1 - (1 + r)^(-n)] / r
  if (monthlyRate === 0 || isNaN(monthlyRate)) {
    return Math.round(shortfall / months);
  }

  const factor = (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;

  if (factor === 0 || isNaN(factor)) return Math.round(shortfall / months);

  return Math.round(shortfall / factor);
}

/**
 * Calculate how many years early retirement is possible with surplus
 *
 * @param {number} surplus - Extra amount beyond target
 * @param {number} monthlyExpenses - Monthly retirement expenses
 * @param {number} returnRate - Annual return rate (default 0.04)
 * @param {number} inflationRate - Annual inflation rate (default 0.03)
 * @returns {number} Years early possible
 */
export function calculateEarlyRetirement(
  surplus,
  monthlyExpenses,
  returnRate = 0.04,
  inflationRate = 0.03
) {
  if (surplus <= 0 || monthlyExpenses <= 0) return 0;

  // Real return adjusted for inflation
  const realAnnualReturn = (1 + returnRate) / (1 + inflationRate) - 1;
  const monthlyRealReturn = realAnnualReturn / 12;

  let balance = surplus;
  let months = 0;
  const maxMonths = 600; // Max 50 years

  // How many months can this surplus cover?
  while (balance > 0 && months < maxMonths) {
    balance = balance * (1 + monthlyRealReturn) - monthlyExpenses;
    if (balance > 0) months++;
  }

  return Math.floor(months / 12);
}

/**
 * Calculate projected savings at retirement
 * Uses proper monthly compounding
 *
 * @param {number} currentSavings - Current savings
 * @param {number} monthlySavings - Monthly savings amount
 * @param {number} yearsToRetirement - Years until retirement
 * @param {number} returnRate - Annual return rate (default 0.06)
 * @returns {number} Projected savings at retirement
 */
export function calculateProjectedSavings(
  currentSavings,
  monthlySavings,
  yearsToRetirement,
  returnRate = 0.06
) {
  if (yearsToRetirement <= 0) return currentSavings;

  const monthlyRate = returnRate / 12;
  const months = yearsToRetirement * 12;

  // Future value of current savings with monthly compounding
  const fvCurrentSavings = currentSavings * Math.pow(1 + monthlyRate, months);

  // Future value of monthly contributions (annuity due - payments at start of period)
  // For simplicity, we'll use ordinary annuity formula
  const fvAnnuity =
    monthlySavings *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  return Math.round(fvCurrentSavings + fvAnnuity);
}

/**
 * Calculate needed savings at retirement
 * Uses present value of annuity adjusted for inflation
 *
 * @param {number} retirementExpenses - Annual retirement expenses
 * @param {number} retirementYears - Years in retirement
 * @param {number} returnRate - Annual return rate (default 0.04)
 * @param {number} inflationRate - Annual inflation rate (default 0.03)
 * @returns {number} Needed savings at retirement
 */
export function calculateNeededSavings(
  retirementExpenses,
  retirementYears,
  returnRate = 0.04,
  inflationRate = 0.03
) {
  const monthlyExpenses = retirementExpenses / 12;

  // Real return adjusted for inflation
  const realAnnualReturn = (1 + returnRate) / (1 + inflationRate) - 1;
  const monthlyRealReturn = realAnnualReturn / 12;

  const months = retirementYears * 12;

  // PV of annuity: PMT × [1 - (1 + r)^(-n)] / r
  if (monthlyRealReturn === 0 || isNaN(monthlyRealReturn)) {
    return Math.round(monthlyExpenses * months);
  }

  const factor = (1 - Math.pow(1 + monthlyRealReturn, -months)) / monthlyRealReturn;

  if (factor === 0 || isNaN(factor)) return Math.round(monthlyExpenses * months);

  return Math.round(monthlyExpenses * factor);
}

/**
 * Calculate extra monthly spending possible with surplus
 *
 * @param {number} surplus - Surplus amount
 * @param {number} retirementYears - Years in retirement
 * @param {number} returnRate - Annual return rate (default 0.04)
 * @param {number} inflationRate - Annual inflation rate (default 0.03)
 * @returns {number} Extra monthly spending
 */
export function calculateExtraMonthlySpending(
  surplus,
  retirementYears,
  returnRate = 0.04,
  inflationRate = 0.03
) {
  if (surplus <= 0) return 0;

  const realAnnualReturn = (1 + returnRate) / (1 + inflationRate) - 1;
  const monthlyRealReturn = realAnnualReturn / 12;
  const months = retirementYears * 12;

  // PMT = PV / [1 - (1 + r)^(-n)] / r
  if (monthlyRealReturn === 0 || isNaN(monthlyRealReturn)) {
    return Math.round(surplus / months);
  }

  const factor = (1 - Math.pow(1 + monthlyRealReturn, -months)) / monthlyRealReturn;

  if (factor === 0 || isNaN(factor)) return Math.round(surplus / months);

  return Math.round(surplus / factor);
}
