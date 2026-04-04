import { Link } from "react-router";

/**
 * Custom 404 Page (Not Found).
 * Styled with a cinematic feel.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
      <div className="relative">
        <h1 className="text-[10rem] font-black text-white/5 select-none leading-none tracking-tighter">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white mb-2">
            Página No Encontrada
          </div>
          <div className="text-zinc-500 font-medium">
            Parece que te has perdido en el espacio profundo.
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Link
          to="/"
          className="px-8 py-3 bg-white text-zinc-950 font-bold rounded-full hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-95"
        >
          Regresar al Inicio
        </Link>
        <button
          onClick={() => globalThis.history.back()}
          className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-full border border-zinc-800 hover:bg-zinc-800 transition-all active:scale-95"
        >
          Anterior
        </button>
      </div>

      <div className="pt-20">
        <div className="w-1 h-20 bg-linear-to-b from-indigo-500 to-transparent mx-auto rounded-full blur-sm"></div>
      </div>
    </div>
  );
}
