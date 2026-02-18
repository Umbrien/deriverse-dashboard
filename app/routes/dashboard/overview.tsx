import type { Route } from "./+types/overview";
import { useAnalytics } from "../../contexts/analytics-context";
import {
  compactFormatter,
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
    dailyPerformance,
    pnlSeries,
    linePath,
    drawdownPath,
    maxDrawdown,
    feeSeries,
    feePath,
    feeBreakdown,
    orderTypePerformance,
  } = useAnalytics();

  const pnlPositive = metrics.netPnl >= 0;
  const netReturn = metrics.netPnl / Math.max(metrics.totalVolume, 1);
  const gainLossRatio = metrics.avgLoss
    ? metrics.avgWin / metrics.avgLoss
    : metrics.avgWin
      ? 99
      : 0;

  const bestDay = dailyPerformance.reduce(
    (best, day) => (day.pnl > best.pnl ? day : best),
    { date: "-", pnl: 0, volume: 0, fees: 0, trades: 0, winRate: 0 },
  );
  const worstDay = dailyPerformance.reduce(
    (worst, day) => (day.pnl < worst.pnl ? day : worst),
    { date: "-", pnl: 0, volume: 0, fees: 0, trades: 0, winRate: 0 },
  );

  const peakPnl = Math.max(...pnlSeries.map((point) => point.cumulative), 0);
  const lastFee = feeSeries.length ? feeSeries[feeSeries.length - 1].cumulativeFees : 0;
  const maxOrderAbs = Math.max(
    1,
    ...orderTypePerformance.map((item) => Math.abs(item.pnl)),
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="panel-solid relative overflow-hidden p-6">
        <div className="absolute -right-20 -top-12 h-52 w-52 rounded-full bg-emerald-400/18 blur-[70px]" />
        <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-sky-400/14 blur-[80px]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <span className="chip">Deriverse Analytics Overview</span>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Total PnL, fees, risk, and execution quality in one panel.
            </h2>
            <p className="max-w-2xl text-sm text-slate-300">
              Built for active Solana traders running spot, perp, and options
              workflows with portfolio and journal context always in sync.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-300">
              <span className="kpi-badge">
                Net return {percentFormatter.format(netReturn)}
              </span>
              <span className="kpi-badge">
                Profit factor {metrics.profitFactor.toFixed(2)}
              </span>
              <span className="kpi-badge">
                Expectancy {currencyFormatter.format(metrics.expectancy)}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="panel-soft p-4">
              <p className="stat-label">Best day</p>
              <p className="mt-2 text-lg font-semibold text-emerald-200">
                {formatSignedCurrency(bestDay.pnl)}
              </p>
              <p className="text-xs text-slate-400">
                {bestDay.date} | {bestDay.trades} trades | win {percentFormatter.format(bestDay.winRate)}
              </p>
            </div>
            <div className="panel-soft p-4">
              <p className="stat-label">Worst day</p>
              <p className="mt-2 text-lg font-semibold text-rose-200">
                {formatSignedCurrency(worstDay.pnl)}
              </p>
              <p className="text-xs text-slate-400">
                {worstDay.date} | fees {currencyFormatter.format(worstDay.fees)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <article className="stat-card xl:col-span-2">
          <p className="stat-label">Total PnL</p>
          <p
            className={`mt-3 text-3xl font-semibold ${
              pnlPositive ? "metric-trend-positive" : "metric-trend-negative"
            }`}
          >
            {formatSignedCurrency(metrics.netPnl)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Gross {currencyFormatter.format(metrics.grossPnl)} | Fees {currencyFormatter.format(metrics.totalFees)}
          </p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Volume</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {compactFormatter.format(metrics.totalVolume)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {metrics.totalTrades} trades
          </p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Win Rate</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {percentFormatter.format(metrics.winRate)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {metrics.winningTrades}W / {metrics.losingTrades}L
          </p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Avg Duration</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {Math.round(metrics.avgDuration)}m
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Session pace metric
          </p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Long / Short</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {metrics.longShortRatio.toFixed(2)}x
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {metrics.longTrades} long | {metrics.shortTrades} short
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="panel flex flex-col gap-6 p-6 lg:col-span-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="stat-label">Historical PnL</p>
              <h3 className="section-title">Cumulative equity and drawdown</h3>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Equity curve
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                Drawdown
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
            <svg viewBox="0 0 640 220" className="h-56 w-full">
              <defs>
                <linearGradient id="overviewPnl" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <path d={linePath} fill="none" stroke="url(#overviewPnl)" strokeWidth="3" />
              <path
                d={drawdownPath}
                fill="none"
                stroke="#fb7185"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>

            <div className="mt-4 grid gap-3 text-xs text-slate-400 sm:grid-cols-3">
              <div className="flex items-center justify-between">
                <span>Peak equity</span>
                <span className="text-slate-100">{currencyFormatter.format(peakPnl)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Max drawdown</span>
                <span className="text-rose-200">{currencyFormatter.format(maxDrawdown)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg win/loss</span>
                <span className="text-slate-100">{gainLossRatio.toFixed(2)}x</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel-soft p-4">
              <p className="stat-label">Largest gain / loss</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="metric-trend-positive">
                  {currencyFormatter.format(metrics.largestGain)}
                </span>
                <span className="metric-trend-negative">
                  {currencyFormatter.format(metrics.largestLoss)}
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Risk buffer target {currencyFormatter.format(Math.abs(metrics.largestLoss) * 1.3)}
              </p>
            </div>

            <div className="panel-soft p-4">
              <p className="stat-label">Trade outcomes</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="kpi-badge">Winners {metrics.winningTrades}</span>
                <span className="kpi-badge">Losers {metrics.losingTrades}</span>
                <span className="kpi-badge">Break-even {metrics.breakEvenTrades}</span>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Expectancy {currencyFormatter.format(metrics.expectancy)} per trade.
              </p>
            </div>
          </div>
        </div>

        <aside className="panel flex flex-col gap-6 p-6 lg:col-span-4">
          <div>
            <p className="stat-label">Fee analysis</p>
            <h3 className="section-title">Composition + cumulative tracking</h3>
          </div>

          <div className="flex items-center gap-6">
            <div
              className="h-32 w-32 rounded-full border border-white/10"
              style={{ background: feeBreakdown.gradient }}
            />
            <div className="space-y-2 text-sm text-slate-300">
              {feeBreakdown.breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4">
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

          <div className="panel-soft p-4">
            <p className="stat-label">Cumulative fees</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {currencyFormatter.format(lastFee)}
            </p>
            <svg viewBox="0 0 640 140" className="mt-2 h-28 w-full">
              <path d={feePath} fill="none" stroke="#f59e0b" strokeWidth="3" />
            </svg>
          </div>

          <div>
            <p className="stat-label">Order Type Performance</p>
            <div className="mt-3 space-y-3">
              {orderTypePerformance.map((item) => (
                <div key={item.orderType} className="panel-soft p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-100">{item.orderType}</span>
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
                        width: `${Math.min(100, (Math.abs(item.pnl) / maxOrderAbs) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>{item.trades} trades</span>
                    <span>{percentFormatter.format(item.winRate)} win</span>
                    <span>avg {currencyFormatter.format(item.avgPnl)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
