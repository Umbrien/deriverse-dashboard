import type { Route } from "./+types/overview";
import { useAnalytics } from "../../contexts/analytics-context";
import {
  currencyFormatter,
  currencyFormatterPrecise,
  percentFormatter,
  formatSignedCurrency,
} from "../../utils/format";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Deriverse | Analytics Overview" },
    {
      name: "description",
      content:
        "High-level trading performance analytics, fee breakdowns, and historical PnL tracking.",
    },
  ];
}

export default function Overview() {
  const {
    metrics,
    pnlSeries,
    linePath,
    drawdownPath,
    maxDrawdown,
    feeBreakdown,
    orderTypePerformance,
  } = useAnalytics();

  const pnlPositive = metrics.netPnl >= 0;
  const netReturn = metrics.netPnl / Math.max(metrics.totalVolume, 1);
  const pnlDelta = percentFormatter.format(netReturn);

  return (
    <div className="flex flex-col gap-6">
      <section className="panel flex flex-col gap-6 p-6">
        <div className="space-y-3">
          <span className="chip">Deriverse Analytics</span>
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            Trading intelligence, portfolio control, and a professional journal
            in one on-chain workspace.
          </h2>
          <p className="max-w-2xl text-sm text-slate-300">
            Track total PnL, optimize directional bias, and audit every decision
            with a secure, read-only dashboard built for active Solana traders.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel-soft p-4">
            <p className="stat-label">Net performance</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {formatSignedCurrency(metrics.netPnl)}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Gross {currencyFormatter.format(metrics.grossPnl)} - Fees{" "}
              {currencyFormatter.format(metrics.totalFees)}
            </p>
          </div>
          <div className="panel-soft p-4">
            <p className="stat-label">Consistency</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {percentFormatter.format(metrics.winRate)} win rate
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Expectancy {currencyFormatter.format(metrics.expectancy)} - Profit
              factor {metrics.profitFactor.toFixed(2)}
            </p>
          </div>
          <div className="panel-soft p-4">
            <p className="stat-label">Execution</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {Math.round(metrics.avgDuration)} min avg
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {metrics.totalTrades} trades - Long/Short {metrics.longShortRatio.toFixed(2)}x
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="panel p-5">
          <p className="stat-label">Total PnL</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="stat-value font-display">
                {formatSignedCurrency(metrics.netPnl)}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Net after fees
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                pnlPositive
                  ? "bg-emerald-400/15 text-emerald-200"
                  : "bg-rose-400/15 text-rose-200"
              }`}
            >
              {pnlPositive ? "+" : "-"} {pnlDelta} net return
            </span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/5">
            <div
              className={`h-2 rounded-full ${
                pnlPositive ? "bg-emerald-400" : "bg-rose-400"
              }`}
              style={{ width: pnlPositive ? "68%" : "42%" }}
            />
          </div>
        </div>
        <div className="panel p-5">
          <p className="stat-label">Win rate</p>
          <p className="stat-value font-display">
            {percentFormatter.format(metrics.winRate)}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            {metrics.totalTrades} trades - {metrics.longTrades} long /{" "}
            {metrics.shortTrades} short
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
            <span className="rounded-full bg-white/10 px-3 py-1">
              Profit factor {metrics.profitFactor.toFixed(2)}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              Expectancy {currencyFormatter.format(metrics.expectancy)}
            </span>
          </div>
        </div>
        <div className="panel p-5">
          <p className="stat-label">Trading volume</p>
          <p className="stat-value font-display">
            {currencyFormatter.format(metrics.totalVolume)}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Fees {currencyFormatter.format(metrics.totalFees)} -{" "}
            {percentFormatter.format(metrics.feeRate)} rate
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Avg. trade size</span>
            <span>
              {currencyFormatter.format(
                metrics.totalTrades
                  ? metrics.totalVolume / metrics.totalTrades
                  : 0,
              )}
            </span>
          </div>
        </div>
        <div className="panel p-5">
          <p className="stat-label">Avg duration</p>
          <p className="stat-value font-display">
            {Math.round(metrics.avgDuration)} min
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Largest gain {currencyFormatter.format(metrics.largestGain)}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded-full bg-white/10 px-3 py-1">
              Avg win {currencyFormatter.format(metrics.avgWin)}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="panel flex flex-col gap-6 p-6 lg:col-span-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="stat-label">Historical PnL</p>
              <h2 className="font-display text-xl text-white">
                Cumulative performance + drawdown
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Cumulative PnL
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                Drawdown
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <svg viewBox="0 0 640 220" className="h-56 w-full">
              <defs>
                <linearGradient id="pnlLine" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
              <path
                d={linePath}
                fill="none"
                stroke="url(#pnlLine)"
                strokeWidth="3"
              />
              <path
                d={drawdownPath}
                fill="none"
                stroke="#f87171"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
            <div className="mt-4 grid gap-3 text-xs text-slate-400 sm:grid-cols-3">
              <div className="flex items-center justify-between">
                <span>Peak PnL</span>
                <span className="text-slate-200">
                  {currencyFormatter.format(
                    Math.max(...pnlSeries.map((point) => point.cumulative), 0),
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Max drawdown</span>
                <span className="text-rose-200">
                  {currencyFormatter.format(maxDrawdown)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg loss</span>
                <span className="text-rose-200">
                  -{currencyFormatter.format(metrics.avgLoss)}
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel-soft p-4">
              <p className="stat-label">Average win / loss</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-emerald-200">
                  {currencyFormatter.format(metrics.avgWin)}
                </span>
                <span className="text-rose-200">
                  -{currencyFormatter.format(metrics.avgLoss)}
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-emerald-400"
                  style={{
                    width: `${Math.min(
                      100,
                      (metrics.avgWin / Math.max(metrics.avgLoss, 1)) * 50 + 30,
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div className="panel-soft p-4">
              <p className="stat-label">Largest gain / loss</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-emerald-200">
                  {currencyFormatter.format(metrics.largestGain)}
                </span>
                <span className="text-rose-200">
                  {currencyFormatter.format(metrics.largestLoss)}
                </span>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Risk control buffer: {currencyFormatter.format(
                  Math.abs(metrics.largestLoss) * 1.35,
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="panel flex flex-col gap-6 p-6 lg:col-span-4">
          <div>
            <p className="stat-label">Fees & Composition</p>
            <h2 className="font-display text-xl text-white">
              Cost structure and cumulative fees
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div
              className="h-32 w-32 rounded-full border border-white/10"
              style={{ background: feeBreakdown.gradient }}
            />
            <div className="space-y-2 text-sm text-slate-300">
              {feeBreakdown.breakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>
                  <span className="text-slate-100">
                    {currencyFormatterPrecise.format(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-soft p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>Cumulative fees</span>
              <span className="text-slate-100">
                {currencyFormatter.format(feeBreakdown.total)}
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-amber-400"
                style={{ width: "36%" }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Maker rebates down 6% from last month. Consider posting more
              liquidity on SOL.
            </p>
          </div>
          <div>
            <p className="stat-label">Order type performance</p>
            <div className="mt-3 space-y-3">
              {orderTypePerformance.map((item) => (
                <div key={item.orderType} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.orderType}</span>
                    <span
                      className={
                        item.pnl >= 0
                          ? "text-emerald-200"
                          : "text-rose-200"
                      }
                    >
                      {formatSignedCurrency(item.pnl)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
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
                              ...orderTypePerformance.map((value) =>
                                Math.abs(value.pnl),
                              ),
                            )) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-slate-400">
                    {item.trades} trades - {percentFormatter.format(item.winRate)} win rate
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="panel p-5">
          <p className="stat-label">Directional bias</p>
          <p className="mt-3 text-lg font-semibold text-white">
            Long/Short {metrics.longShortRatio.toFixed(2)}x balance
          </p>
          <div className="mt-4 text-sm text-slate-300">
            {metrics.longTrades} long trades - {metrics.shortTrades} short trades
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-emerald-400"
              style={{
                width: `${
                  (metrics.longTrades / Math.max(metrics.totalTrades, 1)) * 100
                }%`,
              }}
            />
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-rose-400"
              style={{
                width: `${
                  (metrics.shortTrades / Math.max(metrics.totalTrades, 1)) * 100
                }%`,
              }}
            />
          </div>
        </div>
        <div className="panel p-5">
          <p className="stat-label">Largest trade</p>
          <p className="mt-3 text-lg font-semibold text-white">
            {currencyFormatter.format(metrics.largestGain)} best win
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Max loss {currencyFormatter.format(metrics.largestLoss)} - Avg win {currencyFormatter.format(metrics.avgWin)}
          </p>
        </div>
        <div className="panel p-5">
          <p className="stat-label">Execution quality</p>
          <p className="mt-3 text-lg font-semibold text-white">
            {percentFormatter.format(1 - metrics.feeRate)} net efficiency
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Avg fee per trade {currencyFormatterPrecise.format(
              metrics.totalTrades ? metrics.totalFees / metrics.totalTrades : 0,
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
