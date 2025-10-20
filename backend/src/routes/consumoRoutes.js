import express from "express";
import {
  crearConsumo,
  obtenerConsumos,
  obtenerConsumosPorUsuario,
  obtenerConsumoPorId,
  actualizarConsumo,
  eliminarConsumo,
  getConsumoUltimoMes
} from "../controllers/consumoController.js";

const router = express.Router();

// CRUD completo
router.post("/", crearConsumo); // Crear nuevo
router.get("/", obtenerConsumos); // Obtener todos
router.get("/ultimo_mes/:usuarioId", getConsumoUltimoMes);
router.get("/usuario/:usuarioId", obtenerConsumosPorUsuario); // Obtener por usuario
router.get("/:id", obtenerConsumoPorId); // Obtener uno
router.put("/:id", actualizarConsumo); // Actualizar
router.delete("/:id", eliminarConsumo); // Eliminar


export default router;
