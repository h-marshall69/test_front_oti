<template>
    <div class="container">
        <div class="component-section">
            <PhotoDisplay />
        </div>
        <div class="component-section">
            <ImageCropper />
        </div>


    </div>

</template>

<script setup>
import PhotoDisplay from './PhotoDisplay.vue';
import ImageCropper from './ImageCropper.vue';
</script>

<style scoped>
.container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    max-width: 100vw;
    width: 100%;
}
</style>