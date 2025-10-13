<template>
    <div id="takePhoto">
        <label for="">Hikigaya System</label>

        <div class="container">
            <div class="component-section">
                <h2>Tomar Foto</h2>
                <CameraCapture />
            </div>

            <div class="component-section">
                <h2>Foto Capturada</h2>
                <Photo />
            </div>

            <div class="component">
                <!-- <div class="component-section recent-section"> -->
                <RecentPhotos />
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import CameraCapture from '@/components/CameraCapture.vue';
import RecentPhotos from '@/components/RecentPhotos.vue';
import Photo from '@/components/Photo.vue';
</script>

<style scoped>
#takePhoto {
    font-family: Arial, sans-serif;
    padding: 20px;
}

.container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    max-width: 100vw;
    width: 100%;
}

.component-section {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    background-color: #fafafa;
}

@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
    }
}
</style>
