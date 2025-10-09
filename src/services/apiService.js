// Configuración
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'https://api.tudominio.com',
  timeout: 30000,
  maxRetries: 3
}

// Cliente HTTP personalizado
async function apiClient(endpoint, options = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    },
    ...options
  }

  let retries = 0
  while (retries <= API_CONFIG.maxRetries) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data

    } catch (error) {
      retries++
      
      if (retries > API_CONFIG.maxRetries) {
        throw new Error(`Error después de ${API_CONFIG.maxRetries} intentos: ${error.message}`)
      }
      
      // Esperar antes de reintentar (exponencial backoff)
      await new Promise(resolve => 
        setTimeout(resolve, 1000 * Math.pow(2, retries))
      )
    }
  }
}

// Servicio específico para DNI
export async function uploadPhoto(photoData) {
  try {
    // Convertir base64 a Blob
    const base64Response = await fetch(photoData)
    const blob = await base64Response.blob()
    
    // Crear FormData
    const formData = new FormData()
    formData.append('dni_photo', blob, `dni_${Date.now()}.jpg`)
    formData.append('upload_timestamp', new Date().toISOString())
    formData.append('metadata', JSON.stringify({
      user_agent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    }))

    // Usar apiClient para la subida
    const result = await apiClient('/api/v1/dni/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        // No Content-Type para FormData, el navegador lo establece automáticamente
      }
    })

    return result

  } catch (error) {
    console.error('Error en uploadPhoto:', error)
    throw new Error(`Falló la subida de la foto: ${error.message}`)
  }
}

// Servicios adicionales
export async function getUploadStatus(uploadId) {
  return apiClient(`/api/v1/dni/status/${uploadId}`)
}

export async function getUploadHistory() {
  return apiClient('/api/v1/dni/history')
}

export async function deleteUpload(uploadId) {
  return apiClient(`/api/v1/dni/upload/${uploadId}`, {
    method: 'DELETE'
  })
}