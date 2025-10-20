import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BarChart, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { obtenerConsumosPorUsuario } from "../services/consumoHistoricoService";

const HistoricConsumptionPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        const usuarioId = usuario?.id;

        if (!usuarioId) {
          setError("Usuario no autenticado.");
          return;
        }

        const registros = await obtenerConsumosPorUsuario(usuarioId);

        // Agrupar los registros por mes
        const grouped = {};
        registros.forEach((r) => {
          const fecha = new Date(r.fecha);
          const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
          if (!grouped[key]) grouped[key] = 0;
          grouped[key] += parseFloat(r.consumoKwh);
        });

        // Convertir a array formateado para la gráfica
        const formatted = Object.entries(grouped).map(([key, consumo]) => {
          const [year, month] = key.split("-");
          const fecha = new Date(year, month - 1);
          const name = fecha.toLocaleString("es-CO", { month: "short", year: "numeric" });
          return { name, consumo };
        });

        setData(formatted.sort((a, b) => new Date(a.name) - new Date(b.name)));
      } catch (err) {
        console.error(err);
        setError(err.error || "Error al cargar los datos de consumo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular totales y promedios
  const totalMensual = data.length > 0 ? data[data.length - 1].consumo.toFixed(1) : 0;
  const promedioMensual =
    data.length > 0
      ? (data.reduce((acc, d) => acc + d.consumo, 0) / data.length).toFixed(1)
      : 0;
  const mesPico =
    data.length > 0
      ? data.reduce((max, d) => (d.consumo > max.consumo ? d : max))
      : { name: "-", consumo: 0 };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-300 text-xl">
        Cargando consumo histórico...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-400 text-xl">
        ⚠️ {error}
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Consumo Histórico - Enerlogic</title>
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Consumo Histórico</h1>
            <p className="text-gray-400">
              Análisis mensual de tu consumo energético.
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel
          </Button>
        </div>

        {/* Tarjetas de estadísticas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {/* Total mensual actual */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800/50 border-cyan-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-300 text-sm">
                  <BarChart className="h-4 w-4" /> Total del último mes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalMensual} kWh</div>
                <p className="text-xs text-gray-400">Consumo del mes más reciente</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Promedio mensual */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800/50 border-green-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-300 text-sm">
                  <Calendar className="h-4 w-4" /> Promedio mensual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{promedioMensual} kWh</div>
                <p className="text-xs text-gray-400">Promedio de consumo por mes</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mes pico */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800/50 border-purple-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300 text-sm">
                  <BarChart className="h-4 w-4" /> Mes pico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold capitalize">{mesPico.name}</div>
                <p className="text-xs text-gray-400">{mesPico.consumo} kWh</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Gráfica de tendencia mensual */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Tendencia mensual</h2>

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
      </motion.div>
    </>
  );
};

export default HistoricConsumptionPage;
