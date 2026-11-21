import React, { useMemo, useState } from 'react';
import { Clock, Sun, Sunrise, Sunset, Moon, Minus, Plus } from 'lucide-react';

export interface AvailabilityPreset {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  startMin: number;
  endMin: number;
  isAllDay?: boolean;
}

export const AVAILABILITY_PRESETS: AvailabilityPreset[] = [
  {
    id: 'all-day',
    title: 'All Day (24h)',
    subtitle: 'Flexible anytime',
    value: '24 Hours (All Day)',
    startMin: 0,
    endMin: 1440,
    isAllDay: true,
  },
  {
    id: 'business',
    title: 'Daytime',
    subtitle: '09:00 AM – 08:00 PM',
    value: '09:00 AM - 08:00 PM',
    startMin: 9 * 60,
    endMin: 20 * 60,
  },
  {
    id: 'morning',
    title: 'Morning',
    subtitle: '06:00 AM – 01:00 PM',
    value: '06:00 AM - 01:00 PM (Morning)',
    startMin: 6 * 60,
    endMin: 13 * 60,
  },
  {
    id: 'evening',
    title: 'Evening',
    subtitle: '04:00 PM – 10:00 PM',
    value: '04:00 PM - 10:00 PM (Evening)',
    startMin: 16 * 60,
    endMin: 22 * 60,
  },
];

function parseTimeToken(token: string): number | null {
  const match = token.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (h === 12) h = 0;
  if (period === 'PM') h += 12;
  return h * 60 + m;
}

function formatMinutes12h(totalMins: number): string {
  const norm = ((totalMins % 1440) + 1440) % 1440;
  const h24 = Math.floor(norm / 60);
  const m = norm % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}

function parseWindowValue(value: string): {
  startMin: number;
  endMin: number;
  isAllDay: boolean;
} {
  if (!value || /24\s*hours|all\s*day/i.test(value)) {
    return { startMin: 0, endMin: 1440, isAllDay: true };
  }
  const clean = value.replace(/\s*\([^)]*\)\s*/g, '').trim();
  const parts = clean.split(/\s*[-–]\s*/);
  if (parts.length === 2) {
    const s = parseTimeToken(parts[0]);
    const e = parseTimeToken(parts[1]);
    if (s !== null && e !== null) {
      return { startMin: s, endMin: e, isAllDay: false };
    }
  }
  return { startMin: 9 * 60, endMin: 20 * 60, isAllDay: false };
}

function describeArcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string {
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(startDeg));
  const y1 = cy + r * Math.sin(rad(startDeg));
  const x2 = cx + r * Math.cos(rad(endDeg));
  const y2 = cy + r * Math.sin(rad(endDeg));
  const sweep = ((endDeg - startDeg) % 360 + 360) % 360;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

interface AvailabilityClockPickerProps {
  value: string;
  onChange: (nextWindow: string) => void;
}

