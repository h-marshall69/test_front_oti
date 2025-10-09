<template>
    <div class="camera-capture">
        <h2>Capturar Foto del DNI</h2>

        <div class="camera-container">
            <video ref="videoElement" autoplay playsinline class="camera-preview"></video>
        </div>

        <div class="controls">
            <button @click="capture" class="btn-capture">
                📸 Capturar Foto
            </button>
            <button @click="$emit('back')" class="btn-back">
                ‹ Volver
            </button>
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCamera } from '../composables/useCamera'

const props = defineProps({
    selectedCamera: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['photo-captured', 'back'])

const { getStream, stopStream, capturePhoto } = useCamera()
const videoElement = ref(null)
const error = ref('')

const startCamera = async () => {
    try {
        const stream = await getStream()
        if (videoElement.value) {
            videoElement.value.srcObject = stream
        }
    } catch (err) {
        error.value = 'Error al acceder a la cámara: ' + err.message
    }
}

const capture = () => {
    if (videoElement.value) {
        const photoData = capturePhoto(videoElement.value)
        emit('photo-captured', photoData)
    }
}

onMounted(() => {
    startCamera()
})

onUnmounted(() => {
    stopStream()
})
</script>

<style scoped>
.camera-capture {
    text-align: center;
}

.camera-container {
    margin: 20px auto;
    max-width: 600px;
}

.camera-preview {
    width: 100%;
    max-height: 400px;
    border-radius: 8px;
    background: #000;
}

.controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.btn-capture {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 50px;
    font-size: 18px;
    cursor: pointer;
}

.btn-back {
    background: #666;
    color: white;
    border: none;
    padding: 15px 20px;
    border-radius: 6px;
    cursor: pointer;
}

.error-message {
    color: #f44336;
    margin-top: 10px;
}
</style>