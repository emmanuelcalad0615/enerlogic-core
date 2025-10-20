import fs from "fs";
import path from "path";
import pdfPoppler from "pdf-poppler";
import Tesseract from "tesseract.js";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Elimina una carpeta y todo su contenido
const eliminarCarpeta = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        eliminarCarpeta(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
    console.log(`Carpeta eliminada: ${dirPath}`);
  }
};


/* OCR de imagen directa (PNG/JPG) */
const ocrImagen = async (rutaImg, outputDir) => {
  const rutaProc = path.join(outputDir, `proc-${path.basename(rutaImg)}`);

  // Mejora la calidad para Tesseract
  await sharp(rutaImg)
    .resize({ width: 2480, height: 3508, fit: "contain" }) // formato A4 ~ 300 DPI
    .grayscale()
    .normalize()
    .sharpen()
    .threshold(160)
    .toFile(rutaProc);

  console.log(` OCR en imagen: ${rutaImg}`);
  const { data: { text } } = await Tesseract.recognize(rutaProc, "spa", {
    logger: (m) =>
      process.stdout.write(
        `\r🧩 ${path.basename(rutaImg)}: ${m.status} ${(m.progress * 100).toFixed(1)}%`
      ),
  });

  fs.unlinkSync(rutaProc);

  const txtPath = path.join(outputDir, path.basename(rutaImg, path.extname(rutaImg)) + ".txt");
  fs.writeFileSync(txtPath, text, "utf-8");
  console.log(`\nTexto guardado en: ${txtPath}`);
  return txtPath;
};

/* OCR de PDF multipágina */
const ocrPDF = async (rutaPDF, outputDir) => {
  console.log("Convirtiendo PDF a imágenes...");
  const opts = { format: "png", out_dir: outputDir, out_prefix: "page", scale: 600 };
  await pdfPoppler.convert(rutaPDF, opts);

  const imagenes = fs
    .readdirSync(outputDir)
    .filter((f) => f.startsWith("page") && f.endsWith(".png"));

  let textoCompleto = "";
  for (const img of imagenes) {
    const rutaImg = path.join(outputDir, img);
    const txtPath = await ocrImagen(rutaImg, outputDir);
    const texto = fs.readFileSync(txtPath, "utf-8");
    textoCompleto += `\n--- ${img} ---\n${texto}\n`;
  }

  const finalTxtPath = path.join(outputDir, path.basename(rutaPDF, ".pdf") + ".txt");
  fs.writeFileSync(finalTxtPath, textoCompleto, "utf-8");
  return finalTxtPath;
};

/* Extrae datos de texto OCR (Factura EPM / Emvarias) */
/* Extrae datos de texto OCR (Factura EPM / Emvarias o formato 'Contrato #### ####') */
const extraerDatosFactura = (texto) => {
  const cleanText = texto.replace(/\s+/g, " ").toLowerCase();

  // --- 1️⃣ NUEVO: Detección directa del formato "Contrato 11706073 231.222" ---
  const contratoLineaMatch = cleanText.match(/contrato\s+(\d+)[^\d]+([\d.,]+)/i);

  let numeroContrato = null;
  let valorTotal = 0;
  //  EXTRA: REFERENTE DE PAGO
  const referentePagoMatch = cleanText.match(/referente\s*de\s*pago[:\s-]*([a-z0-9\-]+)/i);
  const referentePago = referentePagoMatch ? referentePagoMatch[1].trim() : null;
  if (contratoLineaMatch) {
    numeroContrato = contratoLineaMatch[1]; // primer número después de "Contrato"
    valorTotal = parseInt(contratoLineaMatch[2].replace(/[^\d]/g, ""), 10); // segundo número (valor total)
  } else {
    // --- 2️⃣ Si no encuentra ese formato, usar las detecciones anteriores ---
    numeroContrato =
      cleanText.match(/(refer\w*\s*(de)?\s*pago[:\s-]*)([a-z0-9\-]+)/i)?.[3] ||
      cleanText.match(/(n[úu]mero|num\.?|factura|ref\.?)[:\s-]*([a-z0-9\-]+)/i)?.[2] ||
      cleanText.match(/producto[:\s]+(\d{6,})/i)?.[1] ||
      `F-${Date.now()}`;

    const valorTotalMatch = cleanText.match(
      /(total\s*a\s*pagar)[\s\S]{0,50}?(\$?\s*[\d.,]{3,})/i
    );
    

    const parseNumero2 = (num) => {
      if (!num) return 0;
      const str = String(num);
      const limpio = str.replace(/[^\d]/g, "");
      return parseInt(limpio, 10) || 0;
    };

    valorTotal = valorTotalMatch ? parseNumero2(valorTotalMatch[2]) : 0;
  }

  // --- 3️⃣ Buscar consumo ---
  const consumoKwh =
    cleanText.match(/energ[ií]a\s+(\d+)\s*kwh/i)?.[1] ||
    cleanText.match(/(\d+)\s*kwh/i)?.[1] ||
    "0";

  // --- 4️⃣ Buscar fecha ---
  const mesAño = cleanText.match(
    /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)[^\d]*(\d{4})/i
  );
  const fechaEmision = mesAño
    ? new Date(`${mesAño[2]}-${mesAño[1].substring(0, 3)}-01`)
    : new Date();

  return {
  numero: numeroContrato?.trim() || null,
  referentePago,
  consumoKwh: parseFloat(consumoKwh) || 0,
  valorTotal,
  fechaEmision,
};
};



