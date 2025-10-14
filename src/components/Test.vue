<template>
  <div>
    <h3>Nose</h3>
    <button @click="handleClick">Hacer petición</button>
  </div>
</template>

<script setup>
import { SelectorDates } from '@/services/selectorDates';
import { ref } from 'vue';

const responseData = ref(null);

const handleClick = async () => {
  try {
    const data = await SelectorDates.uncknow();
    responseData.value = data;
    console.log('Respuesta recibida:', data);
  } catch (error) {
    console.error('Error al hacer la petición:', error);
  }
};
</script>

<style scoped>
button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #2980b9;
}
</style>
