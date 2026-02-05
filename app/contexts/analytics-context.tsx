import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { trades, dateRangeOptions, type Trade } from "../data/trades";
import { buildLinePath } from "../utils/chart";

export type FeeBreakdownItem = {
  label: "Maker" | "Taker" | "Funding";
  value: number;
  color: string;
};

type AnalyticsContextValue = {
  selectedSymbol: string;
  dateRange: string;
  query: string;
  setSelectedSymbol: (value: string) => void;
  setDateRange: (value: string) => void;
  setQuery: (value: string) => void;
  symbols: string[];
  filterSummary: string;
  filteredTrades: Trade[];
  metrics: {
    totalTrades: number;
    grossPnl: number;
    netPnl: number;
    totalVolume: number;
    totalFees: number;
    feeRate: number;
    winRate: number;
    avgDuration: number;
    longTrades: number;
    shortTrades: number;
    longShortRatio: number;
    largestGain: number;
    largestLoss: number;
    avgWin: number;
    avgLoss: number;
    profitFactor: number;
    expectancy: number;
  };
  dailyPerformance: Array<{ date: string; pnl: number }>;
  pnlSeries: Array<{
    date: string;
    pnl: number;
    cumulative: number;
    drawdown: number;
  }>;
  pnlDomain: { min: number; max: number };
  linePath: string;
  drawdownPath: string;
  maxDrawdown: number;
  feeBreakdown: {
    total: number;
    breakdown: FeeBreakdownItem[];
    gradient: string;
  };
  orderTypePerformance: Array<{
    orderType: Trade["orderType"];
    pnl: number;
    trades: number;
    winRate: number;
  }>;
  sessionPerformance: Array<{
    session: Trade["session"];
    pnl: number;
    trades: number;
  }>;
  timeBuckets: Array<{ label: string; pnl: number; intensity: number }>;
};

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(
  undefined,
);

function getLatestTradeDate() {
  const maxTimestamp = Math.max(
    ...trades.map((trade) => new Date(trade.date).getTime()),
  );
  return new Date(maxTimestamp);
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [selectedSymbol, setSelectedSymbol] = useState("All");
  const [dateRange, setDateRange] = useState("30D");
  const [query, setQuery] = useState("");

  const latestTradeDate = useMemo(() => getLatestTradeDate(), []);

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
    const grossPnl = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const totalVolume = filteredTrades.reduce(
      (sum, trade) => sum + trade.volume,
      0,
    );
    const totalFees = filteredTrades.reduce(
      (sum, trade) => sum + trade.fees + trade.funding,
      0,
    );
    const netPnl = grossPnl - totalFees;
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
    const feeRate = totalFees / Math.max(totalVolume, 1);

    return {
      totalTrades,
      grossPnl,
      netPnl,
      totalVolume,
      totalFees,
      feeRate,
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
      const net = trade.pnl - trade.fees - trade.funding;
      map.set(trade.date, (map.get(trade.date) ?? 0) + net);
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
    const breakdown: FeeBreakdownItem[] = [
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

  const filterSummary = `${filteredTrades.length} trades - ${
    dateRangeOptions.find((option) => option.value === dateRange)?.label ?? ""
  }`;

  const value: AnalyticsContextValue = {
    selectedSymbol,
    dateRange,
    query,
    setSelectedSymbol,
    setDateRange,
    setQuery,
    symbols,
    filterSummary,
    filteredTrades,
    metrics,
    dailyPerformance,
    pnlSeries,
    pnlDomain,
    linePath,
    drawdownPath,
    maxDrawdown,
    feeBreakdown,
    orderTypePerformance,
    sessionPerformance,
    timeBuckets,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
}
