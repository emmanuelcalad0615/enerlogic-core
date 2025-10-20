// src/services/solicitudSoporteService.js
import api from "./api";

const BASE_URL = "/solicitudes";

// 🔹 Obtener todas las solicitudes (solo para admin o soporte)
export const obtenerSolicitudes = async () => {
  try {
    const res = await api.get(BASE_URL);
    return res.data;
  } catch (error) {
    console.error("Error obteniendo solicitudes:", error);
    throw error.response?.data || { message: "Error al obtener solicitudes" };
  }
};

// 🔹 Obtener solicitudes de un usuario específico
export const obtenerSolicitudesPorUsuario = async (usuarioId) => {
  try {
    const res = await api.get(`${BASE_URL}/usuario/${usuarioId}`);
    return res.data;
  } catch (error) {
    console.error("Error obteniendo solicitudes del usuario:", error);
    throw error.response?.data || { message: "Error al obtener solicitudes del usuario" };
  }
};

// 🔹 Crear una nueva solicitud de soporte
export const crearSolicitudSoporte = async (usuarioId, descripcion) => {
  try {
    const res = await api.post(BASE_URL, { usuarioId, descripcion });
    return res.data;
  } catch (error) {
    console.error("Error creando solicitud de soporte:", error);
    throw error.response?.data || { message: "Error al crear solicitud" };
  }
};

// 🔹 Actualizar estado o asignación de una solicitud (solo soporte/admin)
export const actualizarSolicitudSoporte = async (id, data) => {
  try {
    const res = await api.put(`${BASE_URL}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error actualizando solicitud:", error);
    throw error.response?.data || { message: "Error al actualizar solicitud" };
  }
};

// 🔹 Eliminar solicitud (opcional, si lo permites)
export const eliminarSolicitudSoporte = async (id) => {
  try {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error eliminando solicitud:", error);
    throw error.response?.data || { message: "Error al eliminar solicitud" };
  }
};
