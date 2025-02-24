import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: ":slug", file: "routes/$slug.tsx" }
] satisfies RouteConfig;
