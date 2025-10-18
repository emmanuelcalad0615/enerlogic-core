import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Registro Exitoso",
      description: "¡Tu cuenta ha sido creada! Ahora inicia sesión.",
      className: "bg-green-500 text-white",
    });
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <>
      <Helmet>
        <title>Registro - Enerlogic</title>
        <meta name="description" content="Crea una nueva cuenta en Enerlogic para empezar a ahorrar energía." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/50 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            >
              <UserPlus className="mx-auto h-16 w-16 text-purple-400" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mt-4">Crea tu Cuenta</h1>
            <p className="text-gray-400">Únete a la revolución energética</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" type="text" placeholder="Tu Nombre" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold">
              Registrarse
            </Button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/" className="font-medium text-purple-400 hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default RegisterPage;