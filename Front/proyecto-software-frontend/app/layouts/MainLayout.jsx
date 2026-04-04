import { Outlet, Link, useLocation } from "react-router";

/**
 * Main Layout with persistent menu/sidebar and dynamic content.
 * Styled with Tailwind v4 for a premium aesthetic.
 */
export default function MainLayout() {
  const location = useLocation();

  const navItems = [{ name: "Inicio", path: "/" }];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 font-sans text-zinc-100">
      {/* Sidebar/Menu (Persistent) */}
      <nav className="w-72 bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800 flex flex-col p-6 space-y-8 glass shadow-2xl">
        <div className="flex items-center space-x-3 mb-4 group cursor-pointer">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Proyecto
          </h1>
        </div>

        <div className="flex-1 flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-3 rounded-xl flex items-center space-x-3 transition-all duration-250 hover:bg-white/5 active:scale-95 ${
                location.pathname === item.path
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30"
                  : "text-zinc-400"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${location.pathname === item.path ? "bg-indigo-400" : "bg-transparent"}`}
              ></div>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-500 font-medium tracking-wider uppercase">
          Usuario Autenticado
        </div>
      </nav>

      {/* Dynamic Content Center Area */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-[radial-gradient(circle_at_25%_25%,rgba(63,63,70,0.1),transparent)]">
        <div className="p-12 max-w-6xl mx-auto animate-fade-in relative z-10">
          <Outlet />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      </main>
    </div>
  );
}
