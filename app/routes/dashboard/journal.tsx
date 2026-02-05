import type { Route } from "./+types/journal";
import { useAnalytics } from "../../contexts/analytics-context";
import { currencyFormatterPrecise, formatSignedCurrency } from "../../utils/format";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Deriverse | Trading Journal" },
    {
      name: "description",
      content: "Detailed trade history with annotation capabilities.",
    },
  ];
}

export default function Journal() {
  const { filteredTrades } = useAnalytics();

  return (
    <div className="flex flex-col gap-6">
      <section className="panel flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="stat-label">Trading journal</p>
            <h2 className="font-display text-xl text-white">
              Trade-by-trade history with annotations
            </h2>
          </div>
          <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            Add manual trade
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3">Trade</th>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Side</th>
                <th className="px-4 py-3">Entry &rarr; Exit</th>
                <th className="px-4 py-3">PnL</th>
                <th className="px-4 py-3">Fees</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="bg-slate-950/30">
                  <td className="px-4 py-4 text-slate-200">
                    <div className="font-semibold">{trade.id}</div>
                    <div className="text-xs text-slate-500">
                      {trade.date} | {trade.session}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{trade.symbol}</td>
                  <td
                    className={
                      trade.side === "Long"
                        ? "px-4 py-4 text-emerald-200"
                        : "px-4 py-4 text-rose-200"
                    }
                  >
                    {trade.side}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {currencyFormatterPrecise.format(trade.entry)} &rarr;{" "}
                    {currencyFormatterPrecise.format(trade.exit)}
                  </td>
                  <td
                    className={
                      trade.pnl >= 0
                        ? "px-4 py-4 text-emerald-200"
                        : "px-4 py-4 text-rose-200"
                    }
                  >
                    {formatSignedCurrency(trade.pnl)}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {currencyFormatterPrecise.format(trade.fees + trade.funding)}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {trade.durationMins}m
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {trade.orderType}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        {trade.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <textarea
                        rows={2}
                        className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-200"
                        defaultValue={trade.note}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="panel-soft p-4">
          <p className="stat-label">Annotation protocol</p>
          <p className="mt-2 text-sm text-slate-300">
            Every trade note is encrypted and stored locally by default. Sync to
            the Deriverse journal vault when ready.
          </p>
        </div>
        <div className="panel-soft p-4">
          <p className="stat-label">Discipline score</p>
          <p className="mt-2 text-sm text-slate-300">
            92% process adherence | 3 rule violations | Top setup: Breakouts
          </p>
        </div>
        <div className="panel-soft p-4">
          <p className="stat-label">Review cadence</p>
          <p className="mt-2 text-sm text-slate-300">
            Weekly review scheduled for Friday close. Capture missed fills and
            slippage notes.
          </p>
        </div>
      </section>
    </div>
  );
}
