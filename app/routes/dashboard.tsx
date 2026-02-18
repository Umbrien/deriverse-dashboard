import { NavLink, Outlet } from "react-router";
import { AnalyticsProvider, useAnalytics } from "../contexts/analytics-context";
import { FilterBar } from "../components/FilterBar";
import {
  compactFormatter,
  currencyFormatter,
  percentFormatter,
} from "../utils/format";

const navItems = [
  {
    label: "Overview",
    to: "/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path
          d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Performance",
    to: "/performance",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path
          d="M4 18h16M6.5 16V8.5M12 16V6M17.5 16V10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Journal",
    to: "/journal",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path
          d="M6 4.5h9.5a2 2 0 0 1 2 2V19a1 1 0 0 1-1.6.8L13 17H6a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Portfolio",
    to: "/portfolio",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path
          d="M4 7.5h16a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 16v-7A1.5 1.5 0 0 1 4 7.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M16 12h3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

function DashboardShell() {
  const { metrics, filterSummary } = useAnalytics();

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-teal-500/20 blur-[140px]" />
        <div className="absolute top-44 right-8 h-80 w-80 rounded-full bg-amber-400/20 blur-[120px]" />
        <div className="absolute bottom-0 left-14 h-72 w-72 rounded-full bg-sky-500/12 blur-[110px]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <aside className="hidden w-72 flex-col gap-6 xl:flex">
            <div className="panel-solid relative overflow-hidden p-5 animate-fade-up">
              <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-emerald-400/25 blur-[60px]" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-400/18 font-semibold text-emerald-100">
                  DV
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Deriverse</p>
                  <p className="text-xs text-slate-400">Analytics Command</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="pill">On-chain verified</span>
                <span className="pill">Read-only</span>
              </div>
            </div>

            <nav className="panel flex flex-col gap-2 p-3 text-sm animate-fade-up">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `${isActive ? "nav-link nav-link-active" : "nav-link"}`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="panel-soft p-4 text-xs text-slate-300 animate-fade-up">
              <p className="stat-label">Current Filter Snapshot</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span>Scope</span>
                  <span className="text-slate-100">{filterSummary}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Net PnL</span>
                  <span
                    className={
                      metrics.netPnl >= 0 ? "text-emerald-200" : "text-rose-200"
                    }
                  >
                    {currencyFormatter.format(metrics.netPnl)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Win Rate</span>
                  <span className="text-slate-100">
                    {percentFormatter.format(metrics.winRate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="panel-soft p-4 text-xs text-slate-300 animate-fade-up">
              <p className="stat-label">Execution & Security</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span>Volume</span>
                  <span className="text-slate-100">
                    {compactFormatter.format(metrics.totalVolume)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fee rate</span>
                  <span className="text-amber-200">
                    {percentFormatter.format(metrics.feeRate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data vault</span>
                  <span className="text-emerald-200">Encrypted</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wallet permission</span>
                  <span className="text-slate-100">Read-only API</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex flex-1 flex-col gap-6">
            <header className="panel-solid flex flex-col gap-5 p-5 sm:p-6 animate-fade-up">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.34em] text-slate-400">
                    Deriverse Trading Analytics
                  </p>
                  <h1 className="font-display text-2xl text-white sm:text-3xl">
                    Professional journal, portfolio, and execution intelligence.
                  </h1>
                  <p className="max-w-3xl text-sm text-slate-300">
                    Analyze PnL, risk, directional bias, fees, and order quality
                    across spot, perpetuals, and options from one unified desk.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="panel-soft p-4">
                    <p className="stat-label">Net PnL</p>
                    <p
                      className={`mt-2 text-xl font-semibold ${
                        metrics.netPnl >= 0 ? "text-emerald-200" : "text-rose-200"
                      }`}
                    >
                      {currencyFormatter.format(metrics.netPnl)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {metrics.totalTrades} trades in scope
                    </p>
                  </div>
                  <div className="panel-soft p-4">
                    <p className="stat-label">Execution Quality</p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {percentFormatter.format(metrics.winRate)}
                    </p>
                    <p className="text-xs text-slate-400">
                      Win rate | fee {percentFormatter.format(metrics.feeRate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex flex-wrap gap-2">
                  <span className="pill">Risk band: Moderate</span>
                  <span className="pill">Session analytics enabled</span>
                  <span className="pill">Journal autosave local</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                    Sync notes
                  </button>
                  <button className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto text-xs xl:hidden">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `rounded-full border px-4 py-2 ${
                        isActive
                          ? "border-emerald-300/30 bg-emerald-400/10 text-white"
                          : "border-white/10 text-slate-300"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </header>

            <FilterBar />

            <main className="pb-12 animate-fade-up">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <AnalyticsProvider>
      <DashboardShell />
    </AnalyticsProvider>
  );
}
