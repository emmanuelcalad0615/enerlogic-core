import api from "./api";

/**
 * 📤 Sube una factura (PDF o imagen) al servidor
 * @param {File} archivo - Archivo de factura PDF o imagen
 * @param {number} usuarioId - ID del usuario autenticado
 */
export const subirFactura = async (archivo, usuarioId) => {
  const formData = new FormData();
  formData.append("archivo", archivo);
  formData.append("usuarioId", usuarioId);

  const { data } = await api.post("/facturas", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

/**
 * 📋 Obtiene las facturas registradas del usuario
 * (esto solo si tienes un endpoint GET /facturas/:usuarioId)
 */
export const obtenerFacturasUsuario = async (usuarioId) => {
  const { data } = await api.get(`/facturas/${usuarioId}`);
  return data;
};
