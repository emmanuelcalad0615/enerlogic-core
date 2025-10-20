import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";


/* ✅ Crear un nuevo registro */
export const crearConsumo = async (req, res) => {
  try {
    const { usuarioId, fecha, consumoKwh, costo } = req.body;

    if (!usuarioId || !consumoKwh) {
      return res.status(400).json({ error: "usuarioId y consumoKwh son obligatorios." });
    }

    const nuevo = await prisma.consumoHistorico.create({
      data: {
        usuarioId: parseInt(usuarioId),
        fecha: fecha ? new Date(fecha) : new Date(),
        consumoKwh: parseFloat(consumoKwh),
        costo: costo ? parseFloat(costo) : null,
      },
    });

    res.status(201).json({
      mensaje: "Registro de consumo creado correctamente.",
      data: nuevo,
    });
  } catch (error) {
    console.error("Error creando consumo histórico:", error);
    res.status(500).json({
      error: "Error interno del servidor al crear el consumo histórico.",
      detalle: error.message,
    });
  }
};

/* ✅ Obtener todos los registros */
export const obtenerConsumos = async (req, res) => {
  try {
    const consumos = await prisma.consumoHistorico.findMany({
      orderBy: { fecha: "desc" },
    });
    res.status(200).json(consumos);
  } catch (error) {
    console.error("Error obteniendo consumos:", error);
    res.status(500).json({ error: "Error al obtener los consumos históricos." });
  }
};

/* ✅ Obtener registros por usuario */
export const obtenerConsumosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const consumos = await prisma.consumoHistorico.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      orderBy: { fecha: "asc" },
    });

    if (!consumos || consumos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron registros para este usuario." });
    }

    res.status(200).json(consumos);
  } catch (error) {
    console.error("Error obteniendo consumo histórico:", error);
    res.status(500).json({ error: "Error al obtener el consumo histórico del usuario." });
  }
};

/* ✅ Obtener un registro por ID */
export const obtenerConsumoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const consumo = await prisma.consumoHistorico.findUnique({
      where: { id: parseInt(id) },
    });

    if (!consumo) {
      return res.status(404).json({ mensaje: "Registro no encontrado." });
    }

    res.status(200).json(consumo);
  } catch (error) {
    console.error("Error obteniendo consumo por ID:", error);
    res.status(500).json({ error: "Error al obtener el registro de consumo histórico." });
  }
};

/* ✅ Actualizar un registro */
export const actualizarConsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, consumoKwh, costo } = req.body;

    const existente = await prisma.consumoHistorico.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existente) {
      return res.status(404).json({ mensaje: "Registro no encontrado." });
    }

    const actualizado = await prisma.consumoHistorico.update({
      where: { id: parseInt(id) },
      data: {
        fecha: fecha ? new Date(fecha) : existente.fecha,
        consumoKwh: consumoKwh ? parseFloat(consumoKwh) : existente.consumoKwh,
        costo: costo ? parseFloat(costo) : existente.costo,
      },
    });

    res.status(200).json({
      mensaje: "Registro actualizado correctamente.",
      data: actualizado,
    });
  } catch (error) {
    console.error("Error actualizando consumo histórico:", error);
    res.status(500).json({ error: "Error al actualizar el registro." });
  }
};

/* ✅ Eliminar un registro */
export const eliminarConsumo = async (req, res) => {
  try {
    const { id } = req.params;

    const existente = await prisma.consumoHistorico.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existente) {
      return res.status(404).json({ mensaje: "Registro no encontrado." });
    }

    await prisma.consumoHistorico.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ mensaje: "Registro eliminado correctamente." });
  } catch (error) {
    console.error("Error eliminando consumo histórico:", error);
    res.status(500).json({ error: "Error al eliminar el registro de consumo histórico." });
  }
};

export const getConsumoUltimoMes = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // 1️⃣ Buscar el último mes registrado del usuario
    const ultimoRegistro = await prisma.consumoHistorico.findFirst({
      where: { usuarioId: parseInt(usuarioId) },
      orderBy: { fecha: "desc" },
    });

    if (!ultimoRegistro) {
      return res.status(404).json({
        mensaje: "No hay registros de consumo para este usuario.",
      });
    }

    // 2️⃣ Obtener mes y año del último registro
    const fechaUltimoMes = new Date(ultimoRegistro.fecha);
    const mes = fechaUltimoMes.getMonth(); // 0 = enero
    const año = fechaUltimoMes.getFullYear();

    // 3️⃣ Traer todos los registros de ese mes
    const registros = await prisma.consumoHistorico.findMany({
      where: {
        usuarioId: parseInt(usuarioId),
        fecha: {
          gte: new Date(año, mes, 1),
          lt: new Date(año, mes + 1, 1),
        },
      },
      orderBy: { fecha: "asc" },
    });

    // 4️⃣ Calcular totales
    const total = registros.reduce((sum, r) => sum + r.consumoKwh, 0);
    const promedio = registros.length ? total / registros.length : 0;
    const pico = registros.length ? Math.max(...registros.map(r => r.consumoKwh)) : 0;

    // 5️⃣ Responder
    res.json({
      mes: fechaUltimoMes.toLocaleString("es-ES", { month: "long" }),
      año,
      total,
      promedio,
      pico,
      registros,
    });
  } catch (error) {
    console.error("Error obteniendo consumo del último mes:", error);
    res.status(500).json({
      mensaje: "Error al obtener el consumo del último mes",
      detalle: error.message,
    });
  }
};
