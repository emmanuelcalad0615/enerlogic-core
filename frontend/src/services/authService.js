import api from "./api";

export const loginUsuario = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  // Guardamos token y usuario
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("usuario", JSON.stringify(data.user));
  return data.user;
};

export const registrarUsuario = async (nombre, email, password, rol = "usuario") => {
  const { data } = await api.post("/auth/register", { nombre, email, password, rol });
  return data;
};

export const obtenerUsuarioActual = () => {
  try {
    return JSON.parse(sessionStorage.getItem("usuario"));
  } catch {
    return null;
  }
};

export const cerrarSesion = async () => {
  try {
    // Elimina token y datos del usuario del almacenamiento local
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    // Si usabas sessionStorage en lugar de localStorage, cambia las líneas a:
    // sessionStorage.removeItem("token");
    // sessionStorage.removeItem("usuario");

    return { success: true, message: "Sesión cerrada correctamente" };
  } catch (error) {
    console.error("Error cerrando sesión:", error);
    return { success: false, message: "Error al cerrar sesión" };
  }
};
