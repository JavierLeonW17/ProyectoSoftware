import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ticketsService } from "../services";

// TODO: reemplazar por GET /api/categorias cuando el backend lo exponga.
// Los IDs deben coincidir con los registros sembrados en la tabla `categorias`.
const CATEGORIAS_FALLBACK = [
  { id: 1, nombre: "Hardware" },
  { id: 2, nombre: "Software" },
  { id: 3, nombre: "Red e internet" },
  { id: 4, nombre: "Cuentas y accesos" },
  { id: 5, nombre: "Otros" },
];

const TIPOS = [
  { value: "problema", label: "Problema" },
  { value: "solicitud", label: "Solicitud" },
  { value: "consulta", label: "Consulta" },
];

const PRIORIDADES = [
  {
    value: "alta",
    label: "Alta — Afecta operación crítica",
    dot: "bg-red-500",
  },
  {
    value: "media",
    label: "Media — Impacta el trabajo diario",
    dot: "bg-amber-500",
  },
  {
    value: "baja",
    label: "Baja — No impide continuar",
    dot: "bg-success",
  },
];

const DESCRIPCION_MAX = 1000;

export default function CrearTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    asunto: "",
    tipo: "problema",
    categoriaId: "",
    prioridad: "media",
    descripcion: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    if (errorMsg) setErrorMsg("");
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const slaCard = useMemo(() => buildSlaCard(form.prioridad), [form.prioridad]);
  const charsLeft = form.descripcion.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.categoriaId) {
      setErrorMsg("Selecciona una categoría");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        asunto: form.asunto.trim(),
        descripcion: form.descripcion.trim(),
        tipo: form.tipo,
        prioridad: form.prioridad,
        categoriaId: Number(form.categoriaId),
      };
      const { data } = await ticketsService.crear(payload);
      const codigo = data?.data?.codigo;
      navigate("/", {
        state: codigo ? { mensajeExito: `Ticket ${codigo} creado` } : null,
      });
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "No fue posible crear el ticket"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <nav className="text-xs text-zinc-400">
          <Link to="/" className="hover:text-zinc-700">
            Inicio
          </Link>
          <span className="mx-1.5">›</span>
          <span className="hover:text-zinc-700 cursor-default">Tickets</span>
          <span className="mx-1.5">›</span>
          <span className="text-zinc-900 font-medium">Crear ticket</span>
        </nav>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">
          Crear nuevo ticket
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white border border-zinc-200 p-8 space-y-6"
        >
          <div>
            <h2 className="text-base font-bold text-zinc-900">
              Información del ticket
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Describe tu problema con el mayor detalle posible para una
              atención más rápida.
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <Field label="Asunto" required htmlFor="asunto">
            <input
              id="asunto"
              name="asunto"
              type="text"
              required
              maxLength={200}
              value={form.asunto}
              onChange={onChange}
              placeholder="Ej: No puedo acceder al servidor de archivos"
              className={inputClass}
            />
          </Field>

          <Field label="Tipo de ticket" required>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TIPOS.map((t) => (
                <RadioCard
                  key={t.value}
                  name="tipo"
                  value={t.value}
                  checked={form.tipo === t.value}
                  onChange={onChange}
                  label={t.label}
                />
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Categoría" required htmlFor="categoriaId">
              <select
                id="categoriaId"
                name="categoriaId"
                required
                value={form.categoriaId}
                onChange={onChange}
                className={inputClass}
              >
                <option value="">Selecciona una categoría…</option>
                {CATEGORIAS_FALLBACK.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Prioridad" htmlFor="prioridad">
              <select
                id="prioridad"
                name="prioridad"
                value={form.prioridad}
                onChange={onChange}
                className={inputClass}
              >
                {PRIORIDADES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Descripción" required htmlFor="descripcion">
            <textarea
              id="descripcion"
              name="descripcion"
              required
              rows={6}
              maxLength={DESCRIPCION_MAX}
              value={form.descripcion}
              onChange={onChange}
              placeholder="Cuenta cuándo empezó, qué intentaste y cómo afecta tu trabajo."
              className={`${inputClass} h-auto resize-y`}
            />
            <p className="mt-1 text-[11px] text-zinc-400 text-right">
              {charsLeft} / {DESCRIPCION_MAX} caracteres
            </p>
          </Field>

          <Field label="Adjuntos (opcional)">
            <button
              type="button"
              onClick={() =>
                alert(
                  "Adjuntos — próximamente. El backend aún no soporta este flujo."
                )
              }
              className="w-full rounded-lg border-2 border-dashed border-zinc-300 bg-[#F9FAFB] py-8 text-center hover:bg-zinc-100 transition"
            >
              <div className="mx-auto w-6 h-6 mb-2">
                <IconUpload />
              </div>
              <p className="text-sm font-medium text-zinc-700">
                Arrastra archivos aquí o{" "}
                <span className="font-semibold text-primary">
                  selecciona desde tu equipo
                </span>
              </p>
              <p className="mt-1 text-[11px] text-zinc-400">
                PNG, JPG, PDF — Máx. 10MB por archivo
              </p>
            </button>
          </Field>

          <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="h-11 px-5 rounded-lg border border-zinc-300 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() =>
                alert("Borradores — próximamente. El backend aún no los soporta.")
              }
              className="h-11 px-5 rounded-lg border border-zinc-300 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
            >
              Guardar borrador
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 px-6 rounded-lg bg-primary hover:bg-primary-light text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creando…" : "Crear ticket"}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <section className="rounded-xl bg-white border border-zinc-200 p-6">
            <h3 className="text-base font-bold text-zinc-900">
              Recomendaciones
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700">
              {RECOMENDACIONES.map((r) => (
                <li key={r} className="flex items-start gap-2.5">
                  <CheckBadge />
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            <hr className="my-5 border-zinc-200" />

            <h4 className="text-sm font-bold text-zinc-900">SLA estimado</h4>
            <div className={`mt-3 rounded-lg p-3 ${slaCard.bg}`}>
              <p className={`text-xs ${slaCard.fg}`}>
                Prioridad:{" "}
                <span className="font-bold uppercase">{form.prioridad}</span>
              </p>
              <p className={`mt-1 text-[11px] ${slaCard.fg}`}>
                Tiempo de respuesta esperado:
              </p>
              <p className={`mt-1 text-sm font-bold ${slaCard.fg}`}>
                {slaCard.tiempo}
              </p>
            </div>

            <hr className="my-5 border-zinc-200" />

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Tu ticket será asignado automáticamente a un agente del área
              correspondiente.
            </p>
          </section>

          <section className="rounded-xl bg-white border border-zinc-200 p-6">
            <h3 className="text-base font-bold text-zinc-900">
              ¿Tu problema es similar a…?
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Soluciones de la base de conocimiento
            </p>

            <div className="mt-4 space-y-3">
              {KB_SUGERENCIAS.map((s) => (
                <KbCard key={s.titulo} {...s} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const RECOMENDACIONES = [
  "Sé claro con el asunto del problema",
  "Incluye pasos para reproducir el error",
  "Adjunta capturas o logs si es posible",
  "Selecciona la prioridad correcta",
];

const KB_SUGERENCIAS = [
  {
    titulo: "Acceso denegado a archivos",
    descripcion: "Verifica los permisos de carpeta",
  },
  {
    titulo: "Reconectar VPN corporativa",
    descripcion: "Pasos para restablecer la sesión",
  },
  {
    titulo: "Solicitar permiso a recurso",
    descripcion: "Cómo solicitar acceso a una carpeta",
  },
];

function buildSlaCard(prioridad) {
  switch (prioridad) {
    case "alta":
      return {
        bg: "bg-red-50",
        fg: "text-red-900",
        tiempo: "≤ 4 horas hábiles",
      };
    case "baja":
      return {
        bg: "bg-green-50",
        fg: "text-green-900",
        tiempo: "≤ 24 horas hábiles",
      };
    case "media":
    default:
      return {
        bg: "bg-amber-50",
        fg: "text-amber-900",
        tiempo: "≤ 8 horas hábiles",
      };
  }
}

const inputClass =
  "w-full h-11 px-4 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition";

function Field({ label, required, htmlFor, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-zinc-700 mb-1.5"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}

function RadioCard({ name, value, checked, onChange, label }) {
  return (
    <label
      className={`flex items-center gap-3 px-4 h-11 rounded-lg border cursor-pointer transition ${
        checked
          ? "bg-primary-faint border-primary"
          : "bg-white border-zinc-300 hover:border-zinc-400"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`relative w-4 h-4 rounded-full border-2 flex-shrink-0 ${
          checked ? "border-primary" : "border-zinc-400"
        }`}
      >
        {checked && (
          <span className="absolute inset-1 rounded-full bg-primary" />
        )}
      </span>
      <span
        className={`text-sm ${
          checked ? "font-semibold text-zinc-900" : "text-zinc-700"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function CheckBadge() {
  return (
    <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-success flex items-center justify-center shrink-0">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6 l3 3 l5 -6" />
      </svg>
    </span>
  );
}

function KbCard({ titulo, descripcion }) {
  return (
    <div className="rounded-lg bg-[#F9FAFB] p-4">
      <p className="text-sm font-semibold text-zinc-900">{titulo}</p>
      <p className="mt-1 text-xs text-zinc-500">{descripcion}</p>
      <button
        type="button"
        onClick={() => alert("Base de conocimiento — próximamente.")}
        className="mt-2 text-[11px] font-semibold text-primary hover:text-primary-light"
      >
        Leer artículo →
      </button>
    </div>
  );
}

function IconUpload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-zinc-400">
      <path d="M12 3 v14 M5 10 l7 -7 l7 7" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </svg>
  );
}
