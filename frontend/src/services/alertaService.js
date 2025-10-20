// src/services/alertaService.js
import api from "./api";

export const enviarAlertaConsumo = async (correoUsuario, valorPico) => {
  try {
    const res = await api.post("/alertas", { correoUsuario, valorPico }); 
    return res.data;
  } catch (error) {
    console.error("Error enviando alerta de consumo:", error);
    throw error.response?.data || { mensaje: "Error al enviar alerta" };
  }
};
