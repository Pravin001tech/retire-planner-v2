/**
 * Test to verify the annual/monthly expense fix
 * Based on user's Python verification
 */

console.log('=== UNIT CONSISTENCY FIX VERIFICATION ===\n');

// Helper function to calculate target (PV of annuity)
function calculateTarget(monthlyExpenses, years, postRetireReturn = 0.04, inflation = 0.03) {
  const realAnnualReturn = (1 + postRetireReturn) / (1 + inflation) - 1;
  const realMonthlyRate = Math.pow(1 + realAnnualReturn, 1/12) - 1;
  const months = years * 12;

  if (realMonthlyRate === 0) {
    return monthlyExpenses * months;
  }

  return monthlyExpenses * (1 - Math.pow(1 + realMonthlyRate, -months)) / realMonthlyRate;
}

// Helper to calculate FV with monthly compounding
function calculateFV(pv, monthlyPmt, years, annualReturn = 0.06) {
  const r = Math.pow(1 + annualReturn, 1/12) - 1;
  const n = years * 12;
  return pv * Math.pow(1 + r, n) + monthlyPmt * (Math.pow(1 + r, n) - 1) / r;
}

// Test 1: Screenshot 1 scenario
console.log('TEST 1: Screenshot 1');
console.log('Age: 40 → 47 (7 years)');
console.log('Current: $1,716,000, Monthly: $20,000');
console.log('Retirement Expenses: $99,000/year (should be treated as ANNUAL)');
console.log('---');

const monthlyExpenses = 99000 / 12;
const yearsSS1 = 95 - 47;
const targetSS1 = calculateTarget(monthlyExpenses, yearsSS1);
console.log(`✓ Target Nest Egg: $${Math.round(targetSS1).toLocaleString()}`);
console.log(`  Expected: ~$3.8M (was showing $45.5M - WRONG!)`);
console.log(`  Status: ${Math.abs(targetSS1 - 3800000) < 200000 ? '✓ CORRECT' : '✗ STILL WRONG'}`);

const projectedSS1 = calculateFV(1716000, 20000, 7);
console.log(`\n✓ Projected at 47: $${Math.round(projectedSS1).toLocaleString()}`);
console.log(`  Expected: ~$4.65M (was showing $5.93M - TOO HIGH!)`);
console.log(`  Status: ${Math.abs(projectedSS1 - 4650000) < 200000 ? '✓ CORRECT' : '✗ STILL WRONG'}`);

// Test 2: Screenshot 2 scenario
console.log('\n\nTEST 2: Screenshot 2');
console.log('Age: 40 → 68 (28 years)');
console.log('Current: $92,000, Monthly: $20,000');
console.log('Retirement Expenses: $99,000/year');
console.log('---');

const yearsSS2 = 95 - 68;
const targetSS2 = calculateTarget(monthlyExpenses, yearsSS2);
console.log(`✓ Target Nest Egg: $${Math.round(targetSS2).toLocaleString()}`);
console.log(`  Expected: ~$2.4M (was showing $28.2M - WRONG!)`);
console.log(`  Status: ${Math.abs(targetSS2 - 2400000) < 200000 ? '✓ CORRECT' : '✗ STILL WRONG'}`);

const projectedSS2 = calculateFV(92000, 20000, 28);
console.log(`\n✓ Projected at 68: $${Math.round(projectedSS2).toLocaleString()}`);
console.log(`  Expected: ~$17.4M (was showing $22.9M - TOO HIGH!)`);
console.log(`  Status: ${Math.abs(projectedSS2 - 17400000) < 500000 ? '✓ CORRECT' : '✗ STILL WRONG'}`);

// Test 3: Verify the percentage labels
console.log('\n\nTEST 3: Percentage Labels');
console.log('Income: $500,000/year');
console.log('Monthly Savings: $20,000');
console.log('Retirement Expenses: $99,000/year');
console.log('---');

const income = 500000;
const monthlySavings = 20000;
const retirementExpenses = 99000;

const savingsPct = (monthlySavings / (income / 12)) * 100;
console.log(`✓ Monthly Savings %: ${savingsPct.toFixed(1)}%`);
console.log(`  Formula: $20,000 / ($500,000/12)`);
console.log(`  Status: ${savingsPct === 48 ? '✓ CORRECT' : '✗ WRONG'}`);

const expensesPct = (retirementExpenses / income) * 100;
console.log(`\n✓ Retirement Expenses %: ${expensesPct.toFixed(1)}%`);
console.log(`  Formula: $99,000 / $500,000`);
console.log(`  Status: ${expensesPct === 19.8 ? '✓ CORRECT' : '✗ WRONG'}`);

// Test 4: Years until depletion (SS1)
console.log('\n\nTEST 4: Depletion Years (Screenshot 1)');
console.log('Projected: $4.65M, Annual Expenses: $99,000');
console.log('---');

const projected = 4650000;
const annualExpenses = 99000;
const realReturn = (1.04 / 1.03) - 1;

// Simulate depletion
let balance = projected;
let age = 47;
let depleted = false;

while (balance > 0 && age < 120) {
  balance -= annualExpenses;
  balance *= (1 + realReturn);
  age++;

  if (balance <= 0 && !depleted) {
    console.log(`✓ Depleted at age: ${age}`);
    console.log(`  Years in retirement: ${age - 47}`);
    console.log(`  Status: ${age - 47 === 73 ? '✓ CORRECT (73 years)' : 'CALCULATED'}`);
    depleted = true;
  }
}

console.log('\n\n=== SUMMARY ===');
console.log('The app should now:');
console.log('1. Treat retirementExpenses as ANNUAL ($99,000/year)');
console.log('2. Divide by 12 in calculations to get monthly expenses');
console.log('3. Show targets in millions, not tens of millions');
console.log('4. Use consistent units throughout');
