// stores/camera.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCameraStore = defineStore('camera', {
  state: () => ({
    capturedPhoto: null,
    croppedPhotoUrl: null,
    isLoading: false,
    error: null,
    recentCroppedPhotos: [] // Array para almacenar fotos recortadas recientes
  }),
  
  actions: {
    setCapturedPhoto(photoData) {
      this.capturedPhoto = photoData
    },
    
    setCroppedPhoto(url) {
      this.croppedPhotoUrl = url
      
      // Agregar a fotos recientes
      if (url) {
        this.addToRecentPhotos(url)
      }
    },
    
    addToRecentPhotos(photoUrl) {
      const newPhoto = {
        id: Date.now() + Math.random(),
        url: photoUrl,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES')
      }
      
      // Agregar al inicio del array
      this.recentCroppedPhotos.unshift(newPhoto)
      
      // Mantener solo las últimas 20 fotos
      if (this.recentCroppedPhotos.length > 6) {
        this.recentCroppedPhotos = this.recentCroppedPhotos.slice(0, 6)
      }
      
      // Guardar en localStorage para persistencia
      this.saveToLocalStorage()
    },
    
    removeRecentPhoto(photoId) {
      this.recentCroppedPhotos = this.recentCroppedPhotos.filter(photo => photo.id !== photoId)
      this.saveToLocalStorage()
    },
    
    clearRecentPhotos() {
      this.recentCroppedPhotos = []
      this.saveToLocalStorage()
    },
    
    saveToLocalStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentCroppedPhotos', JSON.stringify(this.recentCroppedPhotos))
      }
    },
    
    loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('recentCroppedPhotos')
        if (saved) {
          this.recentCroppedPhotos = JSON.parse(saved)
        }
      }
    },
    
    setLoading(loading) {
      this.isLoading = loading
    },
    
    setError(error) {
      this.error = error
    },
    
    clearPhoto() {
      this.capturedPhoto = null
      this.croppedPhotoUrl = null
      this.error = null
    }
  },
  
  // Inicializar cargando desde localStorage
  onInit() {
    this.loadFromLocalStorage()
  }
})