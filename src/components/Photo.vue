<template>
    <div class="container-photo">
        <div>
            <PhotoTaken />
        </div>
        <div>
            <CroppedPhoto />
        </div>


    </div>

</template>

<script setup>
import PhotoTaken from '../components/PhotoTaken.vue';
import CroppedPhoto from '../components/CroppedPhoto.vue';
</script>

<style scoped>
.container-photo {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    max-width: 100vw;
    width: 100%;
}
</style>