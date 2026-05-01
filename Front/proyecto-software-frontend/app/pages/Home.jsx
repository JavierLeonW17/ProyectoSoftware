import { useAuth } from "../contexts/AuthContext";
import HomeAdministrador from "./HomeAdministrador";
import HomeAgente from "./HomeAgente";
import HomeUsuario from "./HomeUsuario";

// Dispatcher por rol: la vista del home depende de `user.rol` del backend
// ("administrador" | "agente" | "usuario").
export default function Home() {
  const { user } = useAuth();
  const rol = (user?.rol || "").toLowerCase();

  switch (rol) {
    case "administrador":
      return <HomeAdministrador />;
    case "agente":
      return <HomeAgente />;
    case "usuario":
      return <HomeUsuario />;
    default:
      return <UnknownRole rol={user?.rol} />;
  }
}

function UnknownRole({ rol }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3 text-center">
      <h1 className="text-3xl font-bold text-zinc-900">Rol desconocido</h1>
      <p className="text-zinc-500 max-w-md">
        {rol
          ? `Tu cuenta tiene el rol "${rol}", que aún no tiene una vista
             asociada en el frontend. Contacta a un administrador.`
          : "No pudimos determinar tu rol. Cierra sesión e inicia de nuevo."}
      </p>
    </div>
  );
}
