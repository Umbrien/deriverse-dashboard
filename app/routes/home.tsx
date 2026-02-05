import { useMemo, useState } from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Deriverse | Trading Analytics" },
    {
      name: "description",
      content:
        "Comprehensive on-chain trading analytics dashboard with journal, portfolio insights, and performance metrics.",
    },
  ];
}

type Trade = {
  id: string;
  symbol: string;
  side: "Long" | "Short";
  orderType: "Limit" | "Market" | "Stop" | "TWAP" | "OCO";
  entry: number;
  exit: number;
  qty: number;
  pnl: number;
  fees: number;
  feeType: "Maker" | "Taker";
  funding: number;
  durationMins: number;
  date: string;
  entryHour: number;
  session: "Asia" | "Europe" | "US";
  tags: string[];
  note: string;
  volume: number;
};

type PortfolioPosition = {
  symbol: string;
  venue: string;
  side: "Long" | "Short";
  size: number;
  entry: number;
  mark: number;
  unrealized: number;
  realized: number;
  allocation: number;
  leverage: number;
  risk: string;
};

const trades: Trade[] = [
  {
    id: "DV-1021",
    symbol: "SOL-PERP",
    side: "Long",
    orderType: "Limit",
    entry: 94.2,
    exit: 99.1,
    qty: 850,
    pnl: 3940,
    fees: 32,
    feeType: "Maker",
    funding: 12,
    durationMins: 140,
    date: "2026-01-05",
    entryHour: 9,
    session: "Europe",
    tags: ["Breakout", "Trend"],
    note: "Scaled in after retest. Tightened stop on volume spike.",
    volume: 80100,
  },
  {
    id: "DV-1026",
    symbol: "BTC-PERP",
    side: "Short",
    orderType: "Market",
    entry: 45620,
    exit: 44810,
    qty: 1.4,
    pnl: 1134,
    fees: 58,
    feeType: "Taker",
    funding: 22,
    durationMins: 220,
    date: "2026-01-07",
    entryHour: 15,
    session: "US",
    tags: ["Mean Reversion"],
    note: "Clean fade of funding premium. Took partials early.",
    volume: 63868,
  },
  {
    id: "DV-1031",
    symbol: "JUP-USD",
    side: "Long",
    orderType: "Limit",
    entry: 1.22,
    exit: 1.17,
    qty: 38000,
    pnl: -1900,
    fees: 18,
    feeType: "Maker",
    funding: 0,
    durationMins: 90,
    date: "2026-01-09",
    entryHour: 5,
    session: "Asia",
    tags: ["Range"],
    note: "Failed support. Exit on structure break.",
    volume: 46360,
  },
  {
    id: "DV-1037",
    symbol: "DRIFT-PERP",
    side: "Long",
    orderType: "TWAP",
    entry: 4.08,
    exit: 4.62,
    qty: 9200,
    pnl: 4968,
    fees: 41,
    feeType: "Taker",
    funding: 16,
    durationMins: 310,
    date: "2026-01-11",
    entryHour: 12,
    session: "Europe",
    tags: ["Momentum"],
    note: "TWAP fill during accumulation. Held through session change.",
    volume: 37536,
  },
  {
    id: "DV-1042",
    symbol: "SOL-PERP",
    side: "Short",
    orderType: "Stop",
    entry: 101.5,
    exit: 106.2,
    qty: 620,
    pnl: -2914,
    fees: 36,
    feeType: "Taker",
    funding: 10,
    durationMins: 75,
    date: "2026-01-13",
    entryHour: 19,
    session: "US",
    tags: ["Trend", "Stop"],
    note: "Stop entry slipped. Reassess volatility filters.",
    volume: 62930,
  },
  {
    id: "DV-1048",
    symbol: "BTC-PERP",
    side: "Long",
    orderType: "Limit",
    entry: 44320,
    exit: 46010,
    qty: 1.2,
    pnl: 2028,
    fees: 44,
    feeType: "Maker",
    funding: 19,
    durationMins: 180,
    date: "2026-01-16",
    entryHour: 7,
    session: "Asia",
    tags: ["Breakout"],
    note: "Confirmed higher low. Added on reclaim.",
    volume: 53184,
  },
  {
    id: "DV-1051",
    symbol: "JUP-USD",
    side: "Short",
    orderType: "Market",
    entry: 1.19,
    exit: 1.08,
    qty: 42000,
    pnl: 4620,
    fees: 24,
    feeType: "Taker",
    funding: 0,
    durationMins: 130,
    date: "2026-01-18",
    entryHour: 14,
    session: "US",
    tags: ["News", "Momentum"],
    note: "Pressed after negative catalyst. Covered into support.",
    volume: 49980,
  },
  {
    id: "DV-1056",
    symbol: "SOL-PERP",
    side: "Long",
    orderType: "OCO",
    entry: 96.9,
    exit: 102.4,
    qty: 740,
    pnl: 4070,
    fees: 29,
    feeType: "Maker",
    funding: 11,
    durationMins: 200,
    date: "2026-01-20",
    entryHour: 10,
    session: "Europe",
    tags: ["Breakout"],
    note: "OCO bracket respected. Good risk-to-reward.",
    volume: 71706,
  },
  {
    id: "DV-1061",
    symbol: "DRIFT-PERP",
    side: "Short",
    orderType: "Limit",
    entry: 4.58,
    exit: 4.32,
    qty: 10500,
    pnl: 2730,
    fees: 21,
    feeType: "Maker",
    funding: 14,
    durationMins: 260,
    date: "2026-01-22",
    entryHour: 16,
    session: "US",
    tags: ["Range"],
    note: "Rotation trade after failed breakout.",
    volume: 48090,
  },
  {
    id: "DV-1068",
    symbol: "SOL-PERP",
    side: "Long",
    orderType: "Market",
    entry: 103.8,
    exit: 100.4,
    qty: 680,
    pnl: -2312,
    fees: 33,
    feeType: "Taker",
    funding: 8,
    durationMins: 95,
    date: "2026-01-24",
    entryHour: 2,
    session: "Asia",
    tags: ["Failed Breakout"],
    note: "Chased candle. Need stricter confirmation.",
    volume: 70584,
  },
  {
    id: "DV-1072",
    symbol: "BTC-PERP",
    side: "Short",
    orderType: "Stop",
    entry: 46240,
    exit: 47020,
    qty: 1.1,
    pnl: -858,
    fees: 46,
    feeType: "Taker",
    funding: 20,
    durationMins: 60,
    date: "2026-01-26",
    entryHour: 21,
    session: "US",
    tags: ["Breakdown"],
    note: "Stop entry slipped. Trimmed quickly.",
    volume: 50864,
  },
  {
    id: "DV-1079",
    symbol: "JUP-USD",
    side: "Long",
    orderType: "Limit",
    entry: 1.06,
    exit: 1.14,
    qty: 52000,
    pnl: 4160,
    fees: 19,
    feeType: "Maker",
    funding: 0,
    durationMins: 210,
    date: "2026-01-28",
    entryHour: 11,
    session: "Europe",
    tags: ["Reversal"],
    note: "Higher low confirmed. Held into session close.",
    volume: 55120,
  },
  {
    id: "DV-1084",
    symbol: "SOL-PERP",
    side: "Short",
    orderType: "TWAP",
    entry: 104.6,
    exit: 98.9,
    qty: 690,
    pnl: 3933,
    fees: 27,
    feeType: "Maker",
    funding: 12,
    durationMins: 240,
    date: "2026-01-30",
    entryHour: 18,
    session: "US",
    tags: ["Mean Reversion"],
    note: "Scaled out into support ladder.",
    volume: 72274,
  },
];

