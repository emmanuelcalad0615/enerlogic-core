// src/services/consumoService.js
import api from "./api";

// 🔹 Obtener todos los consumos
export const obtenerConsumos = async () => {
  try {
    const res = await api.get("/consumo");
    return res.data;
  } catch (error) {
    console.error("Error obteniendo consumos:", error);
    throw error.response?.data || { error: "Error desconocido al obtener consumos" };
  }
};

// 🔹 Obtener consumos por usuario
export const obtenerConsumosPorUsuario = async (usuarioId) => {
  try {
    const res = await api.get(`/consumo/usuario/${usuarioId}`);
    return res.data;
  } catch (error) {
    console.error("Error obteniendo consumos por usuario:", error);
    throw error.response?.data || { error: "Error desconocido al obtener consumos por usuario" };
  }
};


// 🔹 Crear nuevo consumo
export const crearConsumo = async (data) => {
  try {
    const res = await api.post("/consumo", data);
    return res.data;
  } catch (error) {
    console.error("Error creando consumo:", error);
    throw error.response?.data || { error: "Error desconocido al crear consumo" };
  }
};

// 🔹 Actualizar consumo
export const actualizarConsumo = async (id, data) => {
  try {
    const res = await api.put(`/consumo/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error actualizando consumo:", error);
    throw error.response?.data || { error: "Error desconocido al actualizar consumo" };
  }
};

// 🔹 Eliminar consumo
export const eliminarConsumo = async (id) => {
  try {
    const res = await api.delete(`/consumo/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error eliminando consumo:", error);
    throw error.response?.data || { error: "Error desconocido al eliminar consumo" };
  }
};
// 🔹 Obtener consumo del último mes registrado
export const obtenerConsumoUltimoMes = async (usuarioId) => {
  try {
    if (!usuarioId) throw new Error("El usuarioId es obligatorio.");

    // ✅ Usa la ruta correcta del backend: /api/consumo/ultimo_mes/:usuarioId
    const res = await api.get(`/consumo/ultimo_mes/${usuarioId}`);
    return res.data; // { mes, año, total, promedio, pico, registros }
  } catch (error) {
    console.error("Error obteniendo consumo del último mes:", error);
    throw error.response?.data || { error: "Error al obtener el consumo del último mes" };
  }
};
