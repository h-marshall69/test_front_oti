<!-- components/ImageCropper.vue -->
<template>
    <div class="image-cropper">

        <div v-if="croppedPhotoUrl" class="cropped-result">
            <img :src="fullImageUrl" alt="Foto recortada" class="cropped-image">
        </div>

        <div v-else class="no-image">
            <div class="empty-icon">🖼️</div>
            <h3>No hay Foto recortada</h3>
            <p>Toma una foto primero para ver el recorte</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCameraStore } from '../stores/camera'

const cameraStore = useCameraStore()
const { capturedPhoto, croppedPhotoUrl, isLoading, error } = storeToRefs(cameraStore)

const fullImageUrl = computed(() => {
    if (croppedPhotoUrl.value) {
        // console.log(croppedPhotoUrl)
        return croppedPhotoUrl.value;
    }
    return null;
});


</script>

<style scoped>
.image-cropper {
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
}

.cropper-container {
    text-align: center;
}

.original-image {
    max-width: 100%;
    height: auto;
    border: 2px solid #28a745;
    border-radius: 8px;
    display: block;
    margin: 0 auto;
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
    height: auto;
    border: 2px solid #28a745;
    display: block;
    margin: 0 auto;
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

.empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
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