/**
 * Home Page (Inicio).
 * Simple welcome view.
 */
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <h1 className="text-6xl font-black bg-linear-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
        Hola
      </h1>
      <p className="text-zinc-500 font-medium tracking-wide">
        Tu proyecto está listo y configurado.
      </p>
    </div>
  );
}
