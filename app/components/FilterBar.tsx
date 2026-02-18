import { useAnalytics } from "../contexts/analytics-context";
import { dateRangeOptions } from "../data/trades";

const quickRanges = ["7D", "30D", "90D", "ALL"];

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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 gap-4 md:grid-cols-3">
          <div>
            <p className="stat-label">Symbol</p>
            <select
              className="glass-input mt-2"
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
              className="glass-input mt-2"
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

          <div>
            <p className="stat-label">Search journal</p>
            <input
              className="glass-input mt-2"
              placeholder="Tags, trade id, or note keywords"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="pill">{filterSummary}</span>
          <span className="pill">Secure local mode</span>
          <button
            onClick={() => {
              setSelectedSymbol("All");
              setDateRange("30D");
              setQuery("");
            }}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 uppercase tracking-[0.2em] text-slate-300 transition hover:bg-white/10"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="stat-label">Quick range</span>
          {quickRanges.map((range) => (
            <button
              key={range}
              className={`rounded-full border px-3 py-1.5 uppercase tracking-[0.2em] transition ${
                dateRange === range
                  ? "border-emerald-300/45 bg-emerald-400/15 text-emerald-100"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
              onClick={() => setDateRange(range)}
            >
              {range}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400">
          Filters apply globally across overview, performance, journal, and
          portfolio.
        </p>
      </div>
    </section>
  );
}
