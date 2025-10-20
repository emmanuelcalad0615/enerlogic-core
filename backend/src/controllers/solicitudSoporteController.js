import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🟢 Crear solicitud
export const crearSolicitudSoporte = async (req, res) => {
  try {
    const { usuarioId, descripcion } = req.body;

    if (!usuarioId || !descripcion)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const solicitud = await prisma.solicitudSoporte.create({
      data: {
        usuarioId,
        descripcion,
        estado: "pendiente",
      },
      include: { usuario: true },
    });

    res.status(201).json(solicitud);
  } catch (error) {
    console.error("Error creando solicitud:", error);
    res.status(500).json({ message: "Error al crear la solicitud" });
  }
};

// 🟡 Obtener todas las solicitudes
export const obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await prisma.solicitudSoporte.findMany({
      include: { usuario: true, asignadoA: true, notas: true },
      orderBy: { creadoEn: "desc" },
    });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener solicitudes" });
  }
};

// 🟠 Obtener solicitudes de un usuario
export const obtenerSolicitudesPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const solicitudes = await prisma.solicitudSoporte.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      include: { notas: true, asignadoA: true },
      orderBy: { creadoEn: "desc" },
    });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener solicitudes del usuario" });
  }
};

// 🔵 Asignar técnico a solicitud
export const asignarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { asignadoAId } = req.body;

    const solicitud = await prisma.solicitudSoporte.update({
      where: { id: parseInt(id) },
      data: {
        asignadoAId,
        estado: "en_progreso",
      },
      include: { usuario: true, asignadoA: true },
    });

    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ message: "Error al asignar solicitud" });
  }
};

// 🔴 Resolver solicitud
export const resolverSolicitud = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitud = await prisma.solicitudSoporte.update({
      where: { id: parseInt(id) },
      data: { estado: "resuelta" },
    });

    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ message: "Error al resolver solicitud" });
  }
};

// ⚫ Eliminar solicitud
export const eliminarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.solicitudSoporte.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar solicitud" });
  }
};
