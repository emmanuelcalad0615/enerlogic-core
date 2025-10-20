import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertTriangle, Zap, Thermometer, Wind, Cpu, Tv, Coffee, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🔹 Utilidad para generar números aleatorios dentro de un rango
const getRandom = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

const InefficientDevicesPage = () => {
  const navigate = useNavigate();
  const [inefficientDevices, setInefficientDevices] = useState([]);

  useEffect(() => {
    const allDevices = [
      {
        name: "Aire Acondicionado",
        icon: <Wind className="h-6 w-6 text-cyan-400" />,
        baseConsumption: [1.4, 2.5],
        suggestion: [
          "Límpialo y revisa los filtros cada 2 semanas.",
          "Ajusta el termostato a 24°C para reducir el consumo.",
          "Evita usarlo con puertas o ventanas abiertas.",
        ],
      },
      {
        name: "Refrigerador",
        icon: <Thermometer className="h-6 w-6 text-green-400" />,
        baseConsumption: [0.9, 1.6],
        suggestion: [
          "Verifica el sellado de la puerta y evita abrirlo con frecuencia.",
          "No introduzcas alimentos calientes.",
          "Límpialo cada mes para mejorar la eficiencia.",
        ],
      },
      {
        name: "Lavadora",
        icon: <Zap className="h-6 w-6 text-yellow-400" />,
        baseConsumption: [0.5, 1.2],
        suggestion: [
          "Usa programas cortos y con agua fría cuando sea posible.",
          "Lava solo con carga completa.",
          "Evita usarla en horas pico de energía.",
        ],
      },
      {
        name: "Computador de Escritorio",
        icon: <Cpu className="h-6 w-6 text-blue-400" />,
        baseConsumption: [0.3, 0.8],
        suggestion: [
          "Activa el modo suspensión cuando no lo uses.",
          "Desactiva periféricos innecesarios como impresoras o luces RGB.",
          "Apágalo completamente al final del día.",
        ],
      },
      {
        name: "Televisor",
        icon: <Tv className="h-6 w-6 text-purple-400" />,
        baseConsumption: [0.2, 0.6],
        suggestion: [
          "Desconéctalo cuando no lo uses.",
          "Reduce el brillo de la pantalla para ahorrar energía.",
          "Evita dejarlo en modo standby.",
        ],
      },
      {
        name: "Cafetera",
        icon: <Coffee className="h-6 w-6 text-orange-400" />,
        baseConsumption: [0.1, 0.4],
        suggestion: [
          "Desconéctala después de usarla.",
          "Evita recalentar café varias veces.",
          "Usa un temporizador para controlar su encendido.",
        ],
      },
    ];

    // 🔹 Generar simulación aleatoria
    const simulated = allDevices
      .map((device) => {
        const consumption = getRandom(device.baseConsumption[0], device.baseConsumption[1]);
        let status;
        if (consumption > 1.8) status = "Consumo Excesivo";
        else if (consumption > 1.0) status = "Alto Consumo";
        else if (consumption > 0.5) status = "Eficiencia Media";
        else status = "Eficiente";

        return {
          ...device,
          consumption: `${consumption} kWh/día`,
          status,
          suggestion: device.suggestion[Math.floor(Math.random() * device.suggestion.length)],
        };
      })
      .filter(() => Math.random() > 0.2) // 🔹 A veces omite un equipo (simula variación real)
      .sort(() => Math.random() - 0.5); // 🔹 Mezcla el orden

    setInefficientDevices(simulated);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <>
      <Helmet>
        <title>Equipos Ineficientes - Enerlogic</title>
        <meta
          name="description"
          content="Identifica los equipos que más consumen energía y recibe recomendaciones para optimizarlos."
        />
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Equipos Ineficientes</h1>
            
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Button>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {inefficientDevices.map((device, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`bg-gray-800/50 border text-white rounded-2xl shadow-md transition-all duration-300 ${
                  device.status === "Consumo Excesivo"
                    ? "border-red-500/40 hover:shadow-red-400/10"
                    : device.status === "Alto Consumo"
                    ? "border-yellow-500/40 hover:shadow-yellow-400/10"
                    : "border-green-500/30 hover:shadow-green-400/10"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    {device.icon}
                    {device.name}
                  </CardTitle>
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-1">
                    <span className="font-semibold text-yellow-300">{device.status}</span>
                  </p>
                  <p className="text-gray-400 mb-3">
                    Consumo promedio:{" "}
                    <span className="text-cyan-300">{device.consumption}</span>
                  </p>
                  <div className="bg-gray-900/40 border border-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      💡 <span className="text-cyan-400">Recomendación:</span>{" "}
                      {device.suggestion}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Datos generados automáticamente por el simulador de Enerlogic  — Versión Demo.
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default InefficientDevicesPage;
