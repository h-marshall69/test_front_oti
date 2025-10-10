<!-- components/ImageCropper.vue -->
<template>
    <div class="image-cropper">

        <div v-if="capturedPhoto && !croppedPhotoUrl" class="cropper-container">
            <div class="image-preview">
                <img :src="capturedPhoto" alt="Imagen a recortar" class="original-image">
                <div class="crop-overlay">
                    <div class="crop-area"></div>
                </div>
            </div>

            <button @click="cropImage" :disabled="isLoading" class="crop-btn">
                <span v-if="isLoading">Procesando...</span>
                <span v-else>Recortar Imagen</span>
            </button>
        </div>

        <div v-else-if="croppedPhotoUrl" class="cropped-result">
            <h3>Imagen Recortada</h3>
            <img :src="croppedPhotoUrl" alt="Imagen recortada" class="cropped-image">
            <div class="result-actions">
                <button @click="downloadCropped" class="download-btn">Descargar</button>
                <button @click="resetCrop" class="reset-btn">Recortar Otra</button>
            </div>
        </div>

        <div v-else class="no-image">
            <p>No hay imagen para recortar</p>
            <p class="hint">Toma una foto primero para habilitar el recorte</p>
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCameraStore } from '@/stores/camera'
import { CropService } from '@/services/cropService'

const cameraStore = useCameraStore()
const { capturedPhoto, croppedPhotoUrl, isLoading, error } = storeToRefs(cameraStore)

const cropImage = async () => {
    try {
        await CropService.cropImage(capturedPhoto.value)
    } catch (err) {
        console.error('Error en el recorte:', err)
    }
}

const downloadCropped = () => {
    if (croppedPhotoUrl.value) {
        const link = document.createElement('a')
        link.href = croppedPhotoUrl.value
        link.download = 'imagen-recortada.jpg'
        link.click()
    }
}

const resetCrop = () => {
    cameraStore.setCroppedPhoto(null)
}
</script>

<style scoped>
.image-cropper {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    background: white;
}

.cropper-container {
    text-align: center;
}

.image-preview {
    position: relative;
    display: inline-block;
    margin: 20px 0;
}

.original-image {
    max-width: 100%;
    max-height: 400px;
    border-radius: 8px;
}

.crop-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
}

.crop-area {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border: 2px solid #007bff;
    background: transparent;
}

.crop-btn {
    padding: 15px 30px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin: 20px 0;
}

.crop-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
}

.cropped-result {
    text-align: center;
}

.cropped-image {
    max-width: 100%;
    max-height: 400px;
    border: 2px solid #28a745;
    border-radius: 8px;
    margin: 20px 0;
}

.result-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.download-btn {
    padding: 12px 24px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.reset-btn {
    padding: 12px 24px;
    background: #ffc107;
    color: black;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.no-image {
    text-align: center;
    padding: 40px;
    background: #f8f9fa;
    border-radius: 8px;
    color: #6c757d;
}

.hint {
    font-size: 14px;
    margin-top: 10px;
}

.error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 6px;
    margin-top: 15px;
    border: 1px solid #f5c6cb;
}
</style>