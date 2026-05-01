import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { authService } from "../services";

const STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  MISSING: "missing",
};

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState(token ? STATUS.LOADING : STATUS.MISSING);
  const [message, setMessage] = useState("");
  // StrictMode monta dos veces en dev: sin este guard la verificación se llama 2×.
  const calledRef = useRef(false);

  useEffect(() => {
    if (!token || calledRef.current) return;
    calledRef.current = true;

    (async () => {
      try {
        const { data } = await authService.verifyEmail(token);
        setMessage(data?.message || "Correo verificado correctamente");
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        setMessage(
          err?.response?.data?.message ||
            "El enlace de verificación es inválido o ha expirado"
        );
        setStatus(STATUS.ERROR);
      }
    })();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F9FAFB] font-sans text-zinc-900">
      <Link to="/auth/login" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-white text-lg font-bold">T</span>
        </div>
        <span className="text-lg font-bold">TicketHub</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-sm p-10 text-center">
        <StatusIcon status={status} />

        <h1 className="mt-6 text-2xl font-bold text-zinc-900">
          {titleFor(status)}
        </h1>
        <p className="mt-3 text-sm text-zinc-500">{descriptionFor(status, message)}</p>

        <div className="mt-8">
          {status === STATUS.SUCCESS && (
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center w-full h-12 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition"
            >
              Ir a iniciar sesión
            </Link>
          )}
          {status === STATUS.ERROR && (
            <div className="space-y-3">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center w-full h-12 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition"
              >
                Volver al inicio de sesión
              </Link>
              <Link
                to="/auth/register"
                className="inline-flex items-center justify-center w-full h-12 rounded-lg border border-zinc-300 text-zinc-700 font-semibold hover:bg-zinc-50 transition"
              >
                Registrarme de nuevo
              </Link>
            </div>
          )}
          {status === STATUS.MISSING && (
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center w-full h-12 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition"
            >
              Ir al inicio de sesión
            </Link>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-zinc-400">
        © 2026 TicketHub · Corporación Universitaria Iberoamericana
      </p>
    </div>
  );
}

function titleFor(status) {
  switch (status) {
    case STATUS.LOADING:
      return "Verificando tu correo…";
    case STATUS.SUCCESS:
      return "¡Correo verificado!";
    case STATUS.ERROR:
      return "No pudimos verificar tu correo";
    case STATUS.MISSING:
    default:
      return "Enlace incompleto";
  }
}

function descriptionFor(status, message) {
  switch (status) {
    case STATUS.LOADING:
      return "Estamos confirmando tu enlace, esto solo tomará un momento.";
    case STATUS.SUCCESS:
      return message || "Tu cuenta está activa. Ya puedes iniciar sesión.";
    case STATUS.ERROR:
      return message;
    case STATUS.MISSING:
    default:
      return "Falta el token de verificación. Abre el enlace que recibiste por correo.";
  }
}

function StatusIcon({ status }) {
  if (status === STATUS.LOADING) {
    return (
      <div className="mx-auto w-14 h-14 rounded-full bg-primary-faint flex items-center justify-center">
        <svg
          className="animate-spin"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary-subtle"
          />
          <path
            d="M22 12 A10 10 0 0 0 12 2"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>
      </div>
    );
  }
  if (status === STATUS.SUCCESS) {
    return (
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
    );
  }
  return (
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
  );
}
