<template>
    <div class="photo-preview">
        <h2>Vista Previa de la Foto</h2>

        <div class="preview-container">
            <img :src="photo" alt="Foto capturada" class="preview-image" />
        </div>

        <div class="instructions">
            <h3>Verifique que el DNI sea legible:</h3>
            <ul>
                <li>✅ La foto debe ser clara y nítida</li>
                <li>✅ Todos los datos deben ser visibles</li>
                <li>✅ Sin reflejos ni sombras</li>
                <li>✅ El documento debe estar completo en la imagen</li>
            </ul>
        </div>

        <div class="controls">
            <button @click="$emit('accept')" class="btn-accept">
                ✅ Aceptar Foto
            </button>
            <button @click="$emit('retake')" class="btn-retake">
                🔄 Tomar Otra Foto
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    photo: {
        type: String,
        required: true
    }
})

defineEmits(['accept', 'retake'])
</script>

<style scoped>
.photo-preview {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
}

.preview-container {
    margin: 20px 0;
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    background: #f9f9f9;
}

.preview-image {
    max-width: 100%;
    max-height: 400px;
    border-radius: 4px;
}

.instructions {
    text-align: left;
    margin: 20px 0;
    padding: 15px;
    background: #e8f5e8;
    border-radius: 6px;
    border-left: 4px solid #4CAF50;
}

.instructions h3 {
    margin-top: 0;
    color: #2e7d32;
}

.instructions ul {
    margin-bottom: 0;
}

.instructions li {
    margin: 5px 0;
}

.controls {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
}

.btn-accept {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-accept:hover {
    background: #45a049;
}

.btn-retake {
    background: #ff9800;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-retake:hover {
    background: #e68900;
}
</style>