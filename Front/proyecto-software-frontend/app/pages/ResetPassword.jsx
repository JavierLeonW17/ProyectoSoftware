import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { authService } from "../services";

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

function strengthBarClass(score, index) {
  if (index > score) return "bg-zinc-200";
  if (score <= 1) return "bg-red-500";
  if (score === 2) return "bg-amber-500";
  return "bg-success";
}

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = useMemo(
    () => passwordStrength(nuevaContrasena),
    [nuevaContrasena]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (nuevaContrasena !== confirmar) {
      setErrorMsg("Las contraseñas no coinciden");
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
      await authService.resetPassword({ token, nuevaContrasena });
      setSuccess(true);
      setTimeout(() => navigate("/auth/login"), 2500);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "No fue posible restablecer la contraseña. El enlace puede haber expirado."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F9FAFB] font-sans text-zinc-900">
      <Link to="/auth/login" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-white text-lg font-bold">T</span>
        </div>
        <span className="text-lg font-bold">TicketHub</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-sm p-10">
        {!token ? (
          <MissingTokenCard />
        ) : success ? (
          <SuccessCard />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-zinc-900 text-center">
              Restablecer contraseña
            </h1>
            <p className="mt-2 text-sm text-zinc-500 text-center">
              Crea una contraseña nueva para tu cuenta.
            </p>

            {errorMsg && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <PasswordField
                id="nuevaContrasena"
                label="Nueva contraseña"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                visible={showPwd}
                onToggleVisibility={() => setShowPwd((v) => !v)}
              />

              <PasswordField
                id="confirmar"
                label="Confirmar contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                visible={showPwd}
              />

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
                    Fuerza: {strength.label} · 8+ caracteres, mayúsculas y
                    números
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Guardando…" : "Guardar contraseña nueva"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              <Link
                to="/auth/login"
                className="font-semibold text-primary hover:text-primary-light"
              >
                Volver al inicio de sesión
              </Link>
            </p>
          </>
        )}
      </div>

      <p className="mt-8 text-xs text-zinc-400">
        © 2026 TicketHub · Corporación Universitaria Iberoamericana
      </p>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, visible, onToggleVisibility }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-700 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          required
          minLength={8}
          maxLength={100}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full h-11 pl-4 pr-11 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
        />
        {onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-700"
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12 L10 17 L19 7"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-zinc-900">
        Contraseña actualizada
      </h1>
      <p className="mt-3 text-sm text-zinc-500">
        Ya puedes iniciar sesión con tu nueva contraseña. Te llevamos al login
        en unos segundos.
      </p>
      <Link
        to="/auth/login"
        className="mt-6 inline-flex items-center justify-center w-full h-12 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition"
      >
        Ir a iniciar sesión
      </Link>
    </div>
  );
}

function MissingTokenCard() {
  return (
    <div className="text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6 L18 18 M18 6 L6 18"
            stroke="#EF4444"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-zinc-900">
        Enlace incompleto
      </h1>
      <p className="mt-3 text-sm text-zinc-500">
        Falta el token de restablecimiento. Abre el enlace que recibiste por
        correo o solicita uno nuevo.
      </p>
      <Link
        to="/auth/login"
        className="mt-6 inline-flex items-center justify-center w-full h-12 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition"
      >
        Volver al inicio de sesión
      </Link>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 9 C4 3, 14 3, 17 9 C14 15, 4 15, 1 9 Z" />
      <circle cx="9" cy="9" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 9 C4 5, 7 4, 9 4 M16 9 C14 13, 11 14, 9 14" />
      <path d="M2 2 L16 16" />
    </svg>
  );
}