export const registrarFactura = async (req, res) => {
  const { usuarioId } = req.body;
  const archivo = req.file;

  let tempDir;
  try {
    if (!archivo) return res.status(400).json({ error: "Debe subir un archivo PDF o imagen" });
    if (!usuarioId) return res.status(400).json({ error: "usuarioId es requerido" });

    tempDir = path.join("temp", path.parse(archivo.filename).name);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    console.log("Procesando archivo:", archivo.path);
    let txtPath;

    if (archivo.mimetype.includes("pdf")) {
      txtPath = await ocrPDF(archivo.path, tempDir);
    } else if (archivo.mimetype.includes("image")) {
      txtPath = await ocrImagen(archivo.path, tempDir);
    } else {
      return res.status(400).json({ error: "Formato de archivo no soportado" });
    }

    const texto = fs.readFileSync(txtPath, "utf-8");
    console.log(`Texto OCR total: ${texto.length} caracteres.`);

    const textoGuardado = path.join(tempDir, "texto_completo.txt");
    fs.writeFileSync(textoGuardado, texto, "utf-8");

    const datos = extraerDatosFactura(texto);
    console.log("Datos extraídos:", datos);

    if (!datos.valorTotal || datos.valorTotal === 0) {
      console.warn("No se pudieron extraer datos válidos, pero se guardó el texto.");
      return res.status(200).json({
        mensaje: "Texto OCR guardado correctamente, pero no se detectaron datos de factura",
        textoPath: textoGuardado,
      });
    }

    const factura = await prisma.factura.create({
  data: {
    usuarioId: parseInt(usuarioId),
    contrato: datos.numero,            // antes era "numero"
    referentePago: datos.referentePago, // ✅ Nuevo
    fechaEmision: datos.fechaEmision,
    consumoKwh: datos.consumoKwh,
    valorTotal: datos.valorTotal,
    archivoUrl: archivo.path,
  },
});

    await prisma.consumoHistorico.create({
      data: {
        usuarioId: parseInt(usuarioId),
        fecha: datos.fechaEmision,
        consumoKwh: datos.consumoKwh,
        costo: datos.valorTotal,
      },
    });

    res.status(201).json({
      mensaje: "Factura registrada correctamente",
      factura,
    });
  } catch (error) {
  if (error.code === "P2002") {
    return res.status(400).json({
      error: "Esta factura ya fue registrada (referente duplicado)"
    });
  }

  console.error("Error procesando la factura:", error);
  res.status(500).json({
    error: "Error procesando la factura",
    detalle: error.message
  });
} 
  finally {
    // Limpieza: eliminar temp y archivo original
    try {
      if (tempDir) eliminarCarpeta(tempDir);
      if (archivo && fs.existsSync(archivo.path)) {
        fs.unlinkSync(archivo.path);
        console.log(`Archivo original eliminado: ${archivo.path}`);
      }
    } catch (e) {
      console.error("Error eliminando archivos temporales:", e.message);
    }
  }
};

