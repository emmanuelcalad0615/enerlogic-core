import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ message: "El usuario ya existe" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
      data: { nombre, email, password: hashed, rol },
    });

    res.status(201).json({ message: "Usuario creado correctamente", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, user.password);
    if (!valido) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
