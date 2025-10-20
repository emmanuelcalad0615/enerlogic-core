import { Router } from "express";
import { enviarAlertaConsumo } from "../controllers/alertaController.js";

const router = Router();

// POST → Enviar alerta de consumo al usuario por correo
router.post("/", enviarAlertaConsumo);

export default router;
