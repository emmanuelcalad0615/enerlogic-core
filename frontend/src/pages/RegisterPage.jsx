import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { UserPlus } from 'lucide-react';
import { registrarUsuario } from '../services/authService';

const RegisterPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarUsuario(nombre, email, password);
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada. Ahora inicia sesión.",
        className: "bg-green-500 text-white",
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast({
        title: "Error al registrarte",
        description: err.response?.data?.message || "Intenta nuevamente",
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Registro - Enerlogic</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/50 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
          <div className="text-center mb-8">
            <img src="/Logo.png" alt="Enerlogic Logo" className="mx-auto w-40 h-auto mb-4" />
            <UserPlus className="mx-auto h-16 w-16 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white mt-4">Crea tu Cuenta</h1>
            <p className="text-gray-400">Únete a la revolución energética</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold">
              Registrarse
            </Button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/" className="font-medium text-cyan-400 hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default RegisterPage;
