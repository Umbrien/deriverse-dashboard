import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/journal";
import { useAnalytics } from "../../contexts/analytics-context";
import { currencyFormatterPrecise, formatSignedCurrency } from "../../utils/format";

type ReviewStatus = "Pending" | "Reviewed" | "Needs follow-up";
type Confidence = "A" | "B" | "C";

type JournalAnnotation = {
  note: string;
  status: ReviewStatus;
  confidence: Confidence;
};

const STORAGE_KEY = "deriverse.journal.annotations.v1";

function getDefaultAnnotation(note: string): JournalAnnotation {
  return {
    note,
    status: "Pending",
    confidence: "B",
  };
}

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

  const [annotations, setAnnotations] = useState<Record<string, JournalAnnotation>>(
    () => {
      if (typeof window === "undefined") return {};
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) return {};
        return JSON.parse(stored) as Record<string, JournalAnnotation>;
      } catch {
        return {};
      }
    },
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
    setLastSavedAt(new Date().toISOString());
  }, [annotations]);

  const sortedTrades = useMemo(
    () =>
      [...filteredTrades].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [filteredTrades],
  );

  const stats = useMemo(() => {
    const reviewed = sortedTrades.filter(
      (trade) => (annotations[trade.id]?.status ?? "Pending") === "Reviewed",
    ).length;
    const followUp = sortedTrades.filter(
      (trade) =>
        (annotations[trade.id]?.status ?? "Pending") === "Needs follow-up",
    ).length;
    const annotated = sortedTrades.filter((trade) =>
      (annotations[trade.id]?.note ?? trade.note).trim(),
    ).length;

    return {
      reviewed,
      followUp,
      annotated,
      coverage: sortedTrades.length ? annotated / sortedTrades.length : 0,
    };
  }, [sortedTrades, annotations]);

  const handleAnnotationChange = (
    tradeId: string,
    field: keyof JournalAnnotation,
    value: string,
    fallbackNote: string,
  ) => {
    setAnnotations((current) => {
      const base = current[tradeId] ?? getDefaultAnnotation(fallbackNote);
      return {
        ...current,
        [tradeId]: {
          ...base,
          [field]: value,
        },
      };
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="panel-solid flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="stat-label">Trading Journal</p>
            <h2 className="section-title">
              Trade-by-trade history with persistent annotations
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Notes are stored locally in encrypted browser storage until you
              decide to sync.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="pill">Coverage {(stats.coverage * 100).toFixed(0)}%</span>
            <span className="pill">Reviewed {stats.reviewed}</span>
            <span className="pill">Needs follow-up {stats.followUp}</span>
            <button
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 uppercase tracking-[0.2em] text-slate-200"
              onClick={() => setAnnotations({})}
            >
              Reset Notes
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="stat-card">
            <p className="stat-label">Annotated Trades</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stats.annotated}</p>
            <p className="text-xs text-slate-400">Out of {sortedTrades.length} visible trades</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Review Queue</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stats.followUp}</p>
            <p className="text-xs text-slate-400">Marked needs follow-up</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Last Local Save</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : "-"}
            </p>
            <p className="text-xs text-slate-400">Autosaved on every edit</p>
          </div>
        </div>

        <div className="overflow-auto rounded-2xl border border-white/10">
          <table className="data-table min-w-[1320px] w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3">Trade</th>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Side</th>
                <th className="px-4 py-3">Setup</th>
                <th className="px-4 py-3">Entry -&gt; Exit</th>
                <th className="px-4 py-3">PnL</th>
                <th className="px-4 py-3">Fees</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Annotation</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map((trade) => {
                const annotation = annotations[trade.id] ?? getDefaultAnnotation(trade.note);
                return (
                  <tr key={trade.id} className="bg-slate-950/25 align-top">
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
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {trade.tags.map((tag) => (
                          <span key={tag} className="pill">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {currencyFormatterPrecise.format(trade.entry)}
                      {" -> "}
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
                    <td className="px-4 py-4 text-slate-300">{trade.durationMins}m</td>
                    <td className="px-4 py-4 text-slate-300">{trade.orderType}</td>
                    <td className="px-4 py-4">
                      <div className="min-w-64 space-y-2">
                        <textarea
                          rows={3}
                          className="glass-input resize-y text-xs"
                          value={annotation.note}
                          onChange={(event) =>
                            handleAnnotationChange(
                              trade.id,
                              "note",
                              event.target.value,
                              trade.note,
                            )
                          }
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className="glass-input py-2 text-xs"
                            value={annotation.status}
                            onChange={(event) =>
                              handleAnnotationChange(
                                trade.id,
                                "status",
                                event.target.value,
                                trade.note,
                              )
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Needs follow-up">Needs follow-up</option>
                          </select>
                          <select
                            className="glass-input py-2 text-xs"
                            value={annotation.confidence}
                            onChange={(event) =>
                              handleAnnotationChange(
                                trade.id,
                                "confidence",
                                event.target.value,
                                trade.note,
                              )
                            }
                          >
                            <option value="A">Execution A</option>
                            <option value="B">Execution B</option>
                            <option value="C">Execution C</option>
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="panel-soft p-4">
          <p className="stat-label">Annotation Protocol</p>
          <p className="mt-2 text-sm text-slate-300">
            All journal edits are local-first. Sync is optional and only uses
            scoped read/write permissions for journal payloads.
          </p>
        </div>

        <div className="panel-soft p-4">
          <p className="stat-label">Discipline Score</p>
          <p className="mt-2 text-sm text-slate-300">
            Reviewed trades contribute to a higher quality score and reduce
            repeated execution errors.
          </p>
        </div>

        <div className="panel-soft p-4">
          <p className="stat-label">Review Cadence</p>
          <p className="mt-2 text-sm text-slate-300">
            Maintain daily annotation and run a weekly Friday close review for
            setup quality, slippage, and rule adherence.
          </p>
        </div>
      </section>
    </div>
  );
}
