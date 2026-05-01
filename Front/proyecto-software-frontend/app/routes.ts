import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  route("auth/login", "pages/Login.jsx"),
  route("auth/register", "pages/Register.jsx"),
  route("auth/verify-email", "pages/VerifyEmail.jsx"),
  route("auth/reset-password", "pages/ResetPassword.jsx"),

  layout("layouts/MainLayout.jsx", [
    index("pages/Home.jsx"),
    route("tickets/nuevo", "pages/CrearTicket.jsx"),
    route("*", "pages/NotFound.jsx"),
  ]),
] satisfies RouteConfig;
