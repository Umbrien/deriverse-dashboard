import { NavLink, Outlet } from "react-router";
import { AnalyticsProvider } from "../contexts/analytics-context";
import { FilterBar } from "../components/FilterBar";

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

export default function DashboardLayout() {
  return (
    <AnalyticsProvider>
      <div className="min-h-screen">
        <div className="relative overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-teal-500/20 blur-[140px]" />
          <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-amber-400/20 blur-[120px]" />
          <div className="absolute bottom-0 left-16 h-72 w-72 rounded-full bg-sky-500/10 blur-[110px]" />

          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl gap-6 px-6 py-8">
            <aside className="hidden w-72 flex-col gap-6 lg:flex">
              <div className="panel-solid relative overflow-hidden p-5">
                <div className="absolute -right-12 top-0 h-24 w-24 rounded-full bg-emerald-400/20 blur-[60px]" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-200">
                    DV
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Deriverse</p>
                    <p className="text-xs text-slate-400">Trading Analytics</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
                  <span className="pill">On-chain verified</span>
                  <span className="pill">Read-only</span>
                </div>
              </div>

              <nav className="panel flex flex-col gap-2 p-3 text-sm">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `${
                        isActive ? "nav-link nav-link-active" : "nav-link"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="panel-soft p-4 text-xs text-slate-300">
                <p className="stat-label">Workspace snapshot</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Assets under management</span>
                    <span className="text-slate-100">$1.41M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Open risk</span>
                    <span className="text-amber-200">Moderate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weekly volatility</span>
                    <span className="text-slate-100">2.8%</span>
                  </div>
                </div>
              </div>

              <div className="panel-soft p-4 text-xs text-slate-300">
                <p className="stat-label">Security posture</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Wallet access</span>
                    <span className="text-emerald-200">Read-only</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data vault</span>
                    <span className="text-slate-100">Encrypted</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2FA</span>
                    <span className="text-emerald-200">Enabled</span>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex flex-1 flex-col gap-6">
              <header className="panel-solid flex flex-col gap-5 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Deriverse command center
                    </p>
                    <h1 className="font-display text-2xl text-white sm:text-3xl">
                      Institutional-grade trading intelligence.
                    </h1>
                    <p className="max-w-2xl text-sm text-slate-300">
                      Monitor portfolio health, trading performance, and
                      execution quality across spot, perps, and options.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="panel-soft p-4">
                      <p className="stat-label">Live strategies</p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        4 active books
                      </p>
                      <p className="text-xs text-slate-400">2 discretionary</p>
                    </div>
                    <div className="panel-soft p-4">
                      <p className="stat-label">System status</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                        On-chain sync healthy
                      </div>
                      <p className="mt-2 text-xs text-slate-400">Latency 120ms</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                  <div className="flex flex-wrap gap-2">
                    <span className="pill">Risk band: Moderate</span>
                    <span className="pill">Funding optimized</span>
                    <span className="pill">Execution score 8.7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                      New note
                    </button>
                    <button className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                      Export
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto text-xs lg:hidden">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        `rounded-full px-4 py-2 ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-slate-300"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </header>

              <FilterBar />

              <main className="pb-12">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </AnalyticsProvider>
  );
}
