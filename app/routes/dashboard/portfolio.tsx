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

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="panel-solid flex flex-col gap-6 p-6 lg:col-span-7">
          <div>
            <p className="stat-label">Portfolio analysis</p>
            <h2 className="font-display text-xl text-white">
              Position health and allocation insight
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="data-table w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Side</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Entry</th>
                  <th className="px-4 py-3">Mark</th>
                  <th className="px-4 py-3">Unrealized</th>
                  <th className="px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {portfolioPositions.map((position) => (
                  <tr key={position.symbol}>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-100">
                        {position.symbol}
                      </div>
                      <div className="text-xs text-slate-500">
                        {position.venue} |{" "}
                        {percentFormatter.format(position.allocation)} alloc
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-300">
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
                    <td className="px-4 py-4">
                      <span className="pill">{position.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel-soft p-4">
              <p className="stat-label">Net exposure</p>
              <p className="mt-2 font-display text-lg">
                {currencyFormatter.format(1410000)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Leverage weighted: 2.4x
              </p>
            </div>
            <div className="panel-soft p-4">
              <p className="stat-label">Realized gains</p>
              <p className="mt-2 font-display text-lg">
                {currencyFormatter.format(realizedTotal)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Allocation drift: +3.2% to SOL
              </p>
            </div>
          </div>
        </div>

        <div className="panel-solid flex flex-col gap-6 p-6 lg:col-span-5">
          <div>
            <p className="stat-label">Risk posture</p>
            <h2 className="font-display text-xl text-white">
              Exposure, controls, and security
            </h2>
          </div>
          <div className="panel-soft space-y-3 p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>Unrealized PnL</span>
              <span className="text-slate-100">
                {formatSignedCurrency(unrealizedTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Hedge coverage</span>
              <span className="text-slate-100">37%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Stop loss coverage</span>
              <span className="text-emerald-200">91%</span>
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
              <span className="text-slate-100">Scoped to analytics</span>
            </div>
            <div className="flex items-center justify-between">
              <span>2FA + hardware keys</span>
              <span className="text-emerald-200">Enabled</span>
            </div>
          </div>
          <div className="panel-soft p-4">
            <p className="stat-label">Actionable insight</p>
            <p className="mt-3 text-sm text-slate-300">
              SOL exposure is above target by 3.2%. Consider rebalancing through
              spot to reduce funding costs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
