<template>
    <div class="container-foto">
        <div class="component-section-foto">
            <h3>Tomar Foto</h3>
            <TakePhoto />
        </div>

        <div class="component-section-foto">
            <h3>Foto Capturada</h3>
            <Photo />
        </div>

        <div class="component">
            <RecentPhotos />
        </div>
    </div>
</template>

<script setup>
import TakePhoto from '../components/TakePhoto.vue'
import RecentPhotos from '../components/RecentPhotos.vue';
import Photo from '../components/Photo.vue';
import Test from '../components/Test.vue';
</script>

<style scoped>
.container-foto {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    max-width: 100vw;
    width: 100%;
}

.component-section-foto {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    background-color: #fafafa;
}

@media (max-width: 768px) {
    .container-foto {
        grid-template-columns: 1fr;
    }
}
</style>
