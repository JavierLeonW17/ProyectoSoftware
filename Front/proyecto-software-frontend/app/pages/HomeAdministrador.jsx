import { useAuth } from "../contexts/AuthContext";

// Placeholder hasta tener un SVG dedicado para esta vista.
export default function HomeAdministrador() {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <header>
        <span className="inline-block px-3 py-1 rounded-full bg-fuchsia-100 text-fuchsia-700 text-xs font-semibold tracking-wider uppercase">
          Administrador
        </span>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900">
          Hola, {user?.nombres || "Admin"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tienes el control total del sistema: usuarios, roles, áreas y SLA.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Usuarios" hint="Gestionar cuentas y roles" />
        <Card title="Áreas y empresas" hint="Configurar la organización" />
        <Card title="Reglas SLA" hint="Definir tiempos por prioridad" />
      </section>
    </div>
  );
}

function Card({ title, hint }) {
  return (
    <div className="rounded-xl bg-white border border-zinc-200 p-5 hover:border-fuchsia-200 transition">
      <p className="text-base font-semibold text-zinc-900">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{hint}</p>
    </div>
  );
}
