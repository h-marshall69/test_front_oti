<!-- components/CameraCapture.vue -->
<template>
    <div class="camera-capture p-4 space-y-4">
        <video ref="videoElement" autoplay playsinline class="camera-preview  rounded-lg shadow-md"></video>
        <canvas ref="canvasElement" style="display: none;"></canvas>

        <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

        <div>
            <label for="camera-select" class="mb-2 block text-sm font-medium text-gray-700">Seleccionar Cámara</label>
            <Dropdown id="camera-select" v-model="selectedCamera" :options="videoDevices" optionLabel="label"
                optionValue="deviceId" placeholder="Selecciona un dispositivo" @change="startCamera" class="w-full"
                :disabled="videoDevices.length === 0 || loading" />
        </div>

        <div class="controls flex justify-center space-x-4">
            <Button @click="startCamera" :disabled="isCameraActive || !selectedCamera" label="Activar Cámara"
                icon="pi pi-video" class="p-button-success" />
            <Button @click="savePhoto" :disabled="!isCameraActive" label="Tomar Foto" icon="pi pi-camera" />
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { useCameraStore } from '@/stores/camera'

// Componentes PrimeVue
import Message from 'primevue/message';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

// --- Refs para elementos del DOM ---
const videoElement = ref(null);
const canvasElement = ref(null);

// --- Estado reactivo del componente ---
const isCameraActive = ref(false);
const loading = ref(true);
const stream = ref(null);
const selectedCamera = ref(null);
const videoDevices = ref([]);
const error = ref(null); // Ref para manejar errores de forma visible

const cameraStore = useCameraStore()

// --- Funciones ---

/**
 * Detiene el stream de video actual y libera la cámara.
 * Es crucial para evitar fugas de recursos.
 */
const stopCamera = () => {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
        videoElement.value.srcObject = null;
        isCameraActive.value = false;
        stream.value = null;
    }
};

/**
 * Inicia la cámara con el dispositivo seleccionado.
 * Primero detiene cualquier stream activo para cambiar de cámara limpiamente.
 */
const startCamera = async () => {
    // Si no hay una cámara seleccionada, no hacer nada.
    if (!selectedCamera.value) return;

    // Detener la cámara anterior antes de iniciar una nueva
    stopCamera();
    error.value = null; // Limpiar errores previos

    try {
stream.value = await navigator.mediaDevices.getUserMedia({
    video: {
        deviceId: { exact: selectedCamera.value },
        aspectRatio: 16/9
    }
});

        videoElement.value.srcObject = stream.value;
        isCameraActive.value = true;
    } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        error.value = 'No se pudo acceder a la cámara seleccionada. Verifica los permisos.';
    }
};

/**
 * Captura el frame actual del video y lo guarda en el store de Pinia.
 */
const savePhoto = () => {
    const video = videoElement.value;
    const canvas = canvasElement.value;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    cameraStore.setCapturedPhoto(canvas.toDataURL('image/jpeg'));
};

/**
 * Obtiene la lista de dispositivos de video disponibles.
 */
const getCameras = async () => {
    loading.value = true;
    error.value = null;
    let tempStream = null; // Variable para el stream temporal

    try {
        // Pedir permiso primero para obtener las etiquetas de los dispositivos
tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');

        if (cameras.length === 0) {
            error.value = "No se encontraron cámaras disponibles.";
            return;
        }

        videoDevices.value = cameras.map((device, index) => ({
            label: device.label || `Cámara ${index + 1}`,
            deviceId: device.deviceId
        }));

        // Seleccionar la primera cámara por defecto si aún no hay una seleccionada
        if (!selectedCamera.value && videoDevices.value.length > 0) {
            selectedCamera.value = videoDevices.value[0].deviceId;
            await startCamera(); // Iniciar la cámara por defecto automáticamente
        }
    } catch (err) {
        console.error("Error al enumerar dispositivos:", err);
        if (err.name === 'NotAllowedError') {
            error.value = 'Acceso a la cámara denegado. Por favor, habilita los permisos en tu navegador.';
        } else {
            error.value = 'No se pudo acceder a los dispositivos de video.';
        }
    } finally {
        loading.value = false;
    }
};

// --- Ciclo de Vida ---
onMounted(getCameras);

// Asegurarse de detener la cámara al destruir el componente
onUnmounted(stopCamera);
</script>

<style scoped>
.camera-preview {
    width: 100%;
    height: 100%;
    object-fit: cover; 
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