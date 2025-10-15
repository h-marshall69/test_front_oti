<!-- components/RecentPhotos.vue -->
<template>
    <div class="recent-photos">
        <div class="recent-header">
            <h2>Fotos Recortadas Recientes</h2>
            <div class="header-actions">
                <div class="photo-count">{{ photosCount }} fotos</div>
            </div>
        </div>

        <div v-if="recentPhotos.length === 0" class="empty-state">
            <div class="empty-icon">🗂️</div>
            <h3>No hay fotos recortadas</h3>
            <p>Toma y recorta una foto para verla aquí</p>
        </div>

        <div v-else class="photos-grid">
            <div v-for="(photo, index) in recentPhotos" :key="index" class="photo-card"
                @click="selectPhoto(photo, index)">
                <div class="photo-image-container">
                    <img :src="photo.imageUrl" :alt="`Foto de ${photo.nombre}`" class="photo-image" loading="lazy" />
                </div>

                <div class="photo-info">
                    <div class="photo-name">{{ photo.nombre }}</div>
                    <div class="photo-dni">DNI: {{ photo.dni }}</div>
                    <div class="photo-date">{{ formatDate(photo.timestamp) }}</div>
                </div>
            </div>
        </div>

        <!-- Modal para vista ampliada -->
        <div v-if="selectedPhoto" class="photo-modal" @click="closeModal">
            <div class="modal-content" @click.stop>
                <button class="modal-close" @click="closeModal">×</button>
                <img :src="selectedPhoto.imageUrl" :alt="`Foto de ${selectedPhoto.nombre}`" class="modal-image" />

                <div class="modal-info">
                    <div><strong>Nombre:</strong> {{ selectedPhoto.nombre }}</div>
                    <div><strong>DNI:</strong> {{ selectedPhoto.dni }}</div>
                    <div><strong>Fecha:</strong> {{ formatDate(selectedPhoto.timestamp) }}</div>
                    <div><strong>Hora:</strong> {{ formatTime(selectedPhoto.timestamp) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useCameraStore } from '../stores/camera'

const cameraStore = useCameraStore()
const { recentCroppedPhotos: recentPhotos, photosCount } = storeToRefs(cameraStore)

const selectedPhoto = ref(null)
const selectedPhotoIndex = ref(null)

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

// Formatear hora
const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Seleccionar foto para vista modal
const selectPhoto = (photo, index) => {
    selectedPhoto.value = photo
    selectedPhotoIndex.value = index
}

// Cerrar modal
const closeModal = () => {
    selectedPhoto.value = null
    selectedPhotoIndex.value = null
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
    margin: 20px 0;
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
    font-weight: 600;
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
    font-weight: 500;
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
    font-size: 1.2em;
    font-weight: 600;
}

.empty-state p {
    margin: 0;
    font-size: 0.95em;
    opacity: 0.8;
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

.photo-info {
    padding: 12px;
    background: #f8f9fa;
}

.photo-name {
    font-weight: 600;
    color: #333;
    font-size: 0.9em;
    margin-bottom: 4px;
    line-height: 1.2;
}

.photo-dni {
    color: #6c757d;
    font-size: 0.8em;
    margin-bottom: 4px;
    line-height: 1.2;
}

.photo-date {
    color: #6c757d;
    font-size: 0.8em;
    line-height: 1.2;
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
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.modal-content {
    position: relative;
    background: white;
    border-radius: 12px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    text-align: center;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
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
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
}

.modal-close:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
}

.modal-image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    padding: 40px;
    border-radius: 8px;
}

.modal-info {
    padding: 20px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    font-size: 0.95em;
    color: #333;
    text-align: left;
}

.modal-info div {
    margin: 8px 0;
    padding: 4px 0;
}

.modal-info strong {
    color: #495057;
    font-weight: 600;
    min-width: 80px;
    display: inline-block;
}

/* Responsive Design */
@media (max-width: 768px) {
    .recent-photos {
        padding: 16px;
        margin: 10px 0;
        border-radius: 8px;
    }

    .recent-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 20px;
    }

    .header-actions {
        width: 100%;
        justify-content: space-between;
    }

    .recent-header h2 {
        font-size: 1.2em;
    }

    .photos-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
    }

    .photo-image-container {
        height: 140px;
    }

    .modal-content {
        max-width: 95vw;
        max-height: 95vh;
        margin: 10px;
    }

    .modal-image {
        padding: 20px;
        max-height: 60vh;
    }

    .modal-info {
        padding: 16px;
        font-size: 0.9em;
    }

    .empty-state {
        padding: 40px 20px;
    }

    .empty-icon {
        font-size: 48px;
    }
}

@media (max-width: 480px) {
    .photos-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .photo-image-container {
        height: 120px;
    }

    .photo-info {
        padding: 8px;
    }

    .photo-name,
    .photo-dni,
    .photo-date {
        font-size: 0.75em;
    }

    .modal-image {
        padding: 15px;
        max-height: 50vh;
    }

    .modal-info {
        padding: 12px;
        font-size: 0.85em;
    }

    .modal-info div {
        margin: 6px 0;
    }

    .modal-close {
        top: 10px;
        right: 10px;
        width: 35px;
        height: 35px;
        font-size: 20px;
    }
}

@media (max-width: 320px) {
    .photos-grid {
        grid-template-columns: 1fr;
    }

    .photo-image-container {
        height: 160px;
    }
}

/* Scrollbar personalizado para el modal */
.modal-content::-webkit-scrollbar {
    width: 8px;
}

.modal-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 0 0 12px 0;
}

.modal-content::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Mejoras de accesibilidad */
.photo-card:focus-visible {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

.modal-close:focus-visible {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

/* Efectos de carga suaves */
.photo-image {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.photo-image[src] {
    animation: none;
    background: none;
}
</style>