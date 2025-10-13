<!-- components/PhotoDisplay.vue -->
<template>
    <div class="photo-display">
        <div v-if="cameraStore.capturedPhoto" class="flex flex-col gap-4">
            <img :src="cameraStore.capturedPhoto" alt="Foto capturada" class="displayed-photo">

            <div>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-id-card"></i>
                    </span>
                    <InputText v-model="dni" @input="formatDniInput" type="text" maxlength="8"
                        placeholder="DNI (8 dígitos)" />
                </div>
                <small v-if="dni.length > 0" class="mt-2 block"
                    :class="{ 'text-green-600': isValidDni, 'text-red-600': !isValidDni }">
                    <span v-if="isValidDni">✓ DNI válido.</span>
                    <span v-else>✗ El DNI debe contener 8 dígitos numéricos.</span>
                </small>
            </div>

            <Button @click="uploadPhoto" :disabled="!isValidDni || loading" label="Subir Foto" icon="pi pi-upload"
                class="w-full justify-center p-button-lg" :loading="loading" />

            <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
        </div>

        <div v-else class="text-center">
            <div class="empty-icon">📷</div>
            <h3>No hay foto capturada</h3>
            <p>Usa la cámara para tomar una foto.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useCameraStore } from '@/stores/camera';
import axios from 'axios';
import { makeFormData } from '@/abadeer_truco/utilities/FormDataMaker';

// Importación de componentes de PrimeVue
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';

// --- Estado Reactivo ---
const dni = ref("");
const loading = ref(false);
const error = ref('');
const cameraStore = useCameraStore();

const { capturedPhoto } = storeToRefs(cameraStore)

// --- Propiedades Computadas ---
const isValidDni = computed(() => /^\d{8}$/.test(dni.value));

// --- Funciones ---
/**
 * Formatea el input del DNI para aceptar solo números.
 */
function formatDniInput() {
    dni.value = dni.value.replace(/\D/g, '');
}

/**
 * Convierte una imagen en formato base64 a un objeto Blob.
 * @param {string} base64String - La imagen en formato base64.
 * @returns {Blob}
 */
function base64ToBlob(base64String) {
    const parts = base64String.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
}

/**
* Sube la foto y los datos al servidor.
*/
async function uploadPhoto() {
    if (!isValidDni.value) {
        error.value = 'Debe ingresar un DNI válido de 8 dígitos.';
        return;
    }

    loading.value = true;
    error.value = '';


    try {
        // const formData = new FormData();
        // const imageBlob = base64ToBlob(cameraStore.capturedPhoto);

        // formData.append('dni', dni.value);
        // formData.append('image', imageBlob, `photo_${dni.value}.jpg`);
        // const codes = ["00000000-0000-0000-0000-000000000000"];
        // codes.forEach(code => formData.append('codes[]', code));

        const formData = makeFormData({
            imageString: cameraStore.capturedPhoto,
            dni: dni.value,
            codes: ["00000000-0000-0000-0000-000000000000"]
        });

        const response = await axios.post("http://localhost:8000/api/tomar_fotos", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        console.log("Respuesta del servidor:", response.data);
        // cameraStore.clearPhoto(); // Limpia la foto de la store
        // cameraStore.setCapturedPhoto(response.data.imageUrl);
        cameraStore.setCroppedPhoto(response.data.imageUrl);
        dni.value = ""; // Limpia el DNI

    } catch (err) {
        console.error("Error al subir la foto:", err);
        error.value = 'Error al subir la foto: ' + (err.response?.data?.message || err.message);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.photo-display {
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
}

.displayed-photo {
    max-width: 100%;
    height: auto;
    border: 2px solid #28a745;
    border-radius: 8px;
    display: block;
    margin: 0 auto;
}

.text-center {
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
</style>