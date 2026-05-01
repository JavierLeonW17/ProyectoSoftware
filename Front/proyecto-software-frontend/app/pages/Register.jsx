import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { authService } from "../services";

const TIPOS_DOCUMENTO = [
  { value: "CC", label: "CC · Cédula de ciudadanía" },
  { value: "CE", label: "CE · Cédula de extranjería" },
  { value: "TI", label: "TI · Tarjeta de identidad" },
  { value: "PAS", label: "PAS · Pasaporte" },
  { value: "NIT", label: "NIT" },
];

const initialForm = {
  nombres: "",
  apellidos: "",
  tipoDocumento: "CC",
  numeroDocumento: "",
  correo: "",
  telefono: "",
  contrasena: "",
  confirmarContrasena: "",
};

function passwordStrength(pwd) {
  if (!pwd) return { score: 0, label: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["", "Muy débil", "Débil", "Buena", "Fuerte"];
  return { score, label: labels[score] };
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const strength = useMemo(
    () => passwordStrength(form.contrasena),
    [form.contrasena]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (form.contrasena !== form.confirmarContrasena) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }
    if (!acceptTerms) {
      setErrorMsg("Debes aceptar los términos y condiciones");
      return;
    }
    if (strength.score < 3) {
      setErrorMsg(
        "La contraseña es muy débil: usa al menos 8 caracteres, mayúsculas y números"
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        contrasena: form.contrasena,
        tipoDocumento: form.tipoDocumento,
        numeroDocumento: form.numeroDocumento,
        telefono: form.telefono,
      };
      const { data } = await authService.register(payload);
      setSuccessMsg(
        data?.message ||
          "Cuenta creada. Revisa tu correo para verificar la cuenta."
      );
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "No fue posible crear la cuenta"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-zinc-900">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-8 h-[72px]">
          <Link to="/auth/login" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <span className="text-base font-bold text-zinc-900">
              TicketHub
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-zinc-500">
              ¿Ya tienes cuenta?
            </span>
            <Link
              to="/auth/login"
              className="h-8 px-4 inline-flex items-center rounded-md border border-primary text-primary text-sm font-semibold hover:bg-primary-faint transition"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Card */}
      <main className="px-6 py-10 flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-zinc-200 shadow-sm p-10">
          <h1 className="text-2xl font-bold text-center text-zinc-900">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-center text-zinc-500">
            Completa los siguientes campos para registrarte
          </p>

          {errorMsg && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Nombres + Apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Nombres"
                name="nombres"
                value={form.nombres}
                onChange={onChange}
                placeholder="Brayan Alexis"
                required
                maxLength={80}
              />
              <Field
                label="Apellidos"
                name="apellidos"
                value={form.apellidos}
                onChange={onChange}
                placeholder="Cañas Londoño"
                required
                maxLength={80}
              />
            </div>

            {/* Tipo + Número documento */}
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Tipo
                </label>
                <select
                  name="tipoDocumento"
                  value={form.tipoDocumento}
                  onChange={onChange}
                  className="w-full h-11 px-3 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                >
                  {TIPOS_DOCUMENTO.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.value}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Número de documento"
                name="numeroDocumento"
                value={form.numeroDocumento}
                onChange={onChange}
                placeholder="1234567890"
                maxLength={20}
              />
            </div>

            {/* Correo */}
            <Field
              label="Correo electrónico"
              type="email"
              name="correo"
              value={form.correo}
              onChange={onChange}
              placeholder="tucorreo@empresa.com"
              required
              maxLength={120}
            />

            {/* Teléfono */}
            <Field
              label="Teléfono"
              name="telefono"
              value={form.telefono}
              onChange={onChange}
              placeholder="+57 300 000 0000"
              maxLength={20}
            />

            {/* Contraseñas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Contraseña"
                type="password"
                name="contrasena"
                value={form.contrasena}
                onChange={onChange}
                placeholder="••••••••"
                required
                minLength={8}
              />
              <Field
                label="Confirmar contraseña"
                type="password"
                name="confirmarContrasena"
                value={form.confirmarContrasena}
                onChange={onChange}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            {/* Indicador de fuerza */}
            <div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${strengthBarClass(strength.score, i)}`}
                  />
                ))}
              </div>
              {strength.label && (
                <p className="mt-2 text-[11px] text-zinc-500">
                  Fuerza: {strength.label} · 8+ caracteres, mayúsculas y números
                </p>
              )}
            </div>

            {/* Términos */}
            <label className="flex items-start gap-2 text-sm text-zinc-700 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary/40"
              />
              <span>
                Acepto los{" "}
                <a className="font-semibold text-primary hover:underline" href="#">
                  términos y condiciones
                </a>{" "}
                y la{" "}
                <a className="font-semibold text-primary hover:underline" href="#">
                  política de privacidad
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creando cuenta…" : "Crear cuenta"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, name, ...rest }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-zinc-700 mb-1.5"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...rest}
        className="w-full h-11 px-4 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
      />
    </div>
  );
}

function strengthBarClass(score, index) {
  if (index > score) return "bg-zinc-200";
  if (score <= 1) return "bg-red-500";
  if (score === 2) return "bg-amber-500";
  if (score === 3) return "bg-success";
  return "bg-success";
}
