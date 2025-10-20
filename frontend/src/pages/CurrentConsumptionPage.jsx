import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Zap, Clock, TrendingUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useConsumption } from "../context/CurrentConsumptionContext"; // 👈 importá el hook del contexto

const CurrentConsumptionPage = () => {
  const navigate = useNavigate();
  const { consumption, data, average, peak } = useConsumption();

  const promedio = (data.reduce((acc, d) => acc + d.consumo, 0) / (data.length || 1)).toFixed(2);
  const maximo = Math.max(...data.map((d) => d.consumo), 0).toFixed(2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <>
      <Helmet>
        <title>Consumo Actual - Enerlogic</title>
        <meta name="description" content="Monitoreo de consumo eléctrico en tiempo real." />
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
            <h1 className="text-4xl font-bold text-white mb-2">Consumo Eléctrico</h1>
            <p className="text-gray-400">Monitoreo energético actualizado cada 5 segundos.</p>
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

        {/* Tarjetas */}
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
                  <Zap className="h-4 w-4" /> Consumo actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{consumption.toFixed(2)} kWh</div>
                <p className="text-xs text-gray-400">Lectura instantánea</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800/50 border-green-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-300 text-sm">
                  <Clock className="h-4 w-4" /> Promedio reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{average} kWh</div>
                <p className="text-xs text-gray-400">Últimos 20 registros</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800/50 border-yellow-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-300 text-sm">
                  <TrendingUp className="h-4 w-4" /> Pico máximo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{peak} kWh</div>
                <p className="text-xs text-gray-400">Máximo registrado hoy</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Gráfico en tiempo real */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Evolución en tiempo real</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Actualización continua del consumo energético cada 5 segundos.
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
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
              <Line type="monotone" dataKey="consumo" stroke="#06b6d4" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </>
  );
};

export default CurrentConsumptionPage;
