// src/services/api.js
import axios from 'axios';

// Crea una instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: 'https://tu-api.com/api', // 👈 Reemplaza con la URL base de tu backend
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer TU_TOKEN_AQUI' // Si necesitas autenticación
  }
});

export default apiClient;