const portfolioPositions: PortfolioPosition[] = [
  {
    symbol: "SOL",
    venue: "Perp",
    side: "Long",
    size: 820,
    entry: 97.4,
    mark: 101.9,
    unrealized: 3690,
    realized: 9100,
    allocation: 0.28,
    leverage: 3.2,
    risk: "Low",
  },
  {
    symbol: "BTC",
    venue: "Perp",
    side: "Short",
    size: 1.6,
    entry: 45900,
    mark: 45320,
    unrealized: 928,
    realized: 1650,
    allocation: 0.34,
    leverage: 2.6,
    risk: "Medium",
  },
  {
    symbol: "JUP",
    venue: "Spot",
    side: "Long",
    size: 68000,
    entry: 1.11,
    mark: 1.14,
    unrealized: 2040,
    realized: 1230,
    allocation: 0.18,
    leverage: 1.0,
    risk: "Low",
  },
  {
    symbol: "DRIFT",
    venue: "Perp",
    side: "Long",
    size: 11200,
    entry: 4.28,
    mark: 4.51,
    unrealized: 2576,
    realized: 1980,
    allocation: 0.2,
    leverage: 2.1,
    risk: "Medium",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyFormatterPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateRangeOptions = [
  { value: "7D", label: "Last 7 days" },
  { value: "30D", label: "Last 30 days" },
  { value: "90D", label: "Last 90 days" },
  { value: "YTD", label: "Year to date" },
  { value: "ALL", label: "All trades" },
];

function formatSignedCurrency(value: number) {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${currencyFormatter.format(Math.abs(value))}`;
}

function buildLinePath(
  data: Array<{ value: number }>,
  width: number,
  height: number,
  min: number,
  max: number,
) {
  if (!data.length) return "";
  const range = max - min || 1;
  return data
    .map((point, index) => {
      const x = (index / Math.max(1, data.length - 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState("All");
  const [dateRange, setDateRange] = useState("30D");
  const [query, setQuery] = useState("");

  const latestTradeDate = useMemo(() => {
    const maxTimestamp = Math.max(
      ...trades.map((trade) => new Date(trade.date).getTime()),
    );
    return new Date(maxTimestamp);
  }, []);

  const symbols = useMemo(
    () => ["All", ...Array.from(new Set(trades.map((trade) => trade.symbol)))],
    [],
  );

  const filteredTrades = useMemo(() => {
    let result = trades;

    if (selectedSymbol !== "All") {
      result = result.filter((trade) => trade.symbol === selectedSymbol);
    }

    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      result = result.filter(
        (trade) =>
          trade.id.toLowerCase().includes(normalized) ||
          trade.tags.some((tag) => tag.toLowerCase().includes(normalized)) ||
          trade.note.toLowerCase().includes(normalized),
      );
    }

    if (dateRange !== "ALL") {
      const rangeDays: Record<string, number> = {
        "7D": 7,
        "30D": 30,
        "90D": 90,
      };
      const startDate = new Date(latestTradeDate);
      if (dateRange === "YTD") {
        startDate.setMonth(0, 1);
      } else {
        const days = rangeDays[dateRange] ?? 30;
        startDate.setDate(startDate.getDate() - days + 1);
      }
      result = result.filter(
        (trade) => new Date(trade.date) >= startDate,
      );
    }

    return result;
  }, [selectedSymbol, dateRange, query, latestTradeDate]);

  const metrics = useMemo(() => {
    const totalTrades = filteredTrades.length;
    const totalPnl = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const totalVolume = filteredTrades.reduce(
      (sum, trade) => sum + trade.volume,
      0,
    );
    const totalFees = filteredTrades.reduce(
      (sum, trade) => sum + trade.fees + trade.funding,
      0,
    );
    const winningTrades = filteredTrades.filter((trade) => trade.pnl > 0);
    const losingTrades = filteredTrades.filter((trade) => trade.pnl < 0);
    const winRate = totalTrades
      ? winningTrades.length / totalTrades
      : 0;
    const avgDuration = totalTrades
      ? filteredTrades.reduce((sum, trade) => sum + trade.durationMins, 0) /
        totalTrades
      : 0;
    const longTrades = filteredTrades.filter((trade) => trade.side === "Long");
    const shortTrades = filteredTrades.filter(
      (trade) => trade.side === "Short",
    );
    const longShortRatio = shortTrades.length
      ? longTrades.length / shortTrades.length
      : longTrades.length;
    const largestGain = winningTrades.reduce(
      (max, trade) => (trade.pnl > max ? trade.pnl : max),
      0,
    );
    const largestLoss = losingTrades.reduce(
      (min, trade) => (trade.pnl < min ? trade.pnl : min),
      0,
    );
    const avgWin = winningTrades.length
      ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) /
        winningTrades.length
      : 0;
    const avgLoss = losingTrades.length
      ?
          Math.abs(
            losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) /
              losingTrades.length,
          )
      : 0;
    const profitFactor = losingTrades.length
      ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) /
        Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0))
      : 0;
    const expectancy = winRate * avgWin - (1 - winRate) * avgLoss;

    return {
      totalTrades,
      totalPnl,
      totalVolume,
      totalFees,
      winRate,
      avgDuration,
      longTrades: longTrades.length,
      shortTrades: shortTrades.length,
      longShortRatio,
      largestGain,
      largestLoss,
      avgWin,
      avgLoss,
      profitFactor,
      expectancy,
    };
  }, [filteredTrades]);

  const dailyPerformance = useMemo(() => {
    const map = new Map<string, number>();
    filteredTrades.forEach((trade) => {
      map.set(trade.date, (map.get(trade.date) ?? 0) + trade.pnl);
    });
    return Array.from(map.entries())
      .sort(
        ([a], [b]) =>
          new Date(a).getTime() - new Date(b).getTime(),
      )
      .map(([date, pnl]) => ({ date, pnl }));
  }, [filteredTrades]);

  const pnlSeries = useMemo(() => {
    let cumulative = 0;
    let peak = 0;
    return dailyPerformance.map((day) => {
      cumulative += day.pnl;
      peak = Math.max(peak, cumulative);
      return {
        date: day.date,
        pnl: day.pnl,
        cumulative,
        drawdown: cumulative - peak,
      };
    });
  }, [dailyPerformance]);

  const pnlDomain = useMemo(() => {
    const values = pnlSeries.flatMap((point) => [
      point.cumulative,
      point.drawdown,
      0,
    ]);
    return {
      min: Math.min(...values, 0),
      max: Math.max(...values, 0),
    };
  }, [pnlSeries]);

  const linePath = useMemo(() => {
    const data = pnlSeries.map((point) => ({ value: point.cumulative }));
    return buildLinePath(data, 640, 220, pnlDomain.min, pnlDomain.max);
  }, [pnlSeries, pnlDomain]);

  const drawdownPath = useMemo(() => {
    const data = pnlSeries.map((point) => ({ value: point.drawdown }));
    return buildLinePath(data, 640, 220, pnlDomain.min, pnlDomain.max);
  }, [pnlSeries, pnlDomain]);

  const maxDrawdown = pnlSeries.length
    ? Math.min(...pnlSeries.map((point) => point.drawdown))
    : 0;

  const feeBreakdown = useMemo(() => {
    const totals = {
      Maker: 0,
      Taker: 0,
      Funding: 0,
    };
    filteredTrades.forEach((trade) => {
      totals[trade.feeType] += trade.fees;
      totals.Funding += trade.funding;
    });
    const total = totals.Maker + totals.Taker + totals.Funding;
    const breakdown = [
      { label: "Maker", value: totals.Maker, color: "#38bdf8" },
      { label: "Taker", value: totals.Taker, color: "#f97316" },
      { label: "Funding", value: totals.Funding, color: "#22c55e" },
    ];
    let cumulative = 0;
    const gradientStops = breakdown
      .map((item) => {
        const start = cumulative;
        const end = cumulative + (total ? (item.value / total) * 100 : 0);
        cumulative = end;
        return `${item.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
      })
      .join(", ");

    return {
      total,
      breakdown,
      gradient: total
        ? `conic-gradient(${gradientStops})`
        : "conic-gradient(#334155 0% 100%)",
    };
  }, [filteredTrades]);

  const orderTypePerformance = useMemo(() => {
    const map = new Map<
      Trade["orderType"],
      { pnl: number; trades: number; wins: number }
    >();

    filteredTrades.forEach((trade) => {
      const current = map.get(trade.orderType) ?? {
        pnl: 0,
        trades: 0,
        wins: 0,
      };
      current.pnl += trade.pnl;
      current.trades += 1;
      current.wins += trade.pnl > 0 ? 1 : 0;
      map.set(trade.orderType, current);
    });

    return Array.from(map.entries())
      .map(([orderType, stats]) => ({
        orderType,
        pnl: stats.pnl,
        trades: stats.trades,
        winRate: stats.trades ? stats.wins / stats.trades : 0,
      }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades]);

  const sessionPerformance = useMemo(() => {
    const map = new Map<Trade["session"], { pnl: number; trades: number }>();
    filteredTrades.forEach((trade) => {
      const current = map.get(trade.session) ?? { pnl: 0, trades: 0 };
      current.pnl += trade.pnl;
      current.trades += 1;
      map.set(trade.session, current);
    });

    return Array.from(map.entries()).map(([session, stats]) => ({
      session,
      pnl: stats.pnl,
      trades: stats.trades,
    }));
  }, [filteredTrades]);

  const timeBuckets = useMemo(() => {
    const buckets = [
      "00-04",
      "04-08",
      "08-12",
      "12-16",
      "16-20",
      "20-24",
    ];
    const bucketStats = buckets.map((label) => ({ label, pnl: 0 }));
    filteredTrades.forEach((trade) => {
      const index = Math.min(5, Math.floor(trade.entryHour / 4));
      bucketStats[index].pnl += trade.pnl;
    });
    const maxAbs = Math.max(
      1,
      ...bucketStats.map((bucket) => Math.abs(bucket.pnl)),
    );

    return bucketStats.map((bucket) => ({
      ...bucket,
      intensity: Math.abs(bucket.pnl) / maxAbs,
    }));
  }, [filteredTrades]);

  const pnlPositive = metrics.totalPnl >= 0;

  const filterSummary = `${filteredTrades.length} trades • ${dateRangeOptions.find((option) => option.value === dateRange)?.label ?? ""}`;

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-teal-500/20 blur-[140px]" />
        <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-amber-400/20 blur-[120px]" />
        <div className="absolute bottom-0 left-16 h-72 w-72 rounded-full bg-sky-500/10 blur-[110px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="chip">Deriverse Analytics</span>
              <div className="space-y-3">
                <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                  Trading intelligence, portfolio control, and a professional
                  journal in one on-chain workspace.
                </h1>
                <p className="max-w-2xl text-base text-slate-300">
                  Track total PnL, optimize directional bias, and audit every
                  decision with a secure, read-only dashboard built for active
                  Solana traders.
                </p>
              </div>
            </div>
            <div className="panel-soft flex flex-col gap-3 px-5 py-4 text-sm text-slate-200">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
                <span>On-chain sync healthy</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-xs text-slate-400">
                <span>Portfolio exposure</span>
                <span className="text-slate-200">$1.41M</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-xs text-slate-400">
                <span>Risk band</span>
                <span className="text-amber-200">Moderate leverage</span>
              </div>
            </div>
          </header>

          <section className="panel flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="stat-label">Symbol</p>
                <select
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100"
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
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100"
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
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500"
                  placeholder="Tags, trade id, or note keywords"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className="text-xs text-slate-400">{filterSummary}</div>
              <button className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Export report
              </button>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="panel p-5">
              <p className="stat-label">Total PnL</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="stat-value font-display">
                    {formatSignedCurrency(metrics.totalPnl)}
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
                  {pnlPositive ? "▲" : "▼"} {pnlPositive ? "+8.6%" : "-4.2%"}
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
                {metrics.totalTrades} trades • {metrics.longTrades} long /{" "}
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
                Fees {currencyFormatter.format(metrics.totalFees)} •{` `}
                {percentFormatter.format(
                  metrics.totalFees / Math.max(metrics.totalVolume, 1),
                )}{" "}
                rate
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
                Long/Short ratio {metrics.longShortRatio.toFixed(2)}x
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full bg-white/10 px-3 py-1">
                  Largest gain {currencyFormatter.format(metrics.largestGain)}
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
                        Math.max(
                          ...pnlSeries.map((point) => point.cumulative),
                          0,
                        ),
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
                    <span>Last session</span>
                    <span className="text-slate-200">
                      {dailyPerformance.length
                        ? dailyPerformance[dailyPerformance.length - 1].date
                        : "—"}
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
                          (metrics.avgWin / Math.max(metrics.avgLoss, 1)) * 50 +
                            30,
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
                        {item.trades} trades •{" "}
                        {percentFormatter.format(item.winRate)} win rate
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

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
                        <div className="mt-1 font-semibold text-slate-900">
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
                        (metrics.longTrades /
                          Math.max(metrics.totalTrades, 1)) *
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
                        (metrics.shortTrades /
                          Math.max(metrics.totalTrades, 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-4 text-xs text-slate-400">
                  Bias factor {metrics.longShortRatio.toFixed(2)}x • Maintain <span className="text-slate-200">0.8x - 1.4x</span> for neutral market regime.
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
                  <li>SLippage spikes on stop orders (last 3 stops).</li>
                  <li>Drawdown threshold at 65% of monthly limit.</li>
                  <li>Consider reducing size during US close.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-12">
            <div className="panel flex flex-col gap-6 p-6 lg:col-span-7">
              <div>
                <p className="stat-label">Portfolio analysis</p>
                <h2 className="font-display text-xl text-white">
                  Position health and allocation insight
                </h2>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/80 text-xs uppercase tracking-[0.2em] text-slate-400">
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
                  <tbody className="divide-y divide-white/5">
                    {portfolioPositions.map((position) => (
                      <tr key={position.symbol} className="bg-slate-950/40">
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-100">
                            {position.symbol}
                          </div>
                          <div className="text-xs text-slate-500">
                            {position.venue} • {percentFormatter.format(position.allocation)} alloc
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
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                            {position.risk}
                          </span>
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
                    {currencyFormatter.format(
                      portfolioPositions.reduce(
                        (sum, position) => sum + position.realized,
                        0,
                      ),
                    )}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Allocation drift: +3.2% to SOL
                  </p>
                </div>
              </div>
            </div>

            <div className="panel flex flex-col gap-6 p-6 lg:col-span-5">
              <div>
                <p className="stat-label">Compliance & security</p>
                <h2 className="font-display text-xl text-white">
                  Secure journal workflow
                </h2>
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
                <p className="stat-label">Journal objectives</p>
                <div className="mt-3 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Process adherence</span>
                    <span className="text-emerald-200">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rule violations</span>
                    <span className="text-rose-200">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Best setups</span>
                    <span className="text-slate-100">Breakouts</span>
                  </div>
                </div>
              </div>
              <div className="panel-soft p-4">
                <p className="stat-label">Actionable insight</p>
                <p className="mt-3 text-sm text-slate-300">
                  Limit orders outperform markets by 22% win rate. Route more
                  size through passive liquidity to lower taker costs.
                </p>
              </div>
            </div>
          </section>

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
                    <th className="px-4 py-3">Entry → Exit</th>
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
                          {trade.date} • {trade.session}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {trade.symbol}
                      </td>
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
                        {currencyFormatterPrecise.format(trade.entry)} →{" "}
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
        </div>
      </div>
    </div>
  );
}
