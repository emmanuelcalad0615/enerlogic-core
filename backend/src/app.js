import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import facturaRoutes from "./routes/facturaRoutes.js";
import consumoRoutes from "./routes/consumoRoutes.js";
import solicitudRoutes from "./routes/solicitudSoporteRoutes.js";
import alertaRoutes from "./routes/alertaRoutes.js";







const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", facturaRoutes);
app.use("/api/consumo", consumoRoutes);
app.use("/api/alertas", alertaRoutes);
app.use("/api/solicitudes", solicitudRoutes);

export default app;
