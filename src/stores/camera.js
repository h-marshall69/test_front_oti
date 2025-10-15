// stores/camera.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCameraStore = defineStore('camera', {
    state: () => {
        const initialState = {
            capturedPhoto: null,
            croppedPhotoUrl: null,
            isLoading: false,
            error: null,
            recentCroppedPhotos: [],
        };

        // Lógica para cargar desde localStorage al iniciar.
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('recentCroppedPhotos');
            if (saved) {
                // Sobrescribe 'recentCroppedPhotos' si hay datos guardados.
                initialState.recentCroppedPhotos = JSON.parse(saved);
            }
        }

        return initialState;
    },

    actions: {
        setCapturedPhoto(photoData) {
            this.capturedPhoto = photoData
        },

        setCroppedPhotoUrl(photoData) {
            this.croppedPhotoUrl = photoData
        },

        setCroppedPhoto(photoDetails) {
            if (photoDetails.nombre && photoDetails.dni && photoDetails.imageUrl) {
                const newPhoto = {
                    dni: photoDetails.dni,
                    nombre: photoDetails.nombre,
                    imageUrl: photoDetails.imageUrl,
                    timestamp: new Date().toISOString()
                }

                this.recentCroppedPhotos.unshift(newPhoto);

                if (this.recentCroppedPhotos.length > 10) {
                    this.recentCroppedPhotos.pop();
                }

                this.saveToLocalStorage()
            } else {
                console.error("setCroppedPhoto requiere un objeto con { dni, nombre, imageUrl }");
            }
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

    getters: {
        photosArray: (state) => state.recentCroppedPhotos,

        photosCount: (state) => state.recentCroppedPhotos.length
    }
})