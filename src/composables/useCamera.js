import { ref } from 'vue'

export function useCamera() {
  const cameras = ref([])
  const selectedCamera = ref(null)
  const stream = ref(null)
  const hasPermission = ref(false)

  const requestPermission = async () => {
    try {
      // Primero intentamos enumerar dispositivos para ver si ya tenemos permisos
      await navigator.mediaDevices.getUserMedia({ video: true })
      hasPermission.value = true
      return true
    } catch (error) {
      console.error('Error al solicitar permisos:', error)
      hasPermission.value = false
      return false
    }
  }

  const getCameras = async () => {
    try {
      if (!hasPermission.value) {
        await requestPermission()
      }
      
      // Necesitamos obtener un stream temporal para poder listar las cámaras
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true })
      const devices = await navigator.mediaDevices.enumerateDevices()
      
      // Detener el stream temporal
      tempStream.getTracks().forEach(track => track.stop())
      
      cameras.value = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Cámara ${cameras.value.length + 1}`,
          groupId: device.groupId
        }))
      
      return cameras.value
    } catch (error) {
      console.error('Error al obtener cámaras:', error)
      throw new Error('No se pudieron obtener las cámaras disponibles: ' + error.message)
    }
  }

  const setCamera = (camera) => {
    selectedCamera.value = camera
  }

  const getStream = async (cameraDevice = null) => {
    // Detener stream anterior si existe
    if (stream.value) {
      stopStream()
    }

    const constraints = {
      video: {
        deviceId: cameraDevice ? { exact: cameraDevice.deviceId } : 
                 selectedCamera.value ? { exact: selectedCamera.value.deviceId } : undefined,
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: cameraDevice?.label?.toLowerCase().includes('front') ? 'user' : 
                   cameraDevice?.label?.toLowerCase().includes('back') ? 'environment' : undefined
      },
      audio: false
    }

    try {
      stream.value = await navigator.mediaDevices.getUserMedia(constraints)
      return stream.value
    } catch (error) {
      console.error('Error al obtener stream de cámara:', error)
      
      // Fallback: intentar con constraints más simples
      try {
        const fallbackConstraints = { video: true, audio: false }
        stream.value = await navigator.mediaDevices.getUserMedia(fallbackConstraints)
        return stream.value
      } catch (fallbackError) {
        throw new Error(`No se pudo acceder a la cámara: ${error.message}`)
      }
    }
  }

  const stopStream = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => {
        track.stop()
      })
      stream.value = null
    }
  }

  const capturePhoto = (videoElement) => {
    if (!videoElement || !videoElement.videoWidth) {
      throw new Error('El elemento de video no está listo')
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    // Usar las dimensiones reales del video
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    
    // Dibujar el frame actual del video en el canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    
    // Convertir a JPEG con buena calidad
    return canvas.toDataURL('image/jpeg', 0.85)
  }

  const switchCamera = async () => {
    if (cameras.value.length < 2) {
      throw new Error('Solo hay una cámara disponible')
    }

    const currentIndex = cameras.value.findIndex(
      cam => cam.deviceId === selectedCamera.value?.deviceId
    )
    const nextIndex = (currentIndex + 1) % cameras.value.length
    const nextCamera = cameras.value[nextIndex]
    
    setCamera(nextCamera)
    
    // Reiniciar stream con la nueva cámara
    if (stream.value) {
      await getStream(nextCamera)
    }
    
    return nextCamera
  }

  return {
    cameras,
    selectedCamera,
    stream,
    hasPermission,
    requestPermission,
    getCameras,
    setCamera,
    getStream,
    stopStream,
    capturePhoto,
    switchCamera
  }
}