/**
 * Test file to verify retirement calculations
 * Run with: node test-calculations.js
 */

console.log('=== RETIREMENT CALCULATOR VERIFICATION TESTS ===\n');

// Test 1: Simple scenario from verification report
console.log('TEST 1: Screenshot 3 scenario');
console.log('Age: 20, Retire: 55, Monthly: $10,050, Expenses: $40K/year');
console.log('---');

// Manual calculation
const monthlyRate = 0.06 / 12;
const months = 35 * 12;
const projectedManual = 10050 * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

console.log(`✓ Projected Savings (Manual): $${Math.round(projectedManual).toLocaleString()}`);
console.log(`  Expected: ~$14,318,339`);

// Future Value of Annuity Formula: FV = PMT × [((1 + r)^n - 1) / r]
// PMT = $10,050
// r = 0.005 (0.06/12)
// n = 420 (35 years × 12)
// FV = 10,050 × [((1.005)^420 - 1) / 0.005]

const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
console.log(`\n✓ Factor: ${factor.toFixed(2)}`);
console.log(`  [((1.005)^420 - 1) / 0.005]`);

console.log(`\n✓ Projected: $${Math.round(10050 * factor).toLocaleString()}`);

// Additional savings needed
const shortfall = 1587411;
const additionalManual = shortfall / factor;
console.log(`\n✓ Additional Monthly Needed: $${Math.round(additionalManual).toLocaleString()}`);
console.log(`  Expected: ~$1,114`);
console.log(`  Your old app showed: $277 (75% error!)`);

const percentIncrease = (additionalManual / 10050) * 100;
console.log(`\n✓ Percent Increase: ${percentIncrease.toFixed(1)}%`);
console.log(`  Your old app showed: 3% (WRONG!)`);

console.log('\n\n=== ALL TESTS COMPLETE ===');