export const AvailabilityClockPicker: React.FC<AvailabilityClockPickerProps> = ({
  value,
  onChange,
}) => {
  const [activeHand, setActiveHand] = useState<'start' | 'end'>('start');
  const [showDialEditor, setShowDialEditor] = useState<boolean>(true);

  const parsed = useMemo(() => parseWindowValue(value), [value]);

  const activePreset = useMemo(
    () => AVAILABILITY_PRESETS.find((p) => p.value === value) || null,
    [value]
  );

  // Duration calculation
  const durationMinutes = useMemo(() => {
    if (parsed.isAllDay) return 1440;
    const diff = (parsed.endMin - parsed.startMin + 1440) % 1440;
    return diff === 0 ? 1440 : diff;
  }, [parsed]);

  const durationLabel = useMemo(() => {
    if (durationMinutes >= 1440) return '24h Full Day';
    const hrs = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hrs`;
  }, [durationMinutes]);

  const emitCustomRange = (nextStart: number, nextEnd: number) => {
    const sNorm = ((nextStart % 1440) + 1440) % 1440;
    const eNorm = ((nextEnd % 1440) + 1440) % 1440;
    const formatted = `${formatMinutes12h(sNorm)} - ${formatMinutes12h(eNorm)}`;
    // Match preset cleanly if user happens to dial an exact preset window
    const matched = AVAILABILITY_PRESETS.find(
      (p) => !p.isAllDay && p.startMin === sNorm && p.endMin === eNorm
    );
    onChange(matched ? matched.value : formatted);
  };

  const activeMin = activeHand === 'start' ? parsed.startMin : (parsed.endMin % 1440);
  const activeHour24 = Math.floor(activeMin / 60);
  const activeHour12 = activeHour24 % 12 === 0 ? 12 : activeHour24 % 12;
  const activeMinute = activeMin % 60;
  const activePeriod: 'AM' | 'PM' = activeHour24 >= 12 ? 'PM' : 'AM';

  const updateActiveTime = (hour12: number, minute: number, period: 'AM' | 'PM') => {
    let h24 = hour12 % 12;
    if (period === 'PM') h24 += 12;
    const nextMins = h24 * 60 + minute;
    if (activeHand === 'start') {
      const endTarget = parsed.isAllDay ? 20 * 60 : parsed.endMin;
      emitCustomRange(nextMins, endTarget);
    } else {
      const startTarget = parsed.isAllDay ? 9 * 60 : parsed.startMin;
      emitCustomRange(startTarget, nextMins);
    }
  };

  const stepHandMinutes = (hand: 'start' | 'end', delta: number) => {
    const baseStart = parsed.isAllDay ? 9 * 60 : parsed.startMin;
    const baseEnd = parsed.isAllDay ? 20 * 60 : parsed.endMin;
    if (hand === 'start') {
      emitCustomRange(baseStart + delta, baseEnd);
    } else {
      emitCustomRange(baseStart, baseEnd + delta);
    }
  };

  const setHandPeriod = (hand: 'start' | 'end', period: 'AM' | 'PM') => {
    const baseStart = parsed.isAllDay ? 9 * 60 : parsed.startMin;
    const baseEnd = parsed.isAllDay ? 20 * 60 : parsed.endMin;
    const target = hand === 'start' ? baseStart : baseEnd;
    const h = Math.floor(target / 60);
    const m = target % 60;
    const isCurrentlyPM = h >= 12;
    if ((period === 'PM' && isCurrentlyPM) || (period === 'AM' && !isCurrentlyPM)) {
      return;
    }
    const nextTarget = period === 'PM' ? (h + 12) * 60 + m : (h - 12) * 60 + m;
    if (hand === 'start') {
      emitCustomRange(nextTarget, baseEnd);
    } else {
      emitCustomRange(baseStart, nextTarget);
    }
  };

  // Angles on 24-hour outer arc (00:00 = top 0deg, 12:00 = bottom 180deg)
  const start24Deg = (parsed.startMin / 1440) * 360;
  const end24Deg = ((parsed.endMin % 1440) / 1440) * 360;
  const wrapsOvernight = !parsed.isAllDay && (parsed.endMin % 1440) < parsed.startMin;

  // Analog hand angle on 12-hour clickable clock face
  const activeHandDeg = ((activeHour12 % 12) + activeMinute / 60) * 30;
  const handRad = ((activeHandDeg - 90) * Math.PI) / 180;
  const handTipX = 90 + 46 * Math.cos(handRad);
  const handTipY = 90 + 46 * Math.sin(handRad);

  // Timeline bar segments (24h strip)
  const startPct = (parsed.startMin / 1440) * 100;
  const endPct = ((parsed.endMin === 1440 ? 1440 : parsed.endMin % 1440) / 1440) * 100;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4] space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-[#3B1E54] flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#3B1E54]" />
            <span>Availability Duration Clock</span>
          </h4>
          <p className="text-xs text-[#715F85] mt-0.5">
            Choose a daily preset or dial exact handover &amp; return hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold text-[#3B1E54] bg-white px-3 py-1.5 rounded-xl border border-[#D4BEE4] shadow-2xs tabular-nums"
            data-testid="availability-clock-readout"
          >
            {value}
          </span>
        </div>
      </div>

      {/* Quick Presets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {AVAILABILITY_PRESETS.map((preset) => {
          const isSelected = activePreset?.id === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#3B1E54] bg-[#3B1E54] text-white shadow-sm'
                  : 'border-[#D4BEE4] bg-white text-[#3B1E54] hover:border-[#9B7EBD] hover:bg-[#D4BEE4]/15'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold block">{preset.title}</span>
                {preset.id === 'all-day' && (
                  <Sun className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#D4BEE4]' : 'text-amber-500'}`} />
                )}
                {preset.id === 'business' && (
                  <Clock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#D4BEE4]' : 'text-[#9B7EBD]'}`} />
                )}
                {preset.id === 'morning' && (
                  <Sunrise className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#D4BEE4]' : 'text-orange-500'}`} />
                )}
                {preset.id === 'evening' && (
                  <Sunset className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#D4BEE4]' : 'text-indigo-500'}`} />
                )}
              </div>
              <span
                className={`text-[11px] block mt-0.5 tabular-nums ${
                  isSelected ? 'text-[#D4BEE4]' : 'text-[#715F85]'
                }`}
              >
                {preset.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toggle Custom Visual Clock Dial */}
      <div className="rounded-2xl bg-white border border-[#D4BEE4] p-3.5 sm:p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#3B1E54]">Visual Timing Dial</span>
            <span className="text-[11px] font-semibold text-[#715F85] tabular-nums">
              · {durationLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowDialEditor((prev) => !prev)}
            className="text-xs font-bold text-[#3B1E54] hover:text-[#9B7EBD] transition-colors cursor-pointer"
          >
            {showDialEditor ? 'Hide dial' : 'Customize on dial'}
          </button>
        </div>

        {showDialEditor && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Left: Interactive Analog + 24h Radial Arc Clock */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-[180px] h-[180px] select-none">
                <svg viewBox="0 0 180 180" className="w-full h-full">
                  {/* Outer 24-hour coverage ring track */}
                  <circle
                    cx="90"
                    cy="90"
                    r="82"
                    fill="none"
                    stroke="#EDE7F4"
                    strokeWidth="6"
                  />

                  {/* Highlighted 24-hour active span arc */}
                  {parsed.isAllDay ? (
                    <circle
                      cx="90"
                      cy="90"
                      r="82"
                      fill="none"
                      stroke="#3B1E54"
                      strokeWidth="6"
                    />
                  ) : (
                    <path
                      d={describeArcPath(90, 90, 82, start24Deg, end24Deg)}
                      fill="none"
                      stroke="#9B7EBD"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Inner 12-hour analog clock face */}
                  <circle
                    cx="90"
                    cy="90"
                    r="72"
                    fill="#FAF8FC"
                    stroke="#D4BEE4"
                    strokeWidth="1.5"
                  />

                  {/* Active Analog Clock Hand */}
                  <line
                    x1="90"
                    y1="90"
                    x2={handTipX}
                    y2={handTipY}
                    stroke="#3B1E54"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  <circle cx="90" cy="90" r="4.5" fill="#3B1E54" />
                  <circle cx={handTipX} cy={handTipY} r="4" fill="#9B7EBD" />
                </svg>

                {/* Clickable 12-hour buttons around the dial */}
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hr) => {
                  const angleRad = (((hr % 12) * 30 - 90) * Math.PI) / 180;
                  const rPx = 56;
                  const x = 90 + rPx * Math.cos(angleRad);
                  const y = 90 + rPx * Math.sin(angleRad);
                  const isActiveHour = !parsed.isAllDay && activeHour12 === hr;
                  return (
                    <button
                      key={hr}
                      type="button"
                      aria-label={`Set ${activeHand} hour to ${hr} ${activePeriod}`}
                      onClick={() => updateActiveTime(hr, activeMinute, activePeriod)}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className={`absolute w-6 h-6 rounded-full text-[11px] font-bold tabular-nums flex items-center justify-center transition-all cursor-pointer ${
                        isActiveHour
                          ? 'bg-[#3B1E54] text-white shadow-sm scale-110'
                          : 'text-[#3B1E54] hover:bg-[#D4BEE4]/55'
                      }`}
                    >
                      {hr}
                    </button>
                  );
                })}

                {/* Center Duration Pill inside dial */}
                <div
                  className="pointer-events-none absolute left-1/2 top-[116px] -translate-x-1/2 px-2 py-0.5 rounded-md bg-white/95 border border-[#D4BEE4] text-[10px] font-bold text-[#3B1E54] tabular-nums whitespace-nowrap shadow-2xs"
                >
                  {durationLabel}
                </div>
              </div>
              <span className="text-[11px] text-[#715F85] mt-1.5 text-center">
                Tap any hour on the dial to set{' '}
                <strong className="text-[#3B1E54]">
                  {activeHand === 'start' ? 'Start Time' : 'End Time'}
                </strong>
              </span>
            </div>

            {/* Right: Start / End Interactive Cards + Minute & AM/PM Controls */}
            <div className="md:col-span-7 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Start Time Card */}
                {(['start', 'end'] as const).map((hand) => {
                  const isFocused = activeHand === hand;
                  const handMin =
                    hand === 'start'
                      ? parsed.isAllDay
                        ? 9 * 60
                        : parsed.startMin
                      : parsed.isAllDay
                        ? 20 * 60
                        : parsed.endMin % 1440;
                  const h24 = Math.floor(handMin / 60);
                  const period: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
                  const displayTime = parsed.isAllDay
                    ? hand === 'start'
                      ? '12:00 AM'
                      : '11:59 PM'
                    : formatMinutes12h(handMin);

                  return (
                    <div
                      key={hand}
                      onClick={() => setActiveHand(hand)}
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isFocused
                          ? 'border-[#3B1E54] bg-[#FAF8FC] shadow-[0_0_0_1px_#3B1E54]'
                          : 'border-[#D4BEE4] bg-white hover:border-[#9B7EBD]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveHand(hand)}
                        className="w-full flex items-center justify-between gap-1 mb-2 text-left cursor-pointer whitespace-nowrap"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#715F85] whitespace-nowrap">
                          {hand === 'start' ? 'From' : 'Until'}
                        </span>
                        {isFocused ? (
                          <span className="text-[10px] font-bold text-[#3B1E54] whitespace-nowrap">
                            ● Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-[#9B7EBD] whitespace-nowrap">
                            Select
                          </span>
                        )}
                      </button>

                      <div className="flex items-center justify-between gap-1">
                        <button
                          type="button"
                          aria-label={`Decrease ${hand} time by 30 minutes`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHand(hand);
                            stepHandMinutes(hand, -30);
                          }}
                          className="w-6 h-6 shrink-0 rounded-lg border border-[#D4BEE4] bg-white hover:bg-[#D4BEE4]/40 text-[#3B1E54] flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveHand(hand)}
                          className="text-[13px] sm:text-sm font-extrabold text-[#3B1E54] tabular-nums whitespace-nowrap cursor-pointer px-1"
                        >
                          {displayTime}
                        </button>

                        <button
                          type="button"
                          aria-label={`Increase ${hand} time by 30 minutes`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHand(hand);
                            stepHandMinutes(hand, 30);
                          }}
                          className="w-6 h-6 shrink-0 rounded-lg border border-[#D4BEE4] bg-white hover:bg-[#D4BEE4]/40 text-[#3B1E54] flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* AM / PM Switch */}
                      <div className="grid grid-cols-2 gap-1 mt-2.5">
                        {(['AM', 'PM'] as const).map((p) => {
                          const isPeriodActive = !parsed.isAllDay && period === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveHand(hand);
                                setHandPeriod(hand, p);
                              }}
                              className={`py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                                isPeriodActive
                                  ? 'bg-[#3B1E54] text-white'
                                  : 'bg-[#D4BEE4]/25 text-[#3B1E54] hover:bg-[#D4BEE4]/50'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Minute Fine-Tuning Pills for Active Hand */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-[11px] font-semibold text-[#715F85]">
                  Minutes ({activeHand === 'start' ? 'Start' : 'End'}):
                </span>
                <div className="flex items-center gap-1.5">
                  {[0, 15, 30, 45].map((min) => {
                    const isMinSelected = !parsed.isAllDay && activeMinute === min;
                    return (
                      <button
                        key={min}
                        type="button"
                        onClick={() => updateActiveTime(activeHour12, min, activePeriod)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tabular-nums border transition-colors cursor-pointer ${
                          isMinSelected
                            ? 'bg-[#3B1E54] text-white border-[#3B1E54]'
                            : 'bg-[#FAF8FC] text-[#3B1E54] border-[#D4BEE4] hover:border-[#9B7EBD]'
                        }`}
                      >
                        :{String(min).padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 24-Hour Day-to-Night Coverage Timeline Bar */}
        <div className="pt-2 border-t border-[#EDE7F4] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold text-[#715F85] tabular-nums">
            <span className="inline-flex items-center gap-1">
              <Moon className="w-3 h-3 text-indigo-400" />
              12 AM
            </span>
            <span className="inline-flex items-center gap-1">
              <Sunrise className="w-3 h-3 text-amber-500" />
              6 AM
            </span>
            <span className="inline-flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" />
              12 PM
            </span>
            <span className="inline-flex items-center gap-1">
              <Sunset className="w-3 h-3 text-orange-500" />
              6 PM
            </span>
            <span>12 AM</span>
          </div>

          <div className="relative h-2.5 rounded-full bg-[#EDE7F4] overflow-hidden">
            {parsed.isAllDay ? (
              <div className="absolute inset-0 bg-gradient-to-r from-[#3B1E54] via-[#9B7EBD] to-[#3B1E54] rounded-full" />
            ) : wrapsOvernight ? (
              <>
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-[#9B7EBD] to-[#3B1E54]"
                  style={{ left: `${startPct}%`, right: '0%' }}
                />
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-[#3B1E54] to-[#9B7EBD]"
                  style={{ left: '0%', width: `${endPct}%` }}
                />
              </>
            ) : (
              <div
                className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#3B1E54] via-[#7E57A6] to-[#9B7EBD]"
                style={{
                  left: `${startPct}%`,
                  width: `${Math.max(2, endPct - startPct)}%`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
