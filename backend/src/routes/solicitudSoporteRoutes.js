import { Router } from "express";
import {
  crearSolicitudSoporte,
  obtenerSolicitudes,
  obtenerSolicitudesPorUsuario,
  asignarSolicitud,
  resolverSolicitud,
  eliminarSolicitud,
} from "../controllers/solicitudSoporteController.js";

const router = Router();

router.post("/", crearSolicitudSoporte);
router.get("/", obtenerSolicitudes);
router.get("/usuario/:usuarioId", obtenerSolicitudesPorUsuario);
router.put("/asignar/:id", asignarSolicitud);
router.put("/resolver/:id", resolverSolicitud);
router.delete("/:id", eliminarSolicitud);

export default router;
