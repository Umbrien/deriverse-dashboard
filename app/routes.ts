import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("",
    "routes/dashboard.tsx",
    [
      index("routes/dashboard/overview.tsx"),
      route("performance", "routes/dashboard/performance.tsx"),
      route("journal", "routes/dashboard/journal.tsx"),
      route("portfolio", "routes/dashboard/portfolio.tsx"),
    ],
  ),
] satisfies RouteConfig;
