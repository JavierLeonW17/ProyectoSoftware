import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div className="relative">
        <h1 className="text-[10rem] font-black text-zinc-200 select-none leading-none tracking-tighter">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-zinc-900 mb-2">
            Página no encontrada
          </div>
          <div className="text-sm text-zinc-500 font-medium">
            La ruta que buscabas no existe o aún está en construcción.
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to="/"
          className="px-6 h-11 inline-flex items-center rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition"
        >
          Regresar al inicio
        </Link>
        <button
          onClick={() => globalThis.history.back()}
          className="px-6 h-11 rounded-lg border border-zinc-300 text-zinc-700 font-semibold hover:bg-zinc-50 transition"
        >
          Anterior
        </button>
      </div>
    </div>
  );
}
