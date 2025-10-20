import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const enviarAlertaConsumo = async (req, res) => {
  try {
    const { correoUsuario, valorPico } = req.body;

    if (!correoUsuario || !valorPico) {
      return res.status(400).json({ mensaje: "Faltan datos del usuario o del consumo" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mensaje = {
      from: `"Enerlogic ⚡" <${process.env.EMAIL_USER}>`,
      to: correoUsuario,
      subject: "⚠️ Alerta de Consumo Elevado Detectada",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color:#ff5555;">¡Alerta de Consumo Elevado!</h2>
          <p>Se ha detectado un pico de consumo de <strong>${valorPico} kWh</strong> que supera el umbral configurado.</p>
          <p>Por favor, revisa tus dispositivos o hábitos de uso de energía.</p>
          <br/>
          <p style="font-size: 12px; color: #777;">Enerlogic ⚡ - Monitoreo Inteligente de Energía</p>
        </div>
      `,
    };

    await transporter.sendMail(mensaje);

    res.json({ mensaje: "Correo de alerta enviado correctamente" });
  } catch (error) {
    console.error("Error enviando alerta:", error);
    res.status(500).json({ mensaje: "Error enviando el correo", error });
  }
};
