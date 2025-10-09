// Utilidades para manejo de cámaras
export const CameraUtils = {
  // Obtener constraints optimizados para diferentes dispositivos
  getOptimizedConstraints(deviceId = null) {
    const baseConstraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      },
      audio: false
    }

    if (deviceId) {
      baseConstraints.video.deviceId = { exact: deviceId }
    }

    return baseConstraints
  },

  // Detectar tipo de cámara por label
  detectCameraType(label) {
    if (!label) return 'unknown'
    
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('front') || lowerLabel.includes('user')) {
      return 'front'
    } else if (lowerLabel.includes('back') || lowerLabel.includes('environment')) {
      return 'back'
    } else if (lowerLabel.includes('webcam') || lowerLabel.includes('integrated')) {
      return 'integrated'
    } else {
      return 'external'
    }
  },

  // Verificar capacidades del dispositivo
  async checkCameraCapabilities() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      
      return {
        hasCamera: videoDevices.length > 0,
        cameraCount: videoDevices.length,
        cameras: videoDevices.map(device => ({
          id: device.deviceId,
          label: device.label,
          type: this.detectCameraType(device.label)
        }))
      }
    } catch (error) {
      console.error('Error checking camera capabilities:', error)
      return { hasCamera: false, cameraCount: 0, cameras: [] }
    }
  }
}

// Manejo de errores de cámara
export const CameraErrors = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NO_CAMERAS: 'NO_CAMERAS',
  NOT_SUPPORTED: 'NOT_SUPPORTED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',

  getErrorMessage(errorType) {
    const messages = {
      [this.PERMISSION_DENIED]: 'Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración de tu navegador.',
      [this.NO_CAMERAS]: 'No se encontraron cámaras disponibles en este dispositivo.',
      [this.NOT_SUPPORTED]: 'Tu navegador no soporta el acceso a la cámara.',
      [this.UNKNOWN_ERROR]: 'Error desconocido al acceder a la cámara.'
    }

    return messages[errorType] || messages[this.UNKNOWN_ERROR]
  }
}