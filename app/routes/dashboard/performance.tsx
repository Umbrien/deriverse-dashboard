import { useMemo } from "react";
import type { Route } from "./+types/performance";
import { useAnalytics } from "../../contexts/analytics-context";
import {
  currencyFormatter,
  percentFormatter,
  formatSignedCurrency,
} from "../../utils/format";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Deriverse | Performance Analytics" },
    {
      name: "description",
      content:
        "Session-based performance, directional bias, and time-of-day analytics.",
    },
  ];
}

export default function Performance() {
  const {
    dailyPerformance,
    sessionPerformance,
    timeBuckets,
    metrics,
    filteredTrades,
  } = useAnalytics();

  const symbolPerformance = useMemo(() => {
    const map = new Map<string, { pnl: number; trades: number }>();
    filteredTrades.forEach((trade) => {
      const current = map.get(trade.symbol) ?? { pnl: 0, trades: 0 };
      current.pnl += trade.pnl;
      current.trades += 1;
      map.set(trade.symbol, current);
    });

    return Array.from(map.entries())
      .map(([symbol, stats]) => ({ symbol, ...stats }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades]);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="panel flex flex-col gap-6 p-6 lg:col-span-7">
          <div>
            <p className="stat-label">Time-based performance</p>
            <h2 className="font-display text-xl text-white">
              Session, daily, and time-of-day analytics
            </h2>
          </div>
          <div className="panel-soft p-4">
            <p className="stat-label">Daily PnL</p>
            <div className="mt-4 flex items-end gap-2">
              {dailyPerformance.map((day) => (
                <div key={day.date} className="flex flex-col items-center">
                  <div
                    className={`w-6 rounded-full ${
                      day.pnl >= 0 ? "bg-emerald-400" : "bg-rose-400"
                    }`}
                    style={{
                      height: `${
                        (Math.abs(day.pnl) /
                          Math.max(
                            1,
                            ...dailyPerformance.map((item) =>
                              Math.abs(item.pnl),
                            ),
                          )) *
                          80 +
                        10
                      }px`,
                    }}
                  />
                  <span className="mt-2 text-[10px] text-slate-500">
                    {day.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel-soft p-4">
              <p className="stat-label">Session breakdown</p>
              <div className="mt-3 space-y-3 text-sm">
                {sessionPerformance.map((session) => (
                  <div
                    key={session.session}
                    className="flex items-center justify-between"
                  >
                    <span>{session.session}</span>
                    <span
                      className={
                        session.pnl >= 0
                          ? "text-emerald-200"
                          : "text-rose-200"
                      }
                    >
                      {formatSignedCurrency(session.pnl)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel-soft p-4">
              <p className="stat-label">Time-of-day bias</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                {timeBuckets.map((bucket) => (
                  <div
                    key={bucket.label}
                    className="rounded-lg border border-white/10 p-2 text-center"
                    style={{
                      backgroundColor:
                        bucket.pnl >= 0
                          ? `rgba(45, 212, 191, ${
                              0.15 + bucket.intensity * 0.65
                            })`
                          : `rgba(248, 113, 113, ${
                              0.15 + bucket.intensity * 0.65
                            })`,
                    }}
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em]">
                      {bucket.label}
                    </div>
                    <div className="mt-1 font-semibold text-slate-100">
                      {formatSignedCurrency(bucket.pnl)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="panel flex flex-col gap-6 p-6 lg:col-span-5">
          <div>
            <p className="stat-label">Directional bias</p>
            <h2 className="font-display text-xl text-white">
              Long/Short ratio and exposure control
            </h2>
          </div>
          <div className="panel-soft p-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Long volume</span>
              <span>{metrics.longTrades} trades</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-emerald-400"
                style={{
                  width: `${
                    (metrics.longTrades / Math.max(metrics.totalTrades, 1)) *
                    100
                  }%`,
                }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
              <span>Short volume</span>
              <span>{metrics.shortTrades} trades</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-rose-400"
                style={{
                  width: `${
                    (metrics.shortTrades / Math.max(metrics.totalTrades, 1)) *
                    100
                  }%`,
                }}
              />
            </div>
            <div className="mt-4 text-xs text-slate-400">
              Bias factor {metrics.longShortRatio.toFixed(2)}x - Maintain{" "}
              <span className="text-slate-200">0.8x - 1.4x</span> for neutral
              regime.
            </div>
          </div>

          <div className="panel-soft p-4">
            <p className="stat-label">Risk controls</p>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Largest loss</span>
                <span className="text-rose-200">
                  {currencyFormatter.format(metrics.largestLoss)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg loss</span>
                <span className="text-rose-200">
                  {currencyFormatter.format(metrics.avgLoss)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg win</span>
                <span className="text-emerald-200">
                  {currencyFormatter.format(metrics.avgWin)}
                </span>
              </div>
            </div>
          </div>

          <div className="panel-soft p-4">
            <p className="stat-label">Risk alerts</p>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>Slippage spikes on stop orders (last 3 stops).</li>
              <li>Drawdown threshold at 65% of monthly limit.</li>
              <li>Consider reducing size during US close.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="panel flex flex-col gap-6 p-6">
        <div>
          <p className="stat-label">Symbol performance</p>
          <h2 className="font-display text-xl text-white">
            Leaders, laggards, and consistency by market
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {symbolPerformance.map((item) => (
            <div key={item.symbol} className="panel-soft p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">
                  {item.symbol}
                </span>
                <span
                  className={
                    item.pnl >= 0 ? "text-emerald-200" : "text-rose-200"
                  }
                >
                  {formatSignedCurrency(item.pnl)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>{item.trades} trades</span>
                <span>
                  Contribution{" "}
                  {percentFormatter.format(
                    item.pnl / Math.max(metrics.grossPnl, 1),
                  )}
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div
                  className={`h-2 rounded-full ${
                    item.pnl >= 0 ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (Math.abs(item.pnl) /
                        Math.max(
                          1,
                          ...symbolPerformance.map((value) =>
                            Math.abs(value.pnl),
                          ),
                        )) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
