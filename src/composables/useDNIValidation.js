// Simulador de validación de DNI
export async function validateDNI(photoData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Simular análisis de imagen
        const img = new Image()
        img.src = photoData
        
        img.onload = () => {
          // Validaciones simuladas basadas en características de la imagen
          const validations = {
            hasReasonableSize: img.width >= 640 && img.height >= 480,
            hasGoodAspectRatio: Math.abs((img.width / img.height) - 1.5) < 0.3, // ~3:2 ratio
            isColorImage: true, // Asumimos que es a color
            isNotEmpty: img.width > 0 && img.height > 0
          }
          
          const isValid = Object.values(validations).every(Boolean)
          
          // Simular probabilidad de éxito (85% en desarrollo)
          const randomSuccess = Math.random() < 0.85
          const finalValidation = isValid && randomSuccess
          
          console.log('Validación DNI:', {
            validations,
            randomSuccess,
            finalValidation,
            imageSize: `${img.width}x${img.height}`
          })
          
          resolve(finalValidation)
        }
        
        img.onerror = () => {
          reject(new Error('Error al cargar la imagen para validación'))
        }
      } catch (error) {
        reject(new Error('Error en validación de DNI: ' + error.message))
      }
    }, 1500) // Simular tiempo de procesamiento
  })
}

// Función mejorada con OCR simulado
export async function validateDNIWithOCR(photoData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular resultados de OCR
      const mockOCRResults = {
        hasText: Math.random() < 0.9,
        hasNumbers: Math.random() < 0.8,
        documentType: Math.random() < 0.7 ? 'DNI' : 'Otro',
        confidence: Math.random() * 0.5 + 0.5 // 0.5 - 1.0
      }
      
      const isValid = mockOCRResults.hasText && 
                     mockOCRResults.hasNumbers && 
                     mockOCRResults.confidence > 0.6
      
      console.log('Resultados OCR simulados:', mockOCRResults)
      resolve(isValid)
    }, 2000)
  })
}