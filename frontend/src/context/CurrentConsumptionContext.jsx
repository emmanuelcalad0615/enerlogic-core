// src/context/CurrentConsumptionContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { enviarAlertaConsumo } from "../services/alertaService";

const CurrentConsumptionContext = createContext();

export const CurrentConsumptionProvider = ({ children }) => {
  const [consumption, setConsumption] = useState(0);
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);
  const [peak, setPeak] = useState(0);
  const [isCooling, setIsCooling] = useState(false);

  const enviarAlerta = async (valor) => {
    try {
      const usuario = JSON.parse(sessionStorage.getItem("usuario"));
      if (!usuario?.email) return;
      
      await enviarAlertaConsumo(usuario.email, valor);
      console.log(`ALERTA ENVIADA (${valor} kWh)`);
    } catch (e) {
      console.log("Error enviando alerta", e);
    }
  };

  const PROB_PICO_ALTO = 0.1;   
const PROB_PICO_MEDIO = 0.1;  

const calcularConsumo = (hora) => {
  let base =
    hora < 5 ? 0.8 :
    hora < 8 ? 1.5 :
    hora < 12 ? 2.5 :
    hora < 17 ? 3.8 :
    hora < 21 ? 4.5 : 2.9;

  const variacion = (Math.random() - 0.5) * 0.5;

  let picoExtra = 0;
  const r = Math.random();

  if (r < PROB_PICO_ALTO) {
    picoExtra = 5 + Math.random() * 3; // generará >5
  } else if (r < PROB_PICO_ALTO + PROB_PICO_MEDIO) {
    picoExtra = 2 + Math.random() * 3; // entre 2–5
  }

  return parseFloat(Math.max(0.5, base + variacion + picoExtra).toFixed(2));
};


  useEffect(() => {
    const inicial = calcularConsumo(new Date().getHours());
    setConsumption(inicial);

    const interval = setInterval(async () => {
      const hora = new Date().getHours();
      const nuevo = calcularConsumo(hora);
      const tiempo = new Date().toLocaleTimeString().slice(0, 5);

      setConsumption(nuevo);
      setData((prev) => {
        const updated = [...prev.slice(-20), { name: tiempo, consumo: nuevo }];

        const avg = updated.reduce((a, b) => a + b.consumo, 0) / updated.length;
        const max = Math.max(...updated.map((v) => v.consumo));

        setAverage(parseFloat(avg.toFixed(2)));
        setPeak(parseFloat(max.toFixed(2)));
        return updated;
      });
      
      // 🚨 Disparar alerta si supera 5 kWh
      if (nuevo > 5 && !isCooling) {
        enviarAlerta(nuevo);
        setIsCooling(true);
        setTimeout(() => setIsCooling(false), 30000); // evita spam 30s
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isCooling]);

  return (
    <CurrentConsumptionContext.Provider
      value={{ consumption, data, average, peak }}
    >
      {children}
    </CurrentConsumptionContext.Provider>
  );
};

export const useConsumption = () => useContext(CurrentConsumptionContext);
