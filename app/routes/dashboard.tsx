import { NavLink, Outlet } from "react-router";
import { AnalyticsProvider } from "../contexts/analytics-context";
import { FilterBar } from "../components/FilterBar";

const navItems = [
  { label: "Overview", to: "/" },
  { label: "Performance", to: "/performance" },
  { label: "Journal", to: "/journal" },
  { label: "Portfolio", to: "/portfolio" },
];

export default function DashboardLayout() {
  return (
    <AnalyticsProvider>
      <div className="min-h-screen">
        <div className="relative overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-teal-500/20 blur-[140px]" />
          <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-amber-400/20 blur-[120px]" />
          <div className="absolute bottom-0 left-16 h-72 w-72 rounded-full bg-sky-500/10 blur-[110px]" />

          <div className="relative mx-auto flex min-h-screen max-w-7xl gap-6 px-6 py-8">
            <aside className="hidden w-64 flex-col gap-6 lg:flex">
              <div className="panel-soft p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200">
                    DV
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Deriverse</p>
                    <p className="text-xs text-slate-400">Trading Analytics</p>
                  </div>
                </div>
              </div>
              <nav className="panel flex flex-col gap-2 p-4 text-sm">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 transition ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-slate-300 hover:bg-white/5"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="panel-soft p-4 text-xs text-slate-300">
                <p className="stat-label">System status</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>On-chain sync</span>
                    <span className="text-emerald-200">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Latency</span>
                    <span className="text-slate-100">120ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Risk band</span>
                    <span className="text-amber-200">Moderate</span>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex flex-1 flex-col gap-6">
              <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Deriverse analytics suite
                    </p>
                    <h1 className="font-display text-2xl text-white sm:text-3xl">
                      Institutional-grade trading intelligence.
                    </h1>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      4 strategies live
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Read-only mode
                    </span>
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
