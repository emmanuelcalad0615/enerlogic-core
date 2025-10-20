import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, PlusCircle, Loader2, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";
import {
  obtenerSolicitudesPorUsuario,
  crearSolicitudSoporte,
} from "../services/solicitudSoporteService";

const SupportRequestsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [solicitudes, setSolicitudes] = useState([]);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // 🔹 Cargar solicitudes del usuario al montar
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setCargando(true);
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        if (!usuario?.id) throw new Error("Usuario no autenticado");

        const data = await obtenerSolicitudesPorUsuario(usuario.id);
        setSolicitudes(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error cargando solicitudes",
          description: error.message || "No se pudieron cargar tus solicitudes.",
          className: "bg-red-500 text-white",
        });
      } finally {
        setCargando(false);
      }
    };
    fetchSolicitudes();
  }, [toast]);

  // 🔹 Crear una nueva solicitud
  const handleEnviar = async () => {
    if (!nuevaDescripcion.trim()) {
      toast({ title: "Campo vacío", description: "Por favor escribe una descripción antes de enviar." });
      return;
    }

    try {
      setEnviando(true);
      const usuario = JSON.parse(sessionStorage.getItem("usuario"));
      if (!usuario?.id) throw new Error("Usuario no autenticado");

      const nueva = await crearSolicitudSoporte(usuario.id, nuevaDescripcion);

      // Agregar la nueva solicitud al inicio de la lista
      setSolicitudes((prev) => [nueva, ...prev]);
      setNuevaDescripcion("");

      toast({
        title: "✅ Solicitud enviada",
        description: "Tu solicitud fue registrada correctamente.",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al enviar",
        description: error.message || "No se pudo enviar la solicitud.",
        className: "bg-red-500 text-white",
      });
    } finally {
      setEnviando(false);
    }
  };

  // 🔹 Iconos por estado
  const estadoIcon = (estado) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="text-yellow-400" />;
      case "en_progreso":
        return <AlertTriangle className="text-cyan-400" />;
      case "resuelta":
        return <CheckCircle className="text-green-400" />;
      default:
        return <Clock className="text-gray-400" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Soporte Técnico - Enerlogic</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Soporte Técnico</h1>
            <p className="text-gray-400">
              Crea solicitudes y revisa el estado de tus reportes.
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

        {/* Formulario de solicitud */}
        <Card className="bg-gray-800/50 border border-cyan-500/20 text-white mb-6">
          <CardHeader>
            <CardTitle>Crear nueva solicitud</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
              placeholder="Describe tu problema o solicitud..."
              className="w-full p-3 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              rows={3}
            />
            <Button
              onClick={handleEnviar}
              disabled={enviando}
              className="mt-3 bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              {enviando ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PlusCircle className="h-4 w-4 mr-2" />
              )}
              Enviar Solicitud
            </Button>
          </CardContent>
        </Card>

        {/* Listado de solicitudes */}
        {cargando ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          </div>
        ) : solicitudes.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">
            No tienes solicitudes registradas.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solicitudes.map((s) => (
              <Card key={s.id} className="bg-gray-800/50 border border-gray-700 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {estadoIcon(s.estado)}
                    <span className="capitalize">{s.estado}</span>
                  </CardTitle>
                  <span className="text-xs text-gray-400">
                    {new Date(s.creadoEn).toLocaleDateString()}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{s.descripcion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default SupportRequestsPage;
