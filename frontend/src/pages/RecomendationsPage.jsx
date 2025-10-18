import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Lightbulb, TrendingDown, BatteryCharging, Home, Wind, Zap } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const RecommendationsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const recommendations = [
    {
      title: "Usa iluminación LED",
      description: "Reduce el consumo eléctrico sustituyendo bombillos tradicionales por LED. Ahorras hasta un 80% en energía.",
      icon: <Lightbulb className="h-6 w-6 text-yellow-400" />,
      impact: "Ahorro estimado: 15 kWh/mes",
    },
    {
      title: "Desconecta equipos en desuso",
      description: "Los aparatos en ‘stand-by’ siguen consumiendo energía. Usa regletas con interruptor o desconecta manualmente.",
      icon: <Zap className="h-6 w-6 text-cyan-400" />,
      impact: "Ahorro estimado: 8 kWh/mes",
    },
    {
      title: "Optimiza el uso del aire acondicionado",
      description: "Ajusta la temperatura a 24°C y realiza mantenimiento periódico para mejorar su eficiencia energética.",
      icon: <Wind className="h-6 w-6 text-blue-400" />,
      impact: "Ahorro estimado: 22 kWh/mes",
    },
    {
      title: "Aprovecha la luz natural",
      description: "Mantén cortinas abiertas durante el día para reducir la necesidad de iluminación artificial.",
      icon: <Home className="h-6 w-6 text-green-400" />,
      impact: "Ahorro estimado: 10 kWh/mes",
    },
    {
      title: "Carga tus dispositivos de noche",
      description: "Evita cargar celulares o laptops en las horas pico (6 p.m. a 10 p.m.) para reducir el impacto energético.",
      icon: <BatteryCharging className="h-6 w-6 text-purple-400" />,
      impact: "Ahorro estimado: 5 kWh/mes",
    },
  ];

  const handleBack = () => {
    navigate("/dashboard");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <Helmet>
        <title>Recomendaciones - Enerlogic</title>
        <meta name="description" content="Consejos personalizados para optimizar tu consumo energético." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Recomendaciones</h1>
          <Button onClick={handleBack} variant="ghost" className="text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
            ← Volver al Panel
          </Button>
        </div>

        {/* Lista de recomendaciones */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {recommendations.map((rec, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 text-white hover:scale-[1.02] transition-transform duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                    {rec.icon} {rec.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-3 text-sm leading-relaxed">{rec.description}</p>
                  <div className="text-sm text-green-400 font-medium">{rec.impact}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Button
            onClick={() =>
              toast({
                title: "✨ Más recomendaciones pronto",
                description: "Estamos analizando tus patrones de consumo para ofrecerte sugerencias aún más precisas.",
              })
            }
            className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-6 py-3 rounded-lg"
          >
            Ver nuevas sugerencias
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default RecommendationsPage;
