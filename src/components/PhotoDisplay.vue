<!-- components/PhotoDisplay.vue -->
<template>
    <div class="photo-display">
        <div v-if="capturedPhoto" class="photo-container">
            <img :src="capturedPhoto" alt="Foto capturada" class="displayed-photo">
            <div class="photo-actions">
                <button @click="downloadPhoto">Descargar</button>
                <button @click="clearPhoto" class="clear-btn">Eliminar</button>
            </div>
        </div>

        <div v-else class="no-photo">
            <p>No hay foto capturada</p>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCameraStore } from '@/stores/camera'

const cameraStore = useCameraStore()
const { capturedPhoto } = storeToRefs(cameraStore)

const downloadPhoto = () => {
    if (capturedPhoto.value) {
        const link = document.createElement('a')
        link.href = capturedPhoto.value
        link.download = 'foto-capturada.jpg'
        link.click()
    }
}

const clearPhoto = () => {
    cameraStore.clearPhoto()
}
</script>

<style scoped>
.photo-display {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
}

.displayed-photo {
    max-width: 100%;
    border: 2px solid #28a745;
    border-radius: 8px;
    margin: 20px 0;
}

.photo-actions {
    margin: 20px 0;
}

.photo-actions button {
    margin: 0 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.photo-actions button:first-child {
    background-color: #28a745;
    color: white;
}

.clear-btn {
    background-color: #dc3545;
    color: white;
}

.no-photo {
    padding: 40px;
    background-color: #f8f9fa;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    color: #6c757d;
}
</style>