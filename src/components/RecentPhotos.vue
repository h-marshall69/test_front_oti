<!-- components/RecentPhotos.vue -->
<template>
    <div class="recent-photos">
        <div class="recent-header">
            <h2>Fotos Recortadas Recientes</h2>
            <div class="header-actions">

            </div>
        </div>

        <div v-if="recentPhotos.length === 0" class="empty-state">
            <div class="empty-icon">📷</div>
            <h3>No hay fotos recortadas</h3>
            <p>Toma y recorta una foto para verla aquí</p>
        </div>

        <div v-else class="photos-grid">
            <div v-for="photo in recentPhotos" :key="photo.id" class="photo-card" @click="selectPhoto(photo)">
                <div class="photo-image-container">
                    <img :src="photo.url" :alt="`Foto recortada ${photo.date}`" class="photo-image" loading="lazy" />
                    <div class="photo-overlay">
                        <button @click.stop="downloadPhoto(photo)" class="action-btn download-btn"
                            title="Descargar foto">
                            ⬇️
                        </button>
                    </div>
                </div>

                <div class="photo-info">
                    <div class="photo-date">{{ formatDate(photo.timestamp) }}</div>
                    <div class="photo-time">{{ photo.time }}</div>
                </div>
            </div>
        </div>

        <!-- Modal para vista ampliada -->
        <div v-if="selectedPhoto" class="photo-modal" @click="closeModal">
            <div class="modal-content" @click.stop>
                <button class="modal-close" @click="closeModal">×</button>
                <img :src="selectedPhoto.url" :alt="`Foto ${selectedPhoto.date}`" class="modal-image" />

                <div class="modal-info">
                    <div>Fecha: {{ formatDate(selectedPhoto.timestamp) }}</div>
                    <div>Hora: {{ selectedPhoto.time }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useCameraStore } from '@/stores/camera'

const cameraStore = useCameraStore()
const { recentCroppedPhotos: recentPhotos } = storeToRefs(cameraStore)

const selectedPhoto = ref(null)

// Formatear fecha de manera más legible
const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
        return 'Hoy'
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Ayer'
    } else {
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }
}

// Seleccionar foto para vista modal
const selectPhoto = (photo) => {
    selectedPhoto.value = photo
}

// Cerrar modal
const closeModal = () => {
    selectedPhoto.value = null
}

// Descargar foto
const downloadPhoto = (photo) => {
    const link = document.createElement('a')
    link.href = photo.url
    link.download = `foto-recortada-${photo.id}.jpg`
    link.click()
}

// Eliminar foto individual
const deletePhoto = (photoId) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
        cameraStore.removeRecentPhoto(photoId)

        // Si la foto eliminada es la seleccionada en el modal, cerrar modal
        if (selectedPhoto.value && selectedPhoto.value.id === photoId) {
            closeModal()
        }
    }
}

// Eliminar todas las fotos
const clearAllPhotos = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todas las fotos?')) {
        cameraStore.clearRecentPhotos()
        closeModal()
    }
}

// Cerrar modal con tecla Escape
onMounted(() => {
    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            closeModal()
        }
    }

    document.addEventListener('keydown', handleEscape)

    // Cleanup
    return () => {
        document.removeEventListener('keydown', handleEscape)
    }
})
</script>

<style scoped>
.recent-photos {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.recent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
}

.recent-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.4em;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.photo-count {
    background: #e9ecef;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.9em;
    color: #6c757d;
}

.clear-all-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background 0.2s;
}

.clear-all-btn:hover {
    background: #c82333;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6c757d;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
}

.empty-state h3 {
    margin: 0 0 8px 0;
    color: #495057;
}

.empty-state p {
    margin: 0;
    font-size: 0.95em;
}

.photos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.photo-card {
    border: 1px solid #e9ecef;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    background: white;
}

.photo-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #007bff;
}

.photo-image-container {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.photo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.photo-card:hover .photo-image {
    transform: scale(1.05);
}

.photo-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.photo-card:hover .photo-overlay {
    opacity: 1;
}

.action-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
}

.action-btn:hover {
    transform: scale(1.1);
}

.download-btn {
    background: #28a745;
    color: white;
}

.delete-btn {
    background: #dc3545;
    color: white;
}

.photo-info {
    padding: 12px;
    background: #f8f9fa;
}

.photo-date {
    font-weight: 600;
    color: #333;
    font-size: 0.9em;
    margin-bottom: 4px;
}

.photo-time {
    color: #6c757d;
    font-size: 0.8em;
}

/* Modal Styles */
.photo-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    padding: 20px;
}

.modal-content {
    position: relative;
    background: white;
    border-radius: 12px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    text-align: center;
}

.modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    z-index: 1;
}

.modal-close:hover {
    background: rgba(0, 0, 0, 0.9);
}

.modal-image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    padding: 40px;
}

.modal-download-btn {
    padding: 10px 20px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-delete-btn {
    padding: 10px 20px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-info {
    padding: 16px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    font-size: 0.9em;
    color: #6c757d;
}

.modal-info div {
    margin: 4px 0;
}

/* Responsive */
@media (max-width: 768px) {
    .recent-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }

    .header-actions {
        width: 100%;
        justify-content: space-between;
    }

    .photos-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
    }

    .photo-image-container {
        height: 140px;
    }

    .modal-content {
        max-width: 95vw;
        max-height: 95vh;
    }

    .modal-image {
        padding: 20px;
    }
}

@media (max-width: 480px) {
    .photos-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>