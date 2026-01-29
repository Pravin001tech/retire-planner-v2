import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Info, ChevronRight } from 'lucide-react';
import { generatePersonalizedAdvice, formatMessageForDisplay } from './utils/messageTemplates';

// --- UTILITIES ---
const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '$0';
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val}`;
};

const formatCurrencyFull = (val) => {
  if (isNaN(val)) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

// --- SIMULATION ENGINE ---
const calculateProjections = (currentAge, currentSavings, retireAge, income, monthlySavings, retirementExpenses) => {
  try {
    const data = [];
    const endAge = 95;
    const annualReturn = 0.06;
    const annualReturnRetired = 0.04;
    const inflationRate = 0.03;

    // Monthly rates for proper compounding
    const monthlyRate = annualReturn / 12;
    const monthlyRateRetired = annualReturnRetired / 12;
    const monthlyInflation = inflationRate / 12;

    // Real return during retirement (inflation-adjusted)
    const realAnnualReturn = (1 + annualReturnRetired) / (1 + inflationRate) - 1;
    const realMonthlyRate = realAnnualReturn / 12;

    let safeRetireAge = Math.min(retireAge, endAge - 1);
    const yearsInRetirement = endAge - safeRetireAge;
    const monthsInRetirement = yearsInRetirement * 12;

    // Convert annual retirement expenses to monthly
    const monthlyRetirementExpenses = retirementExpenses / 12;

    // Calculate target nest egg using present value of annuity
    // PV = PMT × [(1 - (1 + r)^-n) / r]
    let targetNestEgg = 0;
    if (realMonthlyRate !== 0) {
      targetNestEgg = monthlyRetirementExpenses * ((1 - Math.pow(1 + realMonthlyRate, -monthsInRetirement)) / realMonthlyRate);
    } else {
      targetNestEgg = monthlyRetirementExpenses * monthsInRetirement;
    }

    // Initialize projected balance
    let projectedBalance = currentSavings;

    // Simulate month by month for accuracy
    for (let age = currentAge; age <= endAge; age++) {
      const isRetired = age >= safeRetireAge;

      // Process 12 months for each year
      for (let month = 0; month < 12; month++) {
        if (!isRetired) {
          // Pre-retirement: add monthly contribution, then apply growth
          projectedBalance += monthlySavings;
          projectedBalance *= (1 + monthlyRate);
        } else {
          // Post-retirement: subtract expenses, apply real return
          projectedBalance -= monthlyRetirementExpenses;
          projectedBalance *= (1 + realMonthlyRate);
        }

        // Prevent negative balance
        if (projectedBalance < 0) projectedBalance = 0;
      }

      const displayProjected = Math.round(projectedBalance);

      // Calculate recommended balance trajectory
      let recommendedBalance = 0;
      if (!isRetired) {
        const totalWorkingYears = safeRetireAge - currentAge;
        const yearsWorked = age - currentAge;

        if (totalWorkingYears > 0) {
          const progress = yearsWorked / totalWorkingYears;
          const base = 1.065;
          const numerator = Math.pow(base, yearsWorked) - 1;
          const denominator = Math.pow(base, totalWorkingYears) - 1;

          if (denominator === 0 || isNaN(denominator)) {
            recommendedBalance = currentSavings + (targetNestEgg - currentSavings) * progress;
          } else {
            recommendedBalance = currentSavings + (targetNestEgg - currentSavings) * (numerator / denominator);
          }
        } else {
          recommendedBalance = currentSavings;
        }
      } else {
        const yearsLeft = endAge - age;
        const totalRetirementYears = endAge - safeRetireAge;
        const progress = totalRetirementYears > 0 ? yearsLeft / totalRetirementYears : 0;
        recommendedBalance = targetNestEgg * progress;
      }

      if (isNaN(recommendedBalance)) recommendedBalance = 0;

      data.push({
        age,
        projected: displayProjected,
        recommended: Math.round(recommendedBalance),
        isRetired
      });
    }

    return { data, targetNestEgg };
  } catch (error) {
    console.error('Error in calculateProjections:', error);
    return { data: [], targetNestEgg: 0 };
  }
};

// --- UI COMPONENTS ---

const SliderInput = ({ label, value, min, max, step, onChange, prefix = "", suffix = "", subLabel = null }) => {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-3 group">
      <div className="flex justify-between items-center mb-1">
        <label className="font-bold text-gray-800 text-[11px] flex items-center cursor-help select-none">
          {label}
          <Info className="w-3 h-3 ml-1 text-gray-400 hover:text-orange-500 transition-colors" />
        </label>
      </div>

      <div className="relative">
        <input
          type="text"
          value={`${prefix}${Number(value).toLocaleString()}${suffix}`}
          readOnly
          className="w-full bg-white border border-gray-300 rounded-md py-1.5 px-2 text-gray-800 font-bold text-[12px] shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all cursor-default"
        />
      </div>

      <div className="relative w-full h-5 mt-1 flex items-center">
        <div className="absolute w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-full bg-orange-200 transition-all duration-75 ease-out"
                style={{ width: `${percent}%` }}
            />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
            className="absolute h-3 w-3 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full shadow-md border border-white pointer-events-none transition-all duration-75 ease-out"
            style={{ left: `calc(${percent}% - 6px)` }}
        />
      </div>

      {subLabel && (
        <div className="text-right text-[10px] text-gray-500 mt-0.5 font-semibold tracking-wide">{subLabel}</div>
      )}
    </div>
  );
};

const MetricCard = ({ title, value, colorClass, subText = null }) => (
  <div className={`p-2.5 rounded-lg shadow-sm border-l-[4px] mb-2.5 ${colorClass} bg-white transition-all hover:shadow-md duration-300`}>
    <h3 className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">{title}</h3>
    <div className="text-sm font-black text-slate-800 tracking-tight">{value}</div>
    {subText && <div className="text-[10px] font-medium text-slate-400 mt-0.5">{subText}</div>}
  </div>
);

// --- CUSTOM CHART ---
const CustomChart = ({ data, retireAge }) => {
    const containerRef = useRef(null);
    const [dims, setDims] = useState({ w: 0, h: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect) {
                    setDims({
                        w: entry.contentRect.width,
                        h: entry.contentRect.height
                    });
                }
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    if (dims.w === 0 || !data || data.length === 0) return <div ref={containerRef} className="h-full w-full" />;

    const padding = { top: 25, right: 15, bottom: 40, left: 60 };
    const chartW = dims.w - padding.left - padding.right;
    const chartH = dims.h - padding.top - padding.bottom;

    // Generate better Y-axis ticks
    const rawMax = Math.max(...data.map(d => Math.max(d.projected, d.recommended)));
    const maxVal = (rawMax || 100000) * 1.1;

    // Create nice round numbers for Y-axis (e.g., 200K, 400K, 600K)
    const niceMax = Math.ceil(maxVal / 100000) * 100000;
    const yTickCount = 5;
    const yTicks = Array.from({ length: yTickCount }, (_, i) => (niceMax / (yTickCount - 1)) * i);

    const minAge = data[0].age;
    const maxAge = data[data.length - 1].age;
    const ageRange = maxAge - minAge || 1;

    const getX = (age) => (age - minAge) / ageRange * chartW;
    const getY = (val) => {
        const safeVal = isNaN(val) ? 0 : val;
        return chartH - (safeVal / niceMax * chartH);
    };

    const createPath = (key) => {
        let d = `M 0 ${chartH} `;
        d += `L ${getX(data[0].age)} ${getY(data[0][key])} `;
        data.forEach(p => {
            d += `L ${getX(p.age)} ${getY(p[key])} `;
        });
        const fillD = d + `L ${chartW} ${chartH} Z`;

        let lineD = `M ${getX(data[0].age)} ${getY(data[0][key])} `;
        data.forEach(p => {
            lineD += `L ${getX(p.age)} ${getY(p[key])} `;
        });
        return { fill: fillD, line: lineD };
    };

    const projectedPaths = createPath('projected');
    const recommendedPaths = createPath('recommended');
    const retireX = getX(retireAge);

    const xTicks = data.filter(d => d.age % 5 === 0);

    return (
        <div ref={containerRef} className="h-full w-full relative select-none">
            <svg width={dims.w} height={dims.h} className="overflow-visible">
                <defs>
                    <linearGradient id="gradProjected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="gradRecommended" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4338ca" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#4338ca" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                <g transform={`translate(${padding.left}, ${padding.top})`}>
                    {/* Y-axis grid and labels */}
                    {yTicks.map((tick, i) => (
                        <g key={i}>
                            <line x1="0" y1={getY(tick)} x2={chartW} y2={getY(tick)} stroke="#cbd5e1" strokeWidth="1" strokeDasharray={i === 0 ? "" : "3 3"} />
                            <text x="-12" y={getY(tick) + 3} textAnchor="end" fontSize="11" fill="#475569" fontWeight="600">
                                {formatCurrency(tick)}
                            </text>
                        </g>
                    ))}

                    {/* X-axis labels */}
                    {xTicks.map((tick, i) => (
                        <g key={i}>
                            <text x={getX(tick.age)} y={chartH + 24} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
                                {tick.age}
                            </text>
                        </g>
                    ))}

                    {/* Retirement marker */}
                    {retireAge > minAge && retireAge < maxAge && (
                        <g>
                            <line x1={retireX} y1="-8" x2={retireX} y2={chartH} stroke="#0f766e" strokeWidth="2" strokeDasharray="5 4" opacity="0.8" />
                            <text x={retireX + 6} y="0" fill="#0f766e" fontSize="11" fontWeight="bold">Retire</text>
                        </g>
                    )}

                    {/* Data paths */}
                    <path d={recommendedPaths.fill} fill="url(#gradRecommended)" className="transition-all duration-300" />
                    <path d={recommendedPaths.line} fill="none" stroke="#3730a3" strokeWidth="2.5" className="transition-all duration-300" strokeLinecap="round" />

                    <path d={projectedPaths.fill} fill="url(#gradProjected)" className="transition-all duration-300" />
                    <path d={projectedPaths.line} fill="none" stroke="#059669" strokeWidth="2.5" className="transition-all duration-300" strokeLinecap="round" />

                    {/* Data points */}
                    {data.filter(d => d.age % 3 === 0).map((d, i) => (
                        <g key={`p-${i}`}>
                             <circle cx={getX(d.age)} cy={getY(d.recommended)} r="3" fill="#3730a3" stroke="white" strokeWidth="1" />
                             <circle cx={getX(d.age)} cy={getY(d.projected)} r="3" fill="#059669" stroke="white" strokeWidth="1" />
                        </g>
                    ))}
                </g>
            </svg>

            {/* Enhanced Legend */}
            <div className="absolute -top-16 right-2 flex flex-row gap-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <div className="w-3 h-3 bg-[#059669] rounded-md shadow-sm"></div>
                    <span>Projected</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <div className="w-3 h-3 bg-[#3730a3] rounded-md shadow-sm"></div>
                    <span>Recommended</span>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APPLICATION ---
export default function App() {
  const [age, setAge] = useState(45);
  const [currentSavings, setCurrentSavings] = useState(173000);
  const [retireAge, setRetireAge] = useState(62);
  const [income, setIncome] = useState(213000);
  const [monthlySavings, setMonthlySavings] = useState(1420);
  const [retirementExpenses, setRetirementExpenses] = useState(40000);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (retireAge <= age) {
        setRetireAge(age + 1);
    }
  }, [age]);

  const { data, targetNestEgg } = useMemo(() => {
    try {
      return calculateProjections(age, currentSavings, retireAge, income, monthlySavings, retirementExpenses);
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err.message);
      return { data: [], targetNestEgg: 0 };
    }
  }, [age, currentSavings, retireAge, income, monthlySavings, retirementExpenses]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
          <button onClick={() => setError(null)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const projectedAtRetire = data.find(d => d.age === retireAge)?.projected || 0;
  const recommendedAtRetire = targetNestEgg;
  const ratio = recommendedAtRetire > 0 ? projectedAtRetire / recommendedAtRetire : 0;
  const isSafe = ratio >= 0.95;

  const getAvatarEmotion = () => {
    if (ratio > 1.15) return "😎";
    if (ratio >= 0.95) return "🙂";
    if (ratio >= 0.75) return "🤔";
    return "😨";
  };

  const getAdvisorMessage = () => {
    // Use dynamic personalized advice
    const userData = {
      currentAge: age,
      retireAge,
      currentSavings,
      monthlySavings,
      retirementExpenses,
    };

    const projections = {
      projectedAtRetire,
      recommendedAtRetire,
    };

    return generatePersonalizedAdvice(userData, projections);
  };

  // Helper to format currency for highlighting
  const highlightCurrency = (text) => {
    // Match currency patterns like $123K, $1.5M, $500
    return text.split(/(\$[0-9.KM]+)/g).map((part, i) =>
      part.startsWith('$') ? (
        <span key={i} className="font-bold text-orange-600 bg-orange-50 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const calculateMonthlyGoal = () => {
    try {
      const years = retireAge - age;
      if (years <= 0) return 0;
      const futureValueSavings = currentSavings * Math.pow(1.06, years);
      const shortfall = targetNestEgg - futureValueSavings;
      if (shortfall <= 0) return 0;
      const monthlyRate = 0.06 / 12;
      const months = years * 12;
      const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
      return shortfall / factor;
    } catch {
      return 0;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f3f4f6] font-sans text-slate-800 flex flex-row antialiased">

      {/* --- LEFT SIDEBAR: INPUTS --- */}
      <div className="w-[260px] bg-[#f8f7f5] border-r border-gray-200 flex flex-col h-full flex-shrink-0 z-20">
        <div className="p-3 pb-1.5 sticky top-0 bg-[#f8f7f5] z-10">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-200">
                P
             </div>
             <div>
                <h1 className="text-sm font-bold tracking-tight text-gray-900">RetirePlanner</h1>
                <p className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider">Financial Independence</p>
             </div>
          </div>
        </div>

        <div className="px-3 pb-4 space-y-0.5 overflow-y-auto">
            <SliderInput label="Age" value={age} min={18} max={80} step={1} onChange={setAge} />
            <SliderInput label="Current Savings" value={currentSavings} min={0} max={2000000} step={1000} onChange={setCurrentSavings} prefix="$" />
            <SliderInput label="Retire Age" value={retireAge} min={age + 1} max={85} step={1} onChange={setRetireAge} />
            <SliderInput label="Income" value={income} min={30000} max={500000} step={1000} onChange={setIncome} prefix="$" />
            <SliderInput label="Monthly Savings" value={monthlySavings} min={0} max={20000} step={50} onChange={setMonthlySavings} prefix="$" subLabel={`${Math.round((monthlySavings * 12 / income) * 100)}% of Income`} />
            <SliderInput label="Retirement Expenses" value={retirementExpenses} min={20000} max={200000} step={1000} onChange={setRetirementExpenses} prefix="$" subLabel={`${Math.round((retirementExpenses / income) * 100)}% of Income`} />
        </div>
      </div>

      {/* --- MIDDLE COLUMN: CHART & ADVISOR --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white min-w-0">

        <div className="flex-1 p-3 flex flex-col">
            <div className="flex justify-between items-end mb-2 shrink-0">
               <div>
                 <h2 className="text-lg font-bold text-slate-800 tracking-tight">Your Trajectory</h2>
                 <p className="text-slate-400 font-medium text-xs">Real-time simulation based on current inputs.</p>
               </div>
            </div>

            {/* CHART CONTAINER */}
            <div className="flex-1 min-h-[220px] bg-white border border-slate-100 rounded-xl shadow-sm relative p-2.5 mb-2">
                <CustomChart data={data} retireAge={retireAge} />
            </div>

            {/* ADVISOR INTERFACE */}
            <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-0 flex flex-row shadow-sm overflow-hidden shrink-0">
                <div className="p-3 flex flex-row gap-3 w-full items-center">

                    <div className="relative shrink-0">
                         <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-full flex items-center justify-center text-2xl shadow-inner border-[2px] border-white ring-1 ring-black/5">
                            <span className="transform transition-transform duration-300 hover:scale-110 cursor-help" role="img" aria-label="advisor emotion">
                                {getAvatarEmotion()}
                            </span>
                         </div>
                         <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                            Mr. Munny
                         </div>
                    </div>

                    <div className="flex-1 w-full min-w-0">
                         <div className="bg-white p-2 rounded-xl rounded-tl-none shadow-sm border border-orange-100/50 mb-2 relative">
                             <div className="absolute top-0 -left-1.5 w-3 h-3 bg-white transform rotate-45 border-l border-b border-orange-100/50"></div>

                             <div className="text-slate-700 text-xs leading-relaxed relative z-10">
                                 {(() => {
                                   const msg = getAdvisorMessage();
                                   return (
                                     <div>
                                       <p className="mb-1">{highlightCurrency(msg.body)}</p>
                                       {msg.actions && msg.actions.length > 0 && (
                                         <div className="mt-2 space-y-1">
                                           {msg.actions.map((action, i) => (
                                             <div key={i} className="text-[10px] bg-orange-50 p-1.5 rounded border border-orange-100">
                                               <div className="font-semibold text-slate-800">{highlightCurrency(action.text)}</div>
                                               <div className="text-slate-500 mt-0.5">{action.impact}</div>
                                             </div>
                                           ))}
                                         </div>
                                       )}
                                       {msg.bonus && (
                                         <div className="mt-2 text-[10px] bg-emerald-50 p-1.5 rounded border border-emerald-100 text-emerald-700">
                                           💡 {highlightCurrency(msg.bonus)}
                                         </div>
                                       )}
                                       {msg.options && msg.options.length > 0 && (
                                         <div className="mt-2 space-y-1">
                                           {msg.options.map((option, i) => (
                                             <div key={i} className="text-[10px] flex items-start gap-1">
                                               <span className="text-emerald-500">•</span>
                                               <span>{highlightCurrency(option)}</span>
                                             </div>
                                           ))}
                                         </div>
                                       )}
                                     </div>
                                   );
                                 })()}
                             </div>
                         </div>

                         <div className="relative flex items-center">
                             <input
                                type="text"
                                placeholder="Ask a question..."
                                className="w-full bg-white/50 border border-slate-200 rounded-full py-1.5 pl-3 pr-8 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-slate-400"
                             />
                             <button className="absolute right-1 p-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-transform hover:scale-105 shadow-sm">
                                <ChevronRight size={12} strokeWidth={3} />
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: STATS PANEL --- */}
      <div className="w-[240px] bg-slate-50 border-l border-gray-200 p-3 overflow-y-auto flex-shrink-0">
             <div className="flex items-center gap-2 mb-4">
                <div className="h-0.5 flex-1 bg-gray-200 rounded-full"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Analysis</span>
                <div className="h-0.5 flex-1 bg-gray-200 rounded-full"></div>
             </div>

             <MetricCard
                title="Recommended Savings"
                value={formatCurrencyFull(calculateMonthlyGoal())}
                subText="Monthly goal"
                colorClass="border-indigo-600 text-indigo-900"
             />

             <MetricCard
                title="Retirement Target"
                value={formatCurrencyFull(recommendedAtRetire)}
                subText={`Minimum at age ${retireAge}`}
                colorClass="border-purple-600 text-purple-900"
             />

             <MetricCard
                title="Projected Result"
                value={formatCurrencyFull(projectedAtRetire)}
                subText="At retirement age"
                colorClass={`border-emerald-500 ${isSafe ? 'text-emerald-900' : 'text-red-800'}`}
             />

             <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="font-bold text-slate-800 mb-2 text-[10px] uppercase tracking-wide">Model Assumptions</h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Pre-Retire Return</span>
                        <span className="font-mono font-bold text-slate-700">6.0%</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Post-Retire Return</span>
                        <span className="font-mono font-bold text-slate-700">4.0%</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Inflation</span>
                        <span className="font-mono font-bold text-slate-700">3.0%</span>
                    </div>
                </div>
             </div>
      </div>
    </div>
  );
}
