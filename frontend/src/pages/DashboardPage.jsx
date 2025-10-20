import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { Zap, BarChart, AlertTriangle, Lightbulb, LogOut, UploadCloud, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subirFactura } from "../services/facturaService";
import { cerrarSesion } from "../services/authService";
import { useConsumption } from "../context/CurrentConsumptionContext";
import { obtenerConsumoUltimoMes } from "../services/consumoHistoricoService";


const DashboardPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { consumption, data } = useConsumption(); // ✅ consumo actual desde el contexto

  const [fileName, setFileName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [consumptionData, setConsumptionData] = useState({
    current: '3.4 kWh',
    historic: '250 kWh',
    inefficient: '2',
  });

  // 🔹 Actualizar consumo actual cada 5 segundos desde el contexto
  useEffect(() => {
    // función para actualizar desde el contexto
    const updateFromContext = () => {
      if (consumption && typeof consumption.value !== 'undefined') {
        setConsumptionData((prev) => ({
          ...prev,
          current: `${consumption.value.toFixed(2)} kWh`,
        }));
      }
    };
    

    updateFromContext(); // primera actualización
    const interval = setInterval(updateFromContext, 5000); // cada 5 segundos

    return () => clearInterval(interval);
  }, [consumption]);

  useEffect(() => {
    const fetchConsumoHistorico = async () => {
      try {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        const usuarioId = usuario?.id;
        if (!usuarioId) return;

        const data = await obtenerConsumoUltimoMes(usuarioId);

        setConsumptionData((prev) => ({
          ...prev,
          historic: `${data.total.toFixed(2)} kWh`,
        }));
      } catch (error) {
        console.error("Error obteniendo consumo histórico:", error);
        setConsumptionData((prev) => ({
          ...prev,
          historic: "—",
        }));
      }
    };

    fetchConsumoHistorico();
  }, []);

  const handleLogout = async () => {
    const result = await cerrarSesion();
    if (result.success) {
      navigate("/"); 
    }
  };

  const featureToast = () => {
    toast({
      title: '🚧 ¡Función en construcción!',
      description: '¡No te preocupes! Puedes solicitarla en tu próximo mensaje. 🚀',
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsProcessing(true);
      toast({
        title: 'Procesando Factura...',
        description: 'Estamos "leyendo" los datos de tu factura de EPM.',
      });

      try {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        const usuarioId = usuario?.id;

        if (!usuarioId) {
          throw new Error("Usuario no autenticado");
        }

        const response = await subirFactura(file, usuarioId);
        console.log("Respuesta del backend:", response);

        toast({
          title: "✅ ¡Factura Procesada!",
          description: response.mensaje || "Datos guardados correctamente.",
          className: "bg-green-500 text-white",
        });

        setConsumptionData({
          current: `${response.factura.consumoKwh} kWh`,
          historic: 'Actualizando...',
          inefficient: '—',
        });
      } catch (error) {
        console.error("Error subiendo factura:", error);
        toast({
          title: "❌ Error al procesar factura",
          description: error.response?.data?.error || error.message,
          className: "bg-red-500 text-white",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const goToRecommendations = () => navigate("/recommendations");
  const goToInneficentDevice = () => navigate("/device");
  const goToHistoricConsumption = () => navigate("/historicconsumption");
  const goToCurrentConsumption = () => navigate("/currentconsumption");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <>
      <Helmet>
        <title>Panel de Control - Enerlogic</title>
        <meta name="description" content="Visualiza tu consumo de energía, reportes y recomendaciones." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="flex justify-between items-center mb-8">
          <img src="/Logo.png" alt="Logo" className="w-48 h-auto"/>
          <Button onClick={handleLogout} variant="ghost" className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        <motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch"
>
  <motion.div variants={itemVariants} className="h-full">
    <Card className="bg-gray-800/50 border-cyan-500/30 text-white h-full" onClick={goToCurrentConsumption}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-cyan-300">Consumo Actual</CardTitle>
        <Zap className="h-4 w-4 text-cyan-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{consumption}</div>
        <p className="text-xs text-gray-400">+2.1% desde ayer</p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div variants={itemVariants} className="h-full">
    <Card className="bg-gray-800/50 border-green-500/30 text-white h-full" onClick={goToHistoricConsumption}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-green-300">Consumo Histórico</CardTitle>
        <BarChart className="h-4 w-4 text-green-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{consumptionData.historic}</div>
        <p className="text-xs text-gray-400">Últimos 30 días</p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div variants={itemVariants} className="h-full">
    <Card className="bg-gray-800/50 border-yellow-500/30 text-white h-full" onClick={goToInneficentDevice}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-yellow-300">Equipos Ineficientes</CardTitle>
        <AlertTriangle className="h-4 w-4 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{consumptionData.inefficient}</div>
        <p className="text-xs text-gray-400">Aire Acondicionado, Refrigerador</p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div variants={itemVariants} className="h-full">
    <Card className="bg-gray-800/50 border-purple-500/30 text-white h-full" onClick={goToRecommendations}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-purple-300">Recomendaciones</CardTitle>
        <Lightbulb className="h-4 w-4 text-purple-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">5</div>
        <p className="text-xs text-gray-400">Nuevas recomendaciones disponibles</p>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div variants={itemVariants} className="h-full">
    <Card
      className="bg-gray-800/50 border-blue-500/30 text-white cursor-pointer hover:shadow-blue-400/20 transition-all h-full"
      onClick={() => navigate("/soporte")}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-300">Soporte Técnico</CardTitle>
        <LogOut className="h-4 w-4 text-blue-400 rotate-180" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">Solicitudes</div>
        <p className="text-xs text-gray-400">Reporta problemas o revisa tus solicitudes</p>
      </CardContent>
    </Card>
  </motion.div>
</motion.div>


        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Adjuntar Factura EPM</h2>
            <p className="text-gray-400 mb-4">Sube tu última factura de servicios para actualizar tus datos de consumo automáticamente.</p>
            <div className="mt-4 flex justify-center rounded-lg border border-dashed border-gray-500 px-6 py-10">
              <div className="text-center">
                {isProcessing ? (
                  <Loader2 className="mx-auto h-12 w-12 text-cyan-400 animate-spin" />
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="mt-4 flex text-sm leading-6 text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-semibold text-cyan-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-cyan-300"
                  >
                    <span>Sube un archivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isProcessing} />
                  </label>
                  <p className="pl-1">o arrástralo aquí</p>
                </div>
                <p className="text-xs leading-5 text-gray-500">PDF, PNG, JPG hasta 10MB</p>
              </div>
            </div>
            {fileName && !isProcessing && (
              <div className="mt-4 text-sm text-green-400 flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2" />
                <span>Archivo procesado: {fileName}</span>
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Informe Mensual</h2>
            <p className="text-gray-400 mb-4">Aquí se mostrará un resumen detallado de tu consumo, ahorros y el impacto ambiental de tus acciones. ¡Próximamente!</p>
            <Button onClick={featureToast} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
              Generar Reporte de Muestra
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default DashboardPage;
