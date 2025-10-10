<!-- components/CameraCapture.vue -->
<template>
    <div class="camera-capture">
        <video ref="videoElement" autoplay class="camera-preview"></video>
        <canvas ref="canvasElement" style="display: none;"></canvas>

        <div class="controls">
            <button @click="startCamera" :disabled="isCameraActive">Activar Cámara</button>
            <button @click="savePhoto" :disabled="!isCameraActive">Tomar Foto</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useCameraStore } from '@/stores/camera'

const videoElement = ref(null)
const canvasElement = ref(null)
const isCameraActive = ref(false)
const stream = ref(null)

const cameraStore = useCameraStore()

const startCamera = async () => {
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({
            video: { width: 600, height: 400 }
        })
        videoElement.value.srcObject = stream.value
        isCameraActive.value = true
    } catch (error) {
        console.error('Error al acceder a la cámara:', error)
        alert('No se pudo acceder a la cámara')
    }
}

const savePhoto = () => {
    const context = canvasElement.value.getContext('2d')
    canvasElement.value.width = videoElement.value.videoWidth
    canvasElement.value.height = videoElement.value.videoHeight
    context.drawImage(videoElement.value, 0, 0)

    cameraStore.setCapturedPhoto(canvasElement.value.toDataURL('image/jpeg'))
}

onUnmounted(() => {
    stopCamera()
})
</script>

<style scoped>
.camera-capture {
    max-width: 600px;
    margin: 0 auto;
}

.camera-preview {
    width: 100%;
    max-width: 640px;
    border: 2px solid #ccc;
    border-radius: 8px;
}

.controls {
    margin: 20px 0;
}

.controls button {
    margin: 0 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.controls button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.preview {
    margin-top: 20px;
    text-align: center;
}

.preview-image {
    max-width: 300px;
    border: 2px solid #007bff;
    border-radius: 8px;
    margin: 10px 0;
}
</style>