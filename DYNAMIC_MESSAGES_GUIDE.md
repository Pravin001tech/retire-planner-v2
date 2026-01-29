# Dynamic Personalized Messages Implementation

## Overview

This implementation replaces hardcoded advisor messages with **dynamic, calculated, personalized messages** that show specific numbers and actionable advice.

## What Changed

### Before (Hardcoded)
```javascript
if (ratio > 1.15) return "You might even consider retiring earlier!";
if (ratio >= 0.95) return "You are on track.";
if (ratio >= 0.75) return "You may run short. Increase savings now.";
```

### After (Dynamic & Personalized)
```
You're 20% below your retirement target

You need $720K at retirement, but you're projected to have only $580K.

1. Save an extra $525/month
   ✓ Gets you to target by age 62

2. Or retire 6 years later at age 68
   More time for compound growth
```

## Files Created

### 1. `src/utils/retirementCalculations.js`
Pure math functions for calculating specific advice:
- `calculateAdditionalSavingsNeeded()` - How much more to save monthly
- `calculateRunOutAge()` - When money runs out
- `calculateDelayNeeded()` - Years to delay retirement
- `calculateExpenseReduction()` - How much to cut expenses
- `calculateEarlyRetirement()` - How many years early possible
- `calculateProjectedSavings()` - Future savings projection
- `calculateNeededSavings()` - Required nest egg

### 2. `src/utils/messageTemplates.js`
Dynamic message templates that:
- Select appropriate message based on severity (severe/moderate/minor/onTrack/ahead)
- Calculate specific numbers for each situation
- Provide multiple actionable solutions
- Format messages for display

### 3. `src/utils/demo.js`
Examples showing all message types with sample data

## How It Works

```
User Input
    ↓
Calculate Projections
    ↓
Determine Severity (severe/moderate/minor/onTrack/ahead)
    ↓
Calculate Specific Solutions
    ├── Additional monthly savings needed
    ├── Delay retirement years
    ├── Expense reduction amount
    ├── Early retirement years possible
    └── Run-out age
    ↓
Generate Message with Specific Numbers
    ↓
Display in UI
```

## Message Types

### 1. **Severe Shortfall** (>50% below target)
- Shows age when money runs out
- 3 actionable solutions with specific amounts
- Clear warnings

### 2. **Moderate Shortfall** (20-50% below target)
- Shows percentage below target
- 2 solutions: increase savings or delay retirement

### 3. **Minor Shortfall** (0-20% below target)
- Encouraging tone
- Small adjustment needed

### 4. **On Track** (95-115% of target)
- Positive confirmation
- Shows cushion amount

### 5. **Ahead** (>115% of target)
- Early retirement options
- Alternative uses for surplus

## Usage Example

```javascript
import { generatePersonalizedAdvice } from './utils/messageTemplates';

// Prepare data
const userData = {
  currentAge: 30,
  retireAge: 62,
  currentSavings: 10000,
  monthlySavings: 500,
  retirementExpenses: 40000,
};

const projections = {
  projectedAtRetire: 650000,
  recommendedAtRetire: 750000,
};

// Generate message
const message = generatePersonalizedAdvice(userData, projections);

// Output:
// {
//   emoji: '⚠️',
//   title: "You're 13% below your retirement target",
//   body: "You need $750K at retirement...",
//   actions: [
//     { text: "Save an extra $280/month", impact: "Gets you to target" }
//   ]
// }
```

## Testing

Run the demo to see all message types:
```bash
cd C:\Users\ASUS\retire-planner
node src/utils/demo.js
```

## Customization

### Adjust Return Rates
Edit `src/utils/retirementCalculations.js` default parameters:
```javascript
returnRate = 0.06  // Pre-retirement return
returnRate = 0.04  // Post-retirement return
inflationRate = 0.03  // Inflation
```

### Adjust Severity Thresholds
Edit `src/utils/messageTemplates.js`:
```javascript
if (percentShort > 50) severity = 'severe';
else if (percentShort > 20) severity = 'moderate';
else severity = 'minor';
```

### Customize Messages
Edit the message templates in `src/utils/messageTemplates.js`:
```javascript
severe: (data) => ({
  title: `Custom title with ${data.runOutAge}`,
  body: `Custom message...`,
  actions: [...]
})
```

## Benefits

✅ **Specific Numbers**: Every message shows exact calculated amounts
✅ **Actionable**: Multiple solutions with clear impact statements
✅ **No AI**: Pure math and templates - 100% deterministic
✅ **Personalized**: Each message unique to user's situation
✅ **Dynamic**: Updates instantly as user changes inputs
✅ **Maintainable**: Centralized calculation functions
✅ **Testable**: Pure functions easy to unit test

## Future Enhancements

- Add more detailed breakdowns
- Include inflation-adjusted projections
- Add Social Security integration
- Export to PDF report
- Save/load user scenarios
- Historical performance comparison
