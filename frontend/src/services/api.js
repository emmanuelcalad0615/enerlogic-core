import axios from "axios";

const API_URL = "http://localhost:4000/api"; // ajusta si tu backend usa otro puerto

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor: agrega automáticamente el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
