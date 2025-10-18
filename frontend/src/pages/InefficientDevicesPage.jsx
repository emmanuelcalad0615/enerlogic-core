import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertTriangle, Zap, Thermometer, Wind, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InefficientDevicesPage = () => {
  const navigate = useNavigate();

  const inefficientDevices = [
    {
      name: "Aire Acondicionado",
      consumption: "1.8 kWh/día",
      status: "Alto consumo",
      icon: <Wind className="h-6 w-6 text-cyan-400" />,
      suggestion: "Límpialo y revisa los filtros cada 2 semanas.",
    },
    {
      name: "Refrigerador",
      consumption: "1.2 kWh/día",
      status: "Uso continuo",
      icon: <Thermometer className="h-6 w-6 text-green-400" />,
      suggestion: "Verifica el sellado de la puerta y evita abrirlo frecuentemente.",
    },
    {
      name: "Lavadora",
      consumption: "0.9 kWh/día",
      status: "Eficiencia media",
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      suggestion: "Usa programas cortos y con agua fría cuando sea posible.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
      },
    },
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
            <p className="text-gray-400">Revisa los equipos que más energía consumen y optimiza tu hogar inteligente.</p>
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
              <Card className="bg-gray-800/50 border border-yellow-500/30 text-white rounded-2xl shadow-md hover:shadow-yellow-400/10 transition-all duration-300">
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
                  <p className="text-gray-400 mb-3">Consumo promedio: <span className="text-cyan-300">{device.consumption}</span></p>
                  <div className="bg-gray-900/40 border border-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      💡 <span className="text-cyan-400">Recomendación:</span> {device.suggestion}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default InefficientDevicesPage;
