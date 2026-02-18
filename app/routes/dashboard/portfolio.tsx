import type { Route } from "./+types/portfolio";
import { portfolioPositions } from "../../data/trades";
import {
  compactFormatter,
  currencyFormatter,
  currencyFormatterPrecise,
  percentFormatter,
  formatSignedCurrency,
} from "../../utils/format";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Deriverse | Portfolio" },
    {
      name: "description",
      content: "Portfolio allocation, exposure, and security posture.",
    },
  ];
}

export default function Portfolio() {
  const realizedTotal = portfolioPositions.reduce(
    (sum, position) => sum + position.realized,
    0,
  );
  const unrealizedTotal = portfolioPositions.reduce(
    (sum, position) => sum + position.unrealized,
    0,
  );

  const totalNotional = portfolioPositions.reduce(
    (sum, position) => sum + Math.abs(position.size * position.mark),
    0,
  );
  const weightedLeverage =
    portfolioPositions.reduce(
      (sum, position) => sum + position.leverage * position.allocation,
      0,
    ) || 0;

  const longExposure = portfolioPositions
    .filter((position) => position.side === "Long")
    .reduce((sum, position) => sum + Math.abs(position.size * position.mark), 0);
  const shortExposure = portfolioPositions
    .filter((position) => position.side === "Short")
    .reduce((sum, position) => sum + Math.abs(position.size * position.mark), 0);

  const maxAllocation = Math.max(
    ...portfolioPositions.map((position) => position.allocation),
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="stat-card">
          <p className="stat-label">Realized PnL</p>
          <p className="mt-3 text-2xl font-semibold text-emerald-200">
            {currencyFormatter.format(realizedTotal)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Closed-position performance</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Unrealized PnL</p>
          <p
            className={`mt-3 text-2xl font-semibold ${
              unrealizedTotal >= 0 ? "text-emerald-200" : "text-rose-200"
            }`}
          >
            {formatSignedCurrency(unrealizedTotal)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Mark-to-market snapshot</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Gross Notional</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {compactFormatter.format(totalNotional)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Across all open positions</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Weighted Leverage</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {weightedLeverage.toFixed(2)}x
          </p>
          <p className="mt-1 text-xs text-slate-400">Allocation-adjusted</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="panel-solid flex flex-col gap-6 p-6 lg:col-span-8">
          <div>
            <p className="stat-label">Portfolio Analysis</p>
            <h2 className="section-title">Position health and allocation insight</h2>
          </div>

          <div className="overflow-auto rounded-2xl border border-white/10">
            <table className="data-table min-w-[1100px] w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Side</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Entry</th>
                  <th className="px-4 py-3">Mark</th>
                  <th className="px-4 py-3">Unrealized</th>
                  <th className="px-4 py-3">Leverage</th>
                  <th className="px-4 py-3">Allocation</th>
                  <th className="px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {portfolioPositions.map((position) => (
                  <tr key={position.symbol} className="bg-slate-950/25">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-100">{position.symbol}</div>
                      <div className="text-xs text-slate-500">{position.venue}</div>
                    </td>
                    <td
                      className={
                        position.side === "Long"
                          ? "px-4 py-4 text-emerald-200"
                          : "px-4 py-4 text-rose-200"
                      }
                    >
                      {position.side}
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {compactFormatter.format(position.size)}
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {currencyFormatterPrecise.format(position.entry)}
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {currencyFormatterPrecise.format(position.mark)}
                    </td>
                    <td
                      className={
                        position.unrealized >= 0
                          ? "px-4 py-4 text-emerald-200"
                          : "px-4 py-4 text-rose-200"
                      }
                    >
                      {formatSignedCurrency(position.unrealized)}
                    </td>
                    <td className="px-4 py-4 text-slate-300">{position.leverage.toFixed(1)}x</td>
                    <td className="px-4 py-4">
                      <div className="w-32">
                        <div className="h-2 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-sky-400"
                            style={{
                              width: `${Math.max(
                                8,
                                (position.allocation / Math.max(maxAllocation, 0.01)) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          {percentFormatter.format(position.allocation)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="pill">{position.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="panel-soft p-4">
              <p className="stat-label">Long Exposure</p>
              <p className="mt-2 text-lg font-semibold text-emerald-200">
                {currencyFormatter.format(longExposure)}
              </p>
            </div>
            <div className="panel-soft p-4">
              <p className="stat-label">Short Exposure</p>
              <p className="mt-2 text-lg font-semibold text-rose-200">
                {currencyFormatter.format(shortExposure)}
              </p>
            </div>
            <div className="panel-soft p-4">
              <p className="stat-label">Net Bias</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {(longExposure / Math.max(shortExposure, 1)).toFixed(2)}x long
              </p>
            </div>
          </div>
        </div>

        <aside className="panel-solid flex flex-col gap-6 p-6 lg:col-span-4">
          <div>
            <p className="stat-label">Risk Posture</p>
            <h2 className="section-title">Exposure, controls, and security</h2>
          </div>

          <div className="panel-soft space-y-3 p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>Total exposure</span>
              <span className="text-slate-100">{currencyFormatter.format(totalNotional)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Hedge coverage</span>
              <span className="text-slate-100">37%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Stop-loss coverage</span>
              <span className="text-emerald-200">91%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Portfolio VAR(1d)</span>
              <span className="text-amber-200">2.4%</span>
            </div>
          </div>

          <div className="panel-soft space-y-3 p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>Wallet access</span>
              <span className="text-slate-100">Read-only</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Data storage</span>
              <span className="text-slate-100">Encrypted at rest</span>
            </div>
            <div className="flex items-center justify-between">
              <span>API permissions</span>
              <span className="text-slate-100">Scoped analytics only</span>
            </div>
            <div className="flex items-center justify-between">
              <span>2FA + hardware keys</span>
              <span className="text-emerald-200">Enabled</span>
            </div>
          </div>

          <div className="panel-soft p-4 text-sm text-slate-300">
            <p className="stat-label">Actionable Insight</p>
            <p className="mt-3">
              SOL allocation is the largest sleeve. If funding widens, rotate a
              portion to spot inventory to lower carry costs while keeping beta.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
