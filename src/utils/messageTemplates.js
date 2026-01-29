/**
 * Dynamic Message Templates for Retirement Advisor
 * Generates personalized messages with specific calculated numbers
 */

import {
  calculateAdditionalSavingsNeeded,
  calculateRunOutAge,
  calculateDelayNeeded,
  calculateExpenseReduction,
  calculateEarlyRetirement,
} from './retirementCalculations';

/**
 * Format number with appropriate currency formatting
 */
const formatNumber = (num) => {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${Math.round(num / 1000)}K`;
  return `$${Math.round(num)}`;
};

/**
 * Dynamic message templates based on financial situation
 */
export const MessageTemplates = {
  /**
   * Warning messages for when user is falling short
   */
  warning: {
    /**
     * Severe shortfall (more than 50% below target)
     */
    severe: (data) => ({
      emoji: '🚨',
      title: `Critical: You may run out of money at age ${data.runOutAge}`,
      body: `Your current plan leaves you ${formatNumber(data.shortfall)} short over your retirement. You'll deplete savings ${data.yearsShort} years into retirement.`,
      actions: [
        {
          type: 'increase_savings',
          text: `Increase savings to ${formatNumber(data.neededMonthlySavings)}/month`,
          impact: `✅ Fixes the ${formatNumber(data.shortfall)} shortfall`,
        },
        {
          type: 'delay_retirement',
          text: `Retire at ${data.delayToAge} instead of ${data.currentRetireAge}`,
          impact: `Gives ${data.additionalYears} more years to save`,
        },
        {
          type: 'reduce_expenses',
          text: `Reduce retirement budget by ${formatNumber(data.expenseReduction)}/month`,
          impact: `Makes current savings sufficient`,
        },
      ],
    }),

    /**
     * Moderate shortfall (20-50% below target)
     */
    moderate: (data) => ({
      emoji: '⚠️',
      title: `You're ${data.percentShort}% below your retirement target`,
      body: `You need ${formatNumber(data.targetSavings)} at retirement, but you're projected to have only ${formatNumber(data.projectedSavings)}.`,
      actions: [
        {
          type: 'increase_savings',
          text: `Save an extra ${formatNumber(data.additionalNeeded)}/month`,
          impact: `Gets you to target by age ${data.retireAge}`,
        },
        {
          type: 'delay_retirement',
          text: `Or retire ${data.delayYears} years later at age ${data.delayToAge}`,
          impact: 'More time for compound growth',
        },
      ],
    }),

    /**
     * Minor shortfall (0-20% below target)
     */
    minor: (data) => ({
      emoji: '⚡',
      title: `Almost there! Just ${formatNumber(data.shortfall)} short`,
      body: `You're ${data.percentToTarget}% of the way to your retirement goal.`,
      actions: [
        {
          type: 'small_adjustment',
          text: `A small ${data.percentIncrease}% increase in savings gets you there`,
          impact: `Only ${formatNumber(data.smallIncrease)}/month more`,
        },
      ],
    }),
  },

  /**
   * Success messages for when user is on track or ahead
   */
  success: {
    /**
     * On track (95-115% of target)
     */
    onTrack: (data) => ({
      emoji: '✅',
      title: `You're on track to retire at ${data.retireAge}!`,
      body: `Your projected savings of ${formatNumber(data.projectedSavings)} meets your target of ${formatNumber(data.targetSavings)}.`,
      bonus: `You have a ${formatNumber(data.cushion)} cushion for unexpected expenses.`,
    }),

    /**
     * Ahead of schedule (more than 115% of target)
     */
    ahead: (data) => ({
      emoji: '🎉',
      title: `Great news! You could retire ${data.yearsEarly} years early`,
      body: `You're projected to have ${formatNumber(data.surplus)} more than needed.`,
      options: [
        `Retire at ${data.earlyAge} instead of ${data.plannedAge}`,
        `Keep retiring at ${data.plannedAge} but increase spending by ${formatNumber(data.extraMonthly)}/month`,
        `Build a larger safety cushion for healthcare or family support`,
      ],
    }),
  },
};

/**
 * Main function to generate personalized advice
 *
 * @param {Object} userData - User's financial data
 * @param {Object} projections - Calculated projections
 * @returns {Object} Personalized message object
 */
export function generatePersonalizedAdvice(userData, projections) {
  const {
    currentAge,
    retireAge,
    currentSavings,
    monthlySavings,
    retirementExpenses,
  } = userData;

  const { projectedAtRetire, recommendedAtRetire } = projections;

  // Calculate key metrics
  const yearsToRetirement = retireAge - currentAge;
  const retirementYears = 95 - retireAge; // Assume live to 95

  // Calculate shortfall or surplus
  const shortfall = recommendedAtRetire - projectedAtRetire;
  const surplus = projectedAtRetire - recommendedAtRetire;

  // Determine severity level
  const percentShort = recommendedAtRetire > 0 ? (shortfall / recommendedAtRetire) * 100 : 0;
  const percentSurplus = recommendedAtRetire > 0 ? (surplus / recommendedAtRetire) * 100 : 0;

  let severity;
  if (shortfall > 0) {
    if (percentShort > 50) severity = 'severe';
    else if (percentShort > 20) severity = 'moderate';
    else severity = 'minor';
  } else {
    severity = percentSurplus > 15 ? 'ahead' : 'onTrack';
  }

  // Calculate specific solutions
  // Note: retirementExpenses is annual, need to convert to monthly for these functions
  const monthlyRetirementExpenses = retirementExpenses / 12;

  const additionalSavings = calculateAdditionalSavingsNeeded(
    shortfall,
    yearsToRetirement
  );
  const delayYears = calculateDelayNeeded(shortfall, monthlySavings);
  const expenseReduction = calculateExpenseReduction(shortfall, retirementYears);
  const runOutAge = calculateRunOutAge(
    projectedAtRetire,
    retireAge,
    monthlyRetirementExpenses
  );
  const yearsEarlyPossible = calculateEarlyRetirement(
    surplus,
    monthlyRetirementExpenses
  );

  // Build message data
  const messageData = {
    // Basic info
    shortfall: Math.abs(shortfall),
    surplus: Math.abs(surplus),
    projectedSavings: projectedAtRetire,
    targetSavings: recommendedAtRetire,
    percentShort: Math.round(percentShort),
    percentToTarget: Math.round(100 - percentShort),
    retireAge,
    currentRetireAge: retireAge,

    // Solution calculations
    neededMonthlySavings: monthlySavings + additionalSavings,
    additionalNeeded: additionalSavings,
    additionalYears: delayYears,
    delayToAge: retireAge + delayYears,
    delayYears,
    expenseReduction,
    runOutAge,
    yearsShort: Math.max(0, runOutAge - retireAge),
    percentIncrease: monthlySavings > 0 ? Math.round((additionalSavings / monthlySavings) * 100) : 0,
    smallIncrease: additionalSavings,

    // Early retirement calculations
    yearsEarly: yearsEarlyPossible,
    earlyAge: retireAge - yearsEarlyPossible,
    plannedAge: retireAge,
    extraMonthly: Math.round(
      (retirementExpenses * yearsEarlyPossible) / retirementYears / 12
    ),
    cushion: surplus,
  };

  // Select and populate the right template
  if (shortfall > 0) {
    return MessageTemplates.warning[severity](messageData);
  } else {
    return MessageTemplates.success[severity](messageData);
  }
}

/**
 * Format message for display in UI
 * Converts message object to display-friendly components
 */
export function formatMessageForDisplay(message) {
  // Return the message object - we'll format it in the React component
  return message;
}
