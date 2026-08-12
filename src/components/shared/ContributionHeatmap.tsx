"use client";

import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type HeatmapDatum = {
  date: string; // YYYY-MM-DD
  level: number; // 0..4
  count: number | null;
  label?: string;
};

type HeatmapProps = {
  data: HeatmapDatum[];
  months?: number;
  variant?: "github" | "leetcode";
  className?: string;
};

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const CELL = 12;
const GAP = 3;

function endOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfWeekSunday(date: Date) {
  const copy = endOfDay(date);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}

function toIso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const monthsFmt = new Intl.DateTimeFormat("en", { month: "short" });
const fullFmt = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

type HoverState = {
  datum: HeatmapDatum;
  x: number; // px within the wrapper
  y: number;
};

export default function ContributionHeatmap({ data, months = 12, variant = "github", className }: HeatmapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<HoverState | null>(null);

  const { weeks, monthLabels, total } = useMemo(() => {
    const map = new Map(data.map((d) => [d.date, d]));

    const today = endOfDay(new Date());
    const rangeStart = new Date(today);
    rangeStart.setMonth(rangeStart.getMonth() - (months - 1));
    rangeStart.setDate(1);
    const start = startOfWeekSunday(rangeStart);

    const weeksArr: { date: Date; datum: HeatmapDatum }[][] = [];
    const labels: { index: number; label: string }[] = [];
    // Seed lastMonth with the start month so the first real change emits a label,
    // and avoid a duplicate label on the very first week.
    let lastMonth = start.getMonth();
    let totalCount = 0;

    const cursor = new Date(start);
    let weekIndex = 0;
    let guard = 0;
    while (cursor <= today && guard < 70) {
      const week: { date: Date; datum: HeatmapDatum }[] = [];
      for (let day = 0; day < 7; day += 1) {
        const iso = toIso(cursor);
        const existing = map.get(iso);
        const withinRange = cursor >= rangeStart && cursor <= today;
        const level = withinRange ? existing?.level ?? 0 : 0;
        const count = withinRange ? existing?.count ?? null : null;
        if (withinRange && typeof count === "number") totalCount += count;
        week.push({
          date: new Date(cursor),
          datum: {
            date: iso,
            level,
            count,
            label: existing?.label
          }
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      // Label by the month of the week's Monday (visually the column anchor),
      // emitting one label per distinct month change.
      const anchor = week[1]?.date ?? week[0].date;
      const anchorMonth = anchor.getMonth();
      if (anchorMonth !== lastMonth) {
        labels.push({ index: weekIndex, label: monthsFmt.format(anchor) });
        lastMonth = anchorMonth;
      }
      weeksArr.push(week);
      weekIndex += 1;
      guard += 1;
    }

    return { weeks: weeksArr, monthLabels: labels, total: totalCount };
  }, [data, months]);

  const levelClass = (level: number) => {
    const base = variant === "leetcode"
      ? ["hm-0", "hm-lc-1", "hm-lc-2", "hm-lc-3", "hm-lc-4"]
      : ["hm-0", "hm-1", "hm-2", "hm-3", "hm-4"];
    return base[Math.max(0, Math.min(4, level))];
  };

  const showHover = (datum: HeatmapDatum, el: HTMLElement) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const wRect = wrapper.getBoundingClientRect();
    const cRect = el.getBoundingClientRect();
    setHover({
      datum,
      x: cRect.left - wRect.left + cRect.width / 2,
      y: cRect.top - wRect.top
    });
  };

  const totalLabel = variant === "leetcode" ? "submissions" : "contributions";

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div
        className="hm-grid-scroll pb-2"
        role="img"
        aria-label={
          variant === "leetcode"
            ? "LeetCode submission activity calendar for the last year"
            : "GitHub contribution activity calendar for the last year"
        }
      >
        {/* keep a min-width so cells never squish; container scrolls instead */}
        <div className="inline-block min-w-full align-top" style={{ minWidth: `${weeks.length * (CELL + GAP) + 40}px` }}>
          {/* month labels aligned to their week columns */}
          <div className="flex pl-10" aria-hidden="true" style={{ gap: `${GAP}px` }}>
            {weeks.map((week, i) => {
              const label = monthLabels.find((m) => m.index === i);
              return (
                <div
                  key={i}
                  className="shrink-0 overflow-visible whitespace-nowrap text-[10px] leading-4 text-muted-foreground"
                  style={{ width: `${CELL}px` }}
                >
                  {label?.label ?? ""}
                </div>
              );
            })}
          </div>

          <div className="mt-1 flex gap-2">
            {/* weekday labels */}
            <div className="flex w-8 shrink-0 flex-col pr-1" aria-hidden="true" style={{ gap: `${GAP}px` }}>
              {WEEKDAY_LABELS.map((label, i) => (
                <div key={i} className="flex items-center text-[9px] leading-none text-muted-foreground" style={{ height: `${CELL}px` }}>
                  {label}
                </div>
              ))}
            </div>

            {/* grid of weeks */}
            <div className="flex" style={{ gap: `${GAP}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {week.map(({ date, datum }) => {
                    const inFuture = date > new Date();
                    return (
                      <button
                        key={datum.date + "-" + wi}
                        type="button"
                        aria-label={
                          datum.count != null
                            ? `${datum.count} ${variant === "leetcode" ? "submissions" : "contributions"} on ${fullFmt.format(date)}`
                            : `${datum.label || (datum.level > 0 ? "Active" : "No activity")} on ${fullFmt.format(date)}`
                        }
                        className={cn("hm", levelClass(datum.level), inFuture && "opacity-20")}
                        style={{ width: `${CELL}px` }}
                        onMouseEnter={(e) => showHover(datum, e.currentTarget)}
                        onFocus={(e) => showHover(datum, e.currentTarget)}
                        onClick={(e) => showHover(datum, e.currentTarget)}
                        onMouseLeave={() => setHover(null)}
                        onBlur={() => setHover(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* legend + summary */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          {total > 0 ? (
            <>
              <span className="font-semibold tabular-nums text-foreground">{total.toLocaleString()}</span>{" "}
              {totalLabel} in the last {months === 12 ? "year" : `${months} months`}
            </>
          ) : (
            <>Activity intensity over the last {months === 12 ? "year" : `${months} months`}</>
          )}
        </span>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={cn("hm !w-[11px]", levelClass(level))} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* cursor-following tooltip */}
      {hover ? (
        <div
          role="status"
          className="pointer-events-none absolute z-20 whitespace-nowrap rounded-md border border-border bg-surface px-2.5 py-1.5 text-[11px] text-foreground shadow-lg"
          style={{
            left: `${Math.max(8, Math.min(hover.x, (wrapperRef.current?.clientWidth ?? 320) - 8))}px`,
            top: `${Math.max(hover.y - 8, 0)}px`,
            transform: "translate(-50%, -100%)"
          }}
        >
          <span className="font-semibold">
            {hover.datum.count != null
              ? `${hover.datum.count} ${variant === "leetcode" ? "submission" : "contribution"}${hover.datum.count === 1 ? "" : "s"}`
              : hover.datum.label || (hover.datum.level > 0 ? "Active" : "No activity")}
          </span>
          <span className="text-muted-foreground">
            {" · "}
            {new Date(`${hover.datum.date}T00:00:00`).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      ) : null}
    </div>
  );
}
