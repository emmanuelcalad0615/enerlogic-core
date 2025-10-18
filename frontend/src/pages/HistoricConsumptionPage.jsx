import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BarChart, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

const HistoricConsumptionPage = () => {
  const navigate = useNavigate();

  // 🔹 Datos de ejemplo (puedes luego cargarlos del backend)
  const data = [
    { name: "Lun", consumo: 7.2 },
    { name: "Mar", consumo: 6.5 },
    { name: "Mié", consumo: 6.8 },
    { name: "Jue", consumo: 7.4 },
    { name: "Vie", consumo: 7.9 },
    { name: "Sáb", consumo: 8.1 },
    { name: "Dom", consumo: 6.9 },
  ];

  const total = data.reduce((acc, d) => acc + d.consumo, 0).toFixed(1);
  const promedio = (total / data.length).toFixed(1);

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
        <title>Consumo Histórico - Enerlogic</title>
        <meta
          name="description"
          content="Consulta tu historial de consumo energético y analiza las tendencias de uso."
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
            <h1 className="text-4xl font-bold text-white mb-2">Consumo Histórico</h1>
            <p className="text-gray-400">Visualiza cómo ha variado tu consumo energético en los últimos días.</p>
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

        {/* Estadísticas rápidas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800/50 border-cyan-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-300 text-sm">
                  <BarChart className="h-4 w-4" /> Total semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{total} kWh</div>
                <p className="text-xs text-gray-400">Consumo total de la última semana</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800/50 border-green-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-300 text-sm">
                  <Calendar className="h-4 w-4" /> Promedio diario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{promedio} kWh</div>
                <p className="text-xs text-gray-400">Consumo promedio diario</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800/50 border-purple-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300 text-sm">
                  <BarChart className="h-4 w-4" /> Día de mayor consumo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.reduce((max, d) => (d.consumo > max.consumo ? d : max)).name}
                </div>
                <p className="text-xs text-gray-400">
                  {data.reduce((max, d) => (d.consumo > max.consumo ? d : max)).consumo} kWh
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Gráfico de consumo */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Tendencia de Consumo</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Observa cómo ha variado tu consumo energético diario durante la última semana.
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="consumo"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#0ea5e9", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#22d3ee" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            📊 Próximamente podrás comparar semanas o meses y descargar tus reportes históricos.
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default HistoricConsumptionPage;
