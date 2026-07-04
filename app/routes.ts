import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

const devRoutes = import.meta.env.DEV ? prefix("dev", [route("components", "dev/components.tsx")]) : [];

export default [
  layout("components/layout/app-layout.tsx", [
    index("routes/home.tsx"),
    route("donate", "routes/donate.tsx"),
    route("recipients", "routes/recipients.tsx"),
    route("track", "routes/track.tsx"),
  ]),
  ...devRoutes,
] satisfies RouteConfig;
