import express from "express";
import multer from "multer";
import { registrarFactura } from "../controllers/facturaController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/facturas", upload.single("archivo"), registrarFactura);

export default router;
