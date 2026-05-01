import { useAuth } from "../contexts/AuthContext";

// Placeholder hasta tener un SVG dedicado para esta vista.
export default function HomeAgente() {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <header>
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wider uppercase">
          Agente
        </span>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900">
          Hola, {user?.nombres || "Agente"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Atiende los tickets asignados y mantén los SLA bajo control.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Mi bandeja" hint="Tickets asignados a ti" />
        <Card title="En riesgo de SLA" hint="Atiéndelos antes que venzan" />
        <Card title="Base de conocimiento" hint="Artículos para ayudarte" />
      </section>
    </div>
  );
}

function Card({ title, hint }) {
  return (
    <div className="rounded-xl bg-white border border-zinc-200 p-5 hover:border-indigo-200 transition">
      <p className="text-base font-semibold text-zinc-900">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{hint}</p>
    </div>
  );
}
