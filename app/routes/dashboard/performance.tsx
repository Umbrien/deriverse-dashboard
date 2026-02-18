import { useMemo } from "react";
import type { Route } from "./+types/performance";
import { useAnalytics } from "../../contexts/analytics-context";
import {
  compactFormatter,
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
    const map = new Map<
      string,
      {
        pnl: number;
        trades: number;
        wins: number;
        longTrades: number;
        shortTrades: number;
        volume: number;
        duration: number;
      }
    >();

    filteredTrades.forEach((trade) => {
      const current = map.get(trade.symbol) ?? {
        pnl: 0,
        trades: 0,
        wins: 0,
        longTrades: 0,
        shortTrades: 0,
        volume: 0,
        duration: 0,
      };
      current.pnl += trade.pnl - trade.fees - trade.funding;
      current.trades += 1;
      current.wins += trade.pnl > 0 ? 1 : 0;
      current.longTrades += trade.side === "Long" ? 1 : 0;
      current.shortTrades += trade.side === "Short" ? 1 : 0;
      current.volume += trade.volume;
      current.duration += trade.durationMins;
      map.set(trade.symbol, current);
    });

    return Array.from(map.entries())
      .map(([symbol, stats]) => ({
        symbol,
        ...stats,
        winRate: stats.trades ? stats.wins / stats.trades : 0,
        avgDuration: stats.trades ? stats.duration / stats.trades : 0,
      }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades]);

  const maxDailyAbs = Math.max(
    1,
    ...dailyPerformance.map((day) => Math.abs(day.pnl)),
  );

  const maxSymbolAbs = Math.max(
    1,
    ...symbolPerformance.map((item) => Math.abs(item.pnl)),
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <article className="stat-card xl:col-span-2">
          <p className="stat-label">Directional Bias</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {metrics.longShortRatio.toFixed(2)}x
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {metrics.longTrades} long | {metrics.shortTrades} short
          </p>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-emerald-400"
              style={{
                width: `${(metrics.longTrades / Math.max(metrics.totalTrades, 1)) * 100}%`,
              }}
            />
          </div>
        </article>

        <article className="stat-card">
          <p className="stat-label">Winning Trades</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {metrics.winningTrades}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {percentFormatter.format(metrics.winRate)} overall
          </p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Avg Trade Duration</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {Math.round(metrics.avgDuration)}m
          </p>
          <p className="mt-1 text-xs text-slate-400">Holding-time efficiency</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Largest Loss</p>
          <p className="mt-3 text-2xl font-semibold text-rose-200">
            {currencyFormatter.format(metrics.largestLoss)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Risk control reference</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="panel-solid flex flex-col gap-6 p-6 lg:col-span-7">
          <div>
            <p className="stat-label">Daily Performance</p>
            <h2 className="section-title">Net PnL by day with win-rate signal</h2>
          </div>

          <div className="panel-soft p-4">
            <div className="flex min-h-28 items-end gap-2 overflow-x-auto pb-1">
              {dailyPerformance.map((day) => (
                <div key={day.date} className="flex min-w-12 flex-col items-center gap-2">
                  <div
                    className={`w-7 rounded-t-md rounded-b-sm ${
                      day.pnl >= 0 ? "bg-emerald-400" : "bg-rose-400"
                    }`}
                    style={{
                      height: `${(Math.abs(day.pnl) / maxDailyAbs) * 90 + 10}px`,
                    }}
                  />
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">{day.date.slice(5)}</p>
                    <p className="text-[10px] text-slate-400">
                      {percentFormatter.format(day.winRate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel-soft p-4">
              <p className="stat-label">Session Performance</p>
              <div className="mt-3 space-y-3">
                {sessionPerformance.map((session) => (
                  <div key={session.session} className="rounded-xl border border-white/10 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-100">{session.session}</span>
                      <span
                        className={
                          session.pnl >= 0 ? "metric-trend-positive" : "metric-trend-negative"
                        }
                      >
                        {formatSignedCurrency(session.pnl)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>{session.trades} trades</span>
                      <span>{percentFormatter.format(session.winRate)} win</span>
                      <span>{Math.round(session.avgDuration)}m avg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-soft p-4">
              <p className="stat-label">Time-of-day Analysis</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {timeBuckets.map((bucket) => (
                  <div
                    key={bucket.label}
                    className="rounded-lg border border-white/10 p-3"
                    style={{
                      backgroundColor:
                        bucket.pnl >= 0
                          ? `rgba(16, 185, 129, ${0.12 + bucket.intensity * 0.45})`
                          : `rgba(251, 113, 133, ${0.12 + bucket.intensity * 0.45})`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-300">
                        {bucket.label}
                      </span>
                      <span className="text-[10px] text-slate-200">
                        {bucket.trades} t
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-100">
                      {formatSignedCurrency(bucket.pnl)}
                    </p>
                    <p className="text-[10px] text-slate-300">
                      {percentFormatter.format(bucket.winRate)} win
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="panel-solid flex flex-col gap-6 p-6 lg:col-span-5">
          <div>
            <p className="stat-label">Symbol Breakdown</p>
            <h2 className="section-title">Leaders, laggards, and consistency</h2>
          </div>

          <div className="space-y-3">
            {symbolPerformance.map((item) => (
              <div key={item.symbol} className="panel-soft p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-100">{item.symbol}</span>
                  <span
                    className={
                      item.pnl >= 0 ? "metric-trend-positive" : "metric-trend-negative"
                    }
                  >
                    {formatSignedCurrency(item.pnl)}
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className={`h-2 rounded-full ${
                      item.pnl >= 0 ? "bg-emerald-400" : "bg-rose-400"
                    }`}
                    style={{
                      width: `${Math.min(100, (Math.abs(item.pnl) / maxSymbolAbs) * 100)}%`,
                    }}
                  />
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <span>{item.trades} trades</span>
                  <span>{percentFormatter.format(item.winRate)} win</span>
                  <span>{item.longTrades} long / {item.shortTrades} short</span>
                  <span>{Math.round(item.avgDuration)}m avg</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Volume {compactFormatter.format(item.volume)}
                </p>
              </div>
            ))}
          </div>

          <div className="panel-soft p-4 text-sm text-slate-300">
            <p className="stat-label">Risk Alerts</p>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>Largest loss is {currencyFormatter.format(metrics.largestLoss)}: keep per-trade risk under 35% of this value.</li>
              <li>Time bucket with weak edge should use lower leverage and tighter stop sizing.</li>
              <li>Monitor fee drag when shifting toward market/stop-heavy execution.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
