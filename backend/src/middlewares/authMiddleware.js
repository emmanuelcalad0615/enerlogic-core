import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretito123";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // acá queda el id, email, rol
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
