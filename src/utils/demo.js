/**
 * Dynamic Message System Demo
 * Shows examples of personalized messages with specific calculated numbers
 */

import { generatePersonalizedAdvice } from './messageTemplates';

// Example 1: SEVERE SHORTFALL
// User: 30 years old, $10K savings, retiring at 62, saving $500/month, spending $40K/year in retirement
const example1 = {
  userData: {
    currentAge: 30,
    retireAge: 62,
    currentSavings: 10000,
    monthlySavings: 500,
    retirementExpenses: 40000,
  },
  projections: {
    projectedAtRetire: 650000, // ~$650K projected
    recommendedAtRetire: 750000, // ~$750K needed
  },
};

console.log('=== EXAMPLE 1: SEVERE SHORTFALL ===');
console.log('Current: $10K, saving $500/mo, retiring at 62');
console.log('Result: $650K projected vs $750K needed ($100K short)');
const msg1 = generatePersonalizedAdvice(example1.userData, example1.projections);
console.log(`\n${msg1.emoji} ${msg1.title}`);
console.log(`\n${msg1.body}`);
msg1.actions.forEach((action, i) => {
  console.log(`\n${i + 1}. ${action.text}`);
  console.log(`   ${action.impact}`);
});

// Example 2: MODERATE SHORTFALL
// User: 40 years old, $150K savings, retiring at 62, saving $800/month, spending $50K/year in retirement
const example2 = {
  userData: {
    currentAge: 40,
    retireAge: 62,
    currentSavings: 150000,
    monthlySavings: 800,
    retirementExpenses: 50000,
  },
  projections: {
    projectedAtRetire: 580000,
    recommendedAtRetire: 720000,
  },
};

console.log('\n\n=== EXAMPLE 2: MODERATE SHORTFALL ===');
console.log('Current: $150K, saving $800/mo, retiring at 62');
console.log('Result: $580K projected vs $720K needed ($140K short)');
const msg2 = generatePersonalizedAdvice(example2.userData, example2.projections);
console.log(`\n${msg2.emoji} ${msg2.title}`);
console.log(`\n${msg2.body}`);
msg2.actions.forEach((action, i) => {
  console.log(`\n${i + 1}. ${action.text}`);
  console.log(`   ${action.impact}`);
});

// Example 3: ON TRACK
// User: 45 years old, $350K savings, retiring at 65, saving $1,500/month, spending $60K/year in retirement
const example3 = {
  userData: {
    currentAge: 45,
    retireAge: 65,
    currentSavings: 350000,
    monthlySavings: 1500,
    retirementExpenses: 60000,
  },
  projections: {
    projectedAtRetire: 950000,
    recommendedAtRetire: 900000,
  },
};

console.log('\n\n=== EXAMPLE 3: ON TRACK ===');
console.log('Current: $350K, saving $1,500/mo, retiring at 65');
console.log('Result: $950K projected vs $900K needed ($50K surplus)');
const msg3 = generatePersonalizedAdvice(example3.userData, example3.projections);
console.log(`\n${msg3.emoji} ${msg3.title}`);
console.log(`\n${msg3.body}`);
console.log(`\n💡 ${msg3.bonus}`);

// Example 4: AHEAD - Early Retirement Possible
// User: 40 years old, $500K savings, retiring at 60, saving $3,000/month, spending $50K/year in retirement
const example4 = {
  userData: {
    currentAge: 40,
    retireAge: 60,
    currentSavings: 500000,
    monthlySavings: 3000,
    retirementExpenses: 50000,
  },
  projections: {
    projectedAtRetire: 1500000,
    recommendedAtRetire: 850000,
  },
};

console.log('\n\n=== EXAMPLE 4: AHEAD OF SCHEDULE ===');
console.log('Current: $500K, saving $3,000/mo, retiring at 60');
console.log('Result: $1.5M projected vs $850K needed ($650K surplus!)');
const msg4 = generatePersonalizedAdvice(example4.userData, example4.projections);
console.log(`\n${msg4.emoji} ${msg4.title}`);
console.log(`\n${msg4.body}`);
console.log('\nYour options:');
msg4.options.forEach((option) => {
  console.log(`• ${option}`);
});

// Example 5: MINOR SHORTFALL (Close to goal)
// User: 50 years old, $400K savings, retiring at 62, saving $1,200/month, spending $55K/year in retirement
const example5 = {
  userData: {
    currentAge: 50,
    retireAge: 62,
    currentSavings: 400000,
    monthlySavings: 1200,
    retirementExpenses: 55000,
  },
  projections: {
    projectedAtRetire: 710000,
    recommendedAtRetire: 750000,
  },
};

console.log('\n\n=== EXAMPLE 5: MINOR SHORTFALL ===');
console.log('Current: $400K, saving $1,200/mo, retiring at 62');
console.log('Result: $710K projected vs $750K needed ($40K short)');
const msg5 = generatePersonalizedAdvice(example5.userData, example5.projections);
console.log(`\n${msg5.emoji} ${msg5.title}`);
console.log(`\n${msg5.body}`);
msg5.actions.forEach((action, i) => {
  console.log(`\n${i + 1}. ${action.text}`);
  console.log(`   ${action.impact}`);
});

console.log('\n\n=== SUMMARY ===');
console.log('Each message is dynamically generated with:');
console.log('✅ Specific calculated numbers (not generic text)');
console.log('✅ Multiple actionable solutions with impact statements');
console.log('✅ Deterministic output (no AI - pure math)');
console.log('✅ Personalized to user exact situation');
