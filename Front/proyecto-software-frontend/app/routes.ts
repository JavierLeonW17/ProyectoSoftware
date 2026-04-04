import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

/**
 * React Router v7 Route Configuration (Simplified).
 * Minimal setup with Home and NotFound.
 */
export default [
  layout("layouts/MainLayout.jsx", [
    index("pages/Home.jsx"),

    // Catch-all route for 404
    route("*", "pages/NotFound.jsx"),
  ]),
] satisfies RouteConfig;
