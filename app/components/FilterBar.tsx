import { useAnalytics } from "../contexts/analytics-context";
import { dateRangeOptions } from "../data/trades";

export function FilterBar() {
  const {
    selectedSymbol,
    dateRange,
    query,
    setSelectedSymbol,
    setDateRange,
    setQuery,
    symbols,
    filterSummary,
  } = useAnalytics();

  return (
    <section className="panel-solid flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-4 md:grid-cols-3">
          <div>
            <p className="stat-label">Symbol</p>
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-100"
              value={selectedSymbol}
              onChange={(event) => setSelectedSymbol(event.target.value)}
            >
              {symbols.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="stat-label">Date range</p>
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-100"
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <p className="stat-label">Search journal</p>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500"
              placeholder="Tags, trade id, or note keywords"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="pill">{filterSummary}</span>
          <span className="pill">Live sync</span>
        </div>
      </div>
    </section>
  );
}
