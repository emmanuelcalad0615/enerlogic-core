import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import RecommendationsPage from './pages/RecomendationsPage';
import InefficientDevicesPage from './pages/InefficientDevicesPage';
import HistoricConsumptionPage from './pages/HistoricConsumptionPage';
import CurrentConsumptionPage from './pages/CurrentConsumptionPage';
import SupportRequestsPage from './pages/SupportRequestsPage';
import { CurrentConsumptionProvider } from './context/CurrentConsumptionContext';



function App() {
  const location = useLocation();

  return (
    // 👇 Envolvemos todo el contenido en el provider
    <CurrentConsumptionProvider>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/device" element={<InefficientDevicesPage />} />
            <Route path="/historicconsumption" element={<HistoricConsumptionPage />} />
            <Route path="/currentconsumption" element={<CurrentConsumptionPage />} />
            <Route path="/soporte" element={<SupportRequestsPage />} />

          </Routes>
        </AnimatePresence>
      </Layout>
    </CurrentConsumptionProvider>
  );
}

export default App;