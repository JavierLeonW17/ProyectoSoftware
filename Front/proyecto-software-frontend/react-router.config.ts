import type { Config } from "@react-router/dev/config";

// SPA: build estático en `build/client`. Para reactivar SSR ver context.md §10.
export default {
  ssr: false,
} satisfies Config;